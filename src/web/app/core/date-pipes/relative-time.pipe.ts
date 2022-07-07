import {ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform} from '@angular/core';

import {DateDiffPipe} from '#core/date-pipes/date-diff.pipe'

@Pipe({name: 'relativeTime'})
export class RelativeTimePipe implements PipeTransform, OnDestroy {
  private readonly dateDiff = new DateDiffPipe()
  private timer: Nullable<number>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
  }

  transform(value: Nullable<number | string | Date>, reference?: Nullable<number | string | Date>): string | null {
    this.removeTimer()
    const ms = this.dateDiff.transform(value, reference)

    if (typeof ms !== 'number' || Number.isNaN(ms)) {
      this.setTimer(1000)
      return '';
    }

    this.setTimer(RelativeTimePipe.getMsUntilUpdate(ms))
    const roundAbs = (n: number) => Math.round(Math.abs(n))

    const seconds = roundAbs(ms / 1e3)
    const minutes = roundAbs(seconds / 60);
    const hours = roundAbs(minutes / 60);
    const days = roundAbs(hours / 24);
    const months = roundAbs(days / 30.416);
    const years = roundAbs(days / 365);

    if (seconds <= 45) {
      return 'a few seconds';
    } else if (seconds <= 90) {
      return 'a minute';
    } else if (minutes <= 45) {
      return minutes + ' minutes';
    } else if (minutes <= 90) {
      return 'an hour';
    } else if (hours <= 22) {
      return hours + ' hours';
    } else if (hours <= 36) {
      return 'a day';
    } else if (days <= 25) {
      return days + ' days';
    } else if (days <= 45) {
      return 'a month';
    } else if (days <= 345) {
      return months + ' months';
    } else if (days <= 545) {
      return 'a year';
    } else { // (days > 545)
      return years + ' years';
    }
  }

  ngOnDestroy() {
    this.removeTimer()
  }

  private setTimer(timeToUpdate: number) {
    this.timer = this.ngZone.runOutsideAngular(() =>
      window.setTimeout(() =>
        this.ngZone.run(() => this.changeDetectorRef.markForCheck()), timeToUpdate))
  }

  private removeTimer() {
    if (!!this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }

  private static getMsUntilUpdate(seconds: number) {
    const min = 6e4;
    const hr = min * 60;
    const day = hr * 24;
    if (seconds < min) { // less than 1 min, update every 2 secs
      return 2e3;
    } else if (seconds < hr) { // less than an hour, update every 30 secs
      return 3e4;
    } else if (seconds < day) { // less than a day, update every 5 mins
      return 3e5;
    } else { // update every hour
      return 36e5;
    }
  }
}
