import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {map} from 'rxjs'

import {takeUntilDestroyed} from '#core/rxjs'

import {MemoryEditStore} from './memory-edit.store'

@Component({
  selector: 'ocm-memory-edit',
  templateUrl: './memory-edit.component.html',
  styleUrls: ['./memory-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MemoryEditStore]
})
export class MemoryEditComponent implements OnInit, OnDestroy {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    readonly store: MemoryEditStore
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this), map(d => d['ocMemory']))
      .subscribe(sd => this.store.loadOcMemory(sd))
  }

  ngOnDestroy() {
  }

}
