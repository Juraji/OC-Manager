import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {map, Observable} from 'rxjs'

import {numberSort} from '#core/arrays'
import {BooleanInput} from '#core/ng-extensions'
import {filterNotNull, ObservableInputs} from '#core/rxjs'
import {OcMemory} from '#models/memories.model'

interface TimelineMemory extends OcMemory {
  even: boolean
}

type MonthlyMap = Record<number, TimelineMemory[]>
type YearlyMap = Record<number, MonthlyMap>

@Component({
  selector: 'ocm-memory-timeline',
  templateUrl: './memory-timeline.component.html',
  styleUrls: ['./memory-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryTimelineComponent implements OnChanges {
  private readonly inputs = new ObservableInputs()
  readonly groupSortFn = numberSort<number>(e => e, true)

  @Input()
  memories: Nullable<OcMemory[]>
  memories$ = this.inputs.observe(() => this.memories)

  @Input()
  @BooleanInput()
  singleSided: boolean | string = false

  memoriesByDate$: Observable<YearlyMap> = this.memories$
    .pipe(
      filterNotNull(),
      map(memories => memories
        .map((m, idx) => ({...m, even: !this.singleSided && (idx % 2) !== 0} as TimelineMemory))
        .reduce((acc, next) => {
          const mDate = new Date(next.date)
          const year: number = mDate.getFullYear()
          const month: number = mDate.getMonth()
          const monthMap: MonthlyMap = acc[year] || {} as MonthlyMap
          const memories: TimelineMemory[] = monthMap[month] || []

          return {...acc, [year]: {...monthMap, [month]: [...memories, next]}};
        }, {} as YearlyMap)),
    )

  constructor() {
  }

  ngOnChanges() {
    this.inputs.onChanges()
  }
}
