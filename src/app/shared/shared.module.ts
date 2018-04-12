import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EqualValidatorDirective } from './directives/equal-validator.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EqualValidatorDirective],
  exports: [EqualValidatorDirective]
})
export class SharedModule { }
