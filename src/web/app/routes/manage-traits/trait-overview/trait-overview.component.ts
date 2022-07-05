import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {Modals} from '@juraji/ng-bootstrap-modals'
import {BehaviorSubject, map, switchMap} from 'rxjs'

import {TraitLabelPipe} from '#components/trait-mgmt'
import {takeUntilDestroyed} from '#core/rxjs'
import {OcCharacterTrait} from '#models/traits.model'

import {TraitOverviewStore} from './trait-overview.store'

@Component({
  selector: 'ocm-trait-overview',
  templateUrl: './trait-overview.component.html',
  styleUrls: ['./trait-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TraitOverviewStore]
})
export class TraitOverviewComponent implements OnInit, OnDestroy {

  private readonly traitFilterValue$ = new BehaviorSubject('ALL');
  readonly filteredTraits$ = this.store.allTraits$
    .pipe(switchMap(traits => this.traitFilterValue$
      .pipe(map(fv => fv === 'ALL' ? traits : traits.filter(t => t.traitType === fv)))))

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly modals: Modals,
    readonly store: TraitOverviewStore
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this), map(d => d['storeData']))
      .subscribe(sd => this.store.setStoreData(sd))
  }

  ngOnDestroy() {
  }

  onTypeFilterSelect(value: string) {
    this.traitFilterValue$.next(value)
  }

  onDeleteTrait(trait: OcCharacterTrait) {
    const label = new TraitLabelPipe().transform(trait)
    this.modals.confirm(`Are you sure you want to delete trait "${label}"?`)
      .onResolved
      .subscribe(() => this.store.deleteTrait(trait.id))
  }
}
