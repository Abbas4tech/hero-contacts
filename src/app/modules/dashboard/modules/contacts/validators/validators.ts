import {
    UntypedFormControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export const descriptionValidator = (
    control: UntypedFormControl
): ValidationErrors => {
    const description = <string>control.value;
    if (description && description.split(' ').length >= 5) {
        return null;
    } else {
        return {
            minDescription: true,
        };
    }
};

export const noSpace: ValidatorFn = (
    control: UntypedFormControl
): ValidationErrors => {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
};
