import { UntypedFormControl } from '@angular/forms';

export const requiredFileType = (types: string[]) => {
    return function (control: UntypedFormControl) {
        const file = control.value;
        if (file) {
            const extension = file.split('.')[1].toLowerCase();
            if (types.every((exten) => exten !== extension.toLowerCase())) {
                return {
                    requiredFileType: true,
                };
            }

            return null;
        }
        return null;
    };
};

export const noSpace = (control: UntypedFormControl): { whitespace: boolean } => {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
};
