import {
    collection,
    query,
    where,
    getDocs,
    getFirestore,
} from '@angular/fire/firestore';
import {
    ValidationErrors,
    ValidatorFn,
    AbstractControl,
    AsyncValidatorFn,
} from '@angular/forms';

export const descriptionValidator: ValidatorFn = (control: AbstractControl) => {
    const description = control.value as string;
    if (description && description.split(' ').length >= 5) {
        return null;
    } else {
        return {
            minDescription: true,
        };
    }
};

export const noSpace: ValidatorFn = (control: AbstractControl) => {
    const value = control.value as string;
    const isWhitespace = (value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
};

export function shouldUnique(
    collectionPath: string,
    controlName: string
): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
        return new Promise<ValidationErrors | null>((resolve, reject) => {
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
                                message: `${control.value} already exists. Please choose a different name.`,
                            },
                        });
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            }, 1000);
        });
    };
}
