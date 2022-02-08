import ApiError from "../apiError/apiError";

class UserValidator {
    static validateNickname(nickname: string) {
        const min = 3;
        const max = 25;
        const regEx = new RegExp(`\^\[a-zA-Zа-яА-ЯёЁ0-9!@$*_-\]\{${min},${max}\}\$`);
        if (!regEx.test(nickname)) {
            throw ApiError.badRequest('Nickname does not match the specified pattern');
        }
        return;
    }
    static validateEmail(email: string) {
        const regEx = /^[a-z0-9.\-_]{5,31}@([a-z]{2,10}.)?[a-z]{3,6}.[a-z]{2,10}$/;
        if (!regEx.test(email)) {
            throw ApiError.badRequest('Email does not match the specified pattern');
        }
        return;
    }
    static validatePassword(value: string) {
        const min = 8;
        const max = 32;
        const regEx = new RegExp(`\^\[a-zA-Zа-яА-ЯёЁ0-9!@№#$%^:?&*()_+-=\]\{${min},${max}\}\$`);
        if (!regEx.test(value)) {
            throw ApiError.badRequest('Password does not match the specified pattern');
        }
        return;
    }

}
export default UserValidator;