import {ChangeDetectionStrategy, Component, HostListener, Input} from '@angular/core';
import {Router} from '@angular/router'

import {BooleanInput} from '#core/ng-extensions'
import {OcCharacterTrait} from '#models/traits.model'

@Component({
  selector: 'ocm-trait-card',
  templateUrl: './trait-card.component.html',
  styleUrls: ['./trait-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraitCardComponent {
  @Input()
  trait: Nullable<OcCharacterTrait>

  @Input()
  @BooleanInput()
  flat: boolean | string = false;

  @Input()
  @BooleanInput()
  disabled: boolean | string = false

  constructor(
    private readonly router: Router
  ) {
  }

  @HostListener('click')
  onClick() {
    if (!this.disabled && !!this.trait?.id) {
      this.router.navigate(['/traits/edit', this.trait.id])
    }
  }
}
