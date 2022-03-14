import ApiError from "../apiError/apiError";
import fs from 'fs';
import path from 'path';
import countries from '../consts/countires/countries';

class UserValidator {
    private static validateNameParam(min: number, max: number, paramName: string, paramValue: string) {
        const regEx = new RegExp(`\^\[a-zA-Zа-яА-ЯёЁ\]\{${min},${max}\}\$`);
        if (!regEx.test(paramValue)) {
            throw ApiError.badRequest(`${paramName} does not match the specified pattern`);
        }
        return;
    }

    static validateFirstName(firstName: string) {
        this.validateNameParam(2, 25, 'First name', firstName);
    }

    static validateSurname(firstName: string) {
        this.validateNameParam(2, 25, 'Surname', firstName);
    }

    static validateNickname(nickname: string) {
        const min = 2;
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

    static validateUsersCountryAndCity(country: string, city: string) {
        if (!countries[country]) {
            throw ApiError.badRequest('Incorrect country chosen');
        }
        const chosenCity = countries[country].find(cityItem => cityItem === city);
        if (!chosenCity) {
            throw ApiError.badRequest('Incorrect city chosen');
        };
        return;
    }

}
export default UserValidator;