import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MODAL_DATA, ModalRef, ModalSizeMd} from '@juraji/ng-bootstrap-modals'

import {notBlank, required, typedFormControl, TypedFormGroup, typedFormGroup} from '#core/forms'
import {OcCharacterRelationship, OcCharacterRelationshipType} from '#models/characters.model'

import {
  CreateCharacterRelationshipStore
} from './create-character-relationship.store'

export interface CreateCharacterRelationshipData {
  forCharacterId: string
}

type RelationshipForm = Omit<OcCharacterRelationship, 'id'>

@ModalSizeMd()
@Component({
  selector: 'ocm-create-character-relationship',
  templateUrl: './create-character-relationship.component.html',
  styleUrls: ['./create-character-relationship.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateCharacterRelationshipStore]
})
export class CreateCharacterRelationshipComponent implements OnInit {

  readonly formGroup: TypedFormGroup<RelationshipForm> = typedFormGroup({
    type: typedFormControl<OcCharacterRelationshipType>('FRIENDSHIP', [required]),
    description: typedFormControl('', [notBlank]),
    sourceCharacterId: typedFormControl('', [required]),
    targetCharacterId: typedFormControl('', [required])
  })

  constructor(
    private readonly modalRef: ModalRef,
    @Inject(MODAL_DATA) private readonly data: CreateCharacterRelationshipData,
    readonly store: CreateCharacterRelationshipStore,
  ) {
  }

  ngOnInit(): void {
    this.store.loadTargetCharacters(this.data.forCharacterId)
    this.formGroup.get('sourceCharacterId').setValue(this.data.forCharacterId)
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.modalRef.resolve(this.formGroup.value)
    }
  }
}
