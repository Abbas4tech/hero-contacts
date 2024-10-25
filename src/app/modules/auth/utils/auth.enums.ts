export enum FirebaseLoginError {
    EMAIL_ALREADY_EXIST = 'auth/email-already-in-use',
    INVALID_EMAIL_OR_PASSWORD = 'auth/invalid-login-credentials',
    POPUP_CLOSED = 'auth/popup-closed-by-user',
}

export enum Message {
    EMAIL_ALREADY_EXIST = 'Email is Already Exists!',
    INVALID_EMAIL_OR_PASSWORD = 'Email or Password is Invalid!',
    POPUP_CLOSED = 'Please do not close popup intentionally. keep the popup open to signin.',
}
