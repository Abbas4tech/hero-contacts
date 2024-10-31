import {
    collection,
    query,
    where,
    getDocs,
    getFirestore,
} from '@angular/fire/firestore';
import {
    UntypedFormControl,
    ValidationErrors,
    ValidatorFn,
    AbstractControl,
    AsyncValidatorFn,
} from '@angular/forms';

import { of, Observable, from } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    catchError,
    map,
} from 'rxjs/operators';

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

export function shouldUnique(
    collectionPath: string,
    controlName: string
): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors> => {
        return new Promise<ValidationErrors>((resolve, reject) => {
            if (!control.value) {
                return resolve(null);
            }
            const namesRef = collection(getFirestore(), collectionPath);
            const q = query(namesRef, where(controlName, '==', control.value));
            setTimeout(async () => {
                try {
                    const docs = await getDocs(q);
                    if (docs.empty) resolve(null);
                    else
                        resolve({
                            nonUnique: {
                                message: `${control.value} already exist, Please choose a different name.`,
                            },
                        });
                } catch (err) {
                    console.error(err);
                    reject(err.message);
                }
            }, 1000);
        });
    };
}
