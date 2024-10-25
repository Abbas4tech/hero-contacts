import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const descriptionValidator = (
    control: FormControl
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
    control: FormControl
): ValidationErrors => {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
};
