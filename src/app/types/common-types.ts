/**
 * This is a generic type for `any` so that we can fix it on later releases
 */
export type TStoFix = any;

/**
 * Theme type selector for storing and checking the theme
 */
export type Theme = 'light' | 'night';

export enum COMMONENUM {
    THEME = 'theme',
}

export enum ThemeEnum {
    LIGHT = 'light',
    COFFEE = 'coffee',
    DRACULA = 'dracula',
}
