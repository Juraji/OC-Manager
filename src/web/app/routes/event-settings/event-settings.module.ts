import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap'

import {EventSettingsComponent} from './event-settings.component';

const ROUTES: Routes = [
  {
    path: '',
    component: EventSettingsComponent,
  }
]

@NgModule({
  declarations: [
    EventSettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    NgbDatepickerModule,
  ],
})
export class EventSettingsModule {
}
