import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {Modals} from '@juraji/ng-bootstrap-modals'
import {map, mergeMap, skip, startWith} from 'rxjs'

import {TraitTypeLabelPipe} from '#components/trait-mgmt'
import {notBlank, required, typedFormControl, TypedFormGroup, typedFormGroup} from '#core/forms'
import {BooleanBehaviourSubject, filterNotNull, once, takeUntilDestroyed} from '#core/rxjs'
import {
  EYE_COLOR_TYPES,
  HAIR_STYLE_LENGTHS,
  OC_HAIR_STYLE_COLORS,
  OcBodyType,
  OcCharacterTrait,
  OcCharacterTraitType,
  OcCustomTrait,
  OcEthnicity,
  OcEyeColor,
  OcEyeColorType,
  OcGender, OcHairDye,
  OcHairStyle,
  OcHairStyleColor,
  OcHairStyleLength,
  OcSexuality,
  TRAIT_TYPES
} from '#models/traits.model'

import {EditTraitStore} from '../edit-trait.store'

type OmitId<T extends OcCharacterTrait> = Omit<T, 'id'>

interface OcCharacterTraitForm {
  traitType: OcCharacterTraitType,
  trait: OmitId<OcCharacterTrait>
}

@Component({
  selector: 'ocm-base-trait-form',
  templateUrl: './base-trait-form.component.html',
  styleUrls: ['./base-trait-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseTraitFormComponent implements OnInit, OnDestroy {

  readonly traitTypes = TRAIT_TYPES
  readonly eyeColorTypes = EYE_COLOR_TYPES
  readonly hairStyleLengths = HAIR_STYLE_LENGTHS
  readonly ocHairStyleColors = OC_HAIR_STYLE_COLORS

  readonly editActive$ = new BooleanBehaviourSubject()
  readonly formGroup: TypedFormGroup<OcCharacterTraitForm> = typedFormGroup({
    traitType: typedFormControl<OcCharacterTraitType>('OcBodyType', [required]),
    trait: BaseTraitFormComponent.traitFormGroupByType('OcBodyType'),
  })

  readonly traitTitle$ = this.store.trait$
    .pipe(map(t => new TraitTypeLabelPipe().transform(t)), startWith('New trait'))

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modals: Modals,
    readonly store: EditTraitStore
  ) {
  }

  ngOnInit(): void {
    this.store.traitType$
      .pipe(takeUntilDestroyed(this), filterNotNull())
      .subscribe(t => {
        this.formGroup.get('traitType').setValue(t)
        this.formGroup.get('traitType').disable()
        this.formGroup.setControl('trait', BaseTraitFormComponent.traitFormGroupByType(t))
      })

    this.formGroup.get('traitType').valueChanges
      .pipe(takeUntilDestroyed(this))
      .subscribe(t => this.formGroup.setControl('trait', BaseTraitFormComponent.traitFormGroupByType(t)))

    this.store.trait$
      .pipe(takeUntilDestroyed(this))
      .subscribe(t => this.populateForm(t))

    this.store.isNewTrait$
      .pipe(takeUntilDestroyed(this))
      .subscribe(it => this.editActive$.next(it))
  }

  ngOnDestroy() {
  }

  private static traitFormGroupByType(traitType: OcCharacterTraitType): TypedFormGroup<OmitId<OcCharacterTrait>> {
    switch (traitType) {
      case 'OcBodyType':
        return typedFormGroup<OmitId<OcBodyType>>({
          traitType: typedFormControl('OcBodyType'),
          description: typedFormControl('', [required, notBlank])
        })
      case 'OcEthnicity':
        return typedFormGroup<OmitId<OcEthnicity>>({
          traitType: typedFormControl('OcEthnicity'),
          description: typedFormControl('', [required, notBlank])
        })
      case 'OcEyeColor':
        return typedFormGroup<OmitId<OcEyeColor>>({
          traitType: typedFormControl('OcEyeColor'),
          type: typedFormControl<OcEyeColorType>('BLUE', [required]),
          variant: typedFormControl('', [notBlank])
        })
      case 'OcGender':
        return typedFormGroup<OmitId<OcGender>>({
          traitType: typedFormControl('OcGender'),
          description: typedFormControl('', [required, notBlank])
        })
      case 'OcHairStyle':
        return typedFormGroup<OmitId<OcHairStyle>>({
          traitType: typedFormControl('OcHairStyle'),
          length: typedFormControl<OcHairStyleLength>('SHORT', [required]),
          baseColor: typedFormControl<OcHairStyleColor>('BLONDE', [required]),
          variant: typedFormControl('', [notBlank]),
        })
      case 'OcHairDye':
        return typedFormGroup<OmitId<OcHairDye>>({
          traitType: typedFormControl('OcHairDye'),
          baseColor: typedFormControl<OcHairStyleColor>('BLONDE', [required]),
          variant: typedFormControl('', [notBlank]),
          outgrowth: typedFormControl(false)
        })
      case 'OcCustomTrait':
        return typedFormGroup<OmitId<OcCustomTrait>>({
          traitType: typedFormControl('OcCustomTrait'),
          label: typedFormControl('', [required, notBlank]),
          description: typedFormControl('', [required, notBlank])
        })
      case 'OcSexuality':
        return typedFormGroup<OmitId<OcSexuality>>({
          traitType: typedFormControl('OcSexuality'),
          description: typedFormControl('', [required, notBlank])
        })
      default:
        throw new Error(`Unsupported trait type: ${traitType}`)
    }
  }

  onDeleteTrait() {
    this.traitTitle$
      .pipe(
        skip(1), once(),
        mergeMap(label => this.modals
          .confirm(`Are you sure you want to delete trait "${label}"?`)
          .onResolved),
        mergeMap(() => this.store.deleteTrait())
      )
      .subscribe(() => this.router.navigate(
        ['../..'],
        {relativeTo: this.activatedRoute}))
  }

  onSaveTrait() {
    if (this.formGroup.valid) {
      const fv = this.formGroup.value;
      const update: Partial<OcCharacterTrait> = fv.trait

      this.store
        .saveTrait(update)
        .subscribe(c => {
          this.editActive$.setFalse()
          this.populateForm(c)
          return this.router.navigate(
            ['..', c.id],
            {relativeTo: this.activatedRoute, replaceUrl: true})
        })
    }
  }

  private populateForm(character: OcCharacterTrait) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...formData} = character
    this.formGroup.get('trait').reset(formData)
  }
}
