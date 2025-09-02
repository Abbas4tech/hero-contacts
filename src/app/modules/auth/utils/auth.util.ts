import { FirebaseLoginError, Message } from './auth.enums';
export const errorGenerator = (message: string): string => {
    const msg = message.match(/\(([^)]+)\)/) || '';
    switch (msg[1]) {
        case FirebaseLoginError.EMAIL_ALREADY_EXIST:
            return Message.EMAIL_ALREADY_EXIST;
        case FirebaseLoginError.INVALID_EMAIL_OR_PASSWORD:
            return Message.INVALID_EMAIL_OR_PASSWORD;
        case FirebaseLoginError.POPUP_CLOSED:
            return Message.POPUP_CLOSED;
        default:
            return message;
    }
};

const randomNumberGenerator = () => {
    return Math.floor(Math.random() * 100000 + 1);
};

export const randomAvatarUrlGenerator = () => {
    return `https://robohash.org/${randomNumberGenerator()}/?size=200x280`;
};
