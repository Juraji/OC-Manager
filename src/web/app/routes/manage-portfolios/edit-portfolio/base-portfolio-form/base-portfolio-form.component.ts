import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {Modals} from '@juraji/ng-bootstrap-modals'
import {map, mergeMap, skip, startWith} from 'rxjs'

import {notBlank, required, typedFormControl, TypedFormGroup, typedFormGroup} from '#core/forms'
import {BooleanBehaviourSubject, once, takeUntilDestroyed} from '#core/rxjs'
import {OcPortfolio} from '#models/portfolios.model'

import {EditPortfolioStore} from '../edit-portfolio.store'

type OcPortfolioForm = Omit<OcPortfolio, 'id' | 'default'>

@Component({
  selector: 'ocm-base-portfolio-form',
  templateUrl: './base-portfolio-form.component.html',
  styleUrls: ['./base-portfolio-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasePortfolioFormComponent implements OnInit, OnDestroy {

  readonly editActive$ = new BooleanBehaviourSubject()
  readonly formGroup: TypedFormGroup<OcPortfolioForm> = typedFormGroup<OcPortfolioForm>({
    name: typedFormControl('', [required, notBlank]),
    description: typedFormControl('', [notBlank])
  })

  public readonly portfolioTitle$ = this.store.portfolio$
    .pipe(map(c => c.name), startWith('New character'))

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modals: Modals,
    readonly store: EditPortfolioStore
  ) {
    this.store.portfolio$
      .pipe(takeUntilDestroyed(this))
      .subscribe(p => this.populateForm(p))

    this.store.isNewPortfolio$
      .pipe(takeUntilDestroyed(this))
      .subscribe(it => this.editActive$.next(it))
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  onSavePortfolio() {
    if(this.formGroup.valid) {
      const update = this.formGroup.value;

      this.store
        .savePortFolio(update)
        .subscribe(c => {
          this.editActive$.setFalse()
          this.populateForm(c)
          return this.router.navigate(['..', c.id], {relativeTo: this.activatedRoute})
        })
    }
  }

  onDeletePortfolio() {
    this.portfolioTitle$
      .pipe(
        skip(1), once(),
        mergeMap(name => this.modals.confirm(`Are you sure you want to delete ${name}?`).onResolved),
        mergeMap(() => this.store.deletePortFolio())
      )
      .subscribe(() => this.router.navigate(['/']))
  }

  private populateForm(character: OcPortfolio) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, default: d, ...formData} = character
    this.formGroup.reset(formData)
  }
}
