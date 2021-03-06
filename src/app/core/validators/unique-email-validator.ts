import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { of, Observable } from 'rxjs';
import {
  map,
  switchMap,
  first,
  debounceTime,
  distinctUntilChanged,
  tap
} from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ChangeDetectorRef } from '@angular/core';

export function uniqueEmailValidator(
  authService: AuthService,
  changeDetectorRef: ChangeDetectorRef
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors> => {
    if (!control.valueChanges) {
      return of(null);
    } else {
      return control.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap(value => authService.isEmailAvailable(value)),
        map(isAvailable => (isAvailable ? null : { uniqueEmail: true })),
        first(),
        tap(() => changeDetectorRef.markForCheck())
      );
    }
  };
}
