import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {CharacterEditStore} from './character-edit.store'
import {map} from 'rxjs'
import {takeUntilDestroyed} from '../../../core/rxjs'

@Component({
  selector: 'ocm-character-edit',
  templateUrl: './character-edit.component.html',
  styleUrls: ['./character-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterEditComponent implements OnInit, OnDestroy {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    readonly store: CharacterEditStore
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this), map(d => d['storeData']))
      .subscribe(d => this.store.setStoreData(d))
  }

  ngOnDestroy() {
  }

}
