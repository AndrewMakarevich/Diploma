export default class UserValidator {
  static validateNickname(nickname: string) {
    const min = 3;
    const max = 25;
    const regEx = new RegExp(`\^\[a-zA-Zа-яА-ЯёЁ0-9!@$*_-\]\{${min},${max}\}\$`);

    if (!regEx.test(nickname)) {
      alert('Nickname does not match the specified pattern');

      return false;
    }

    return true;
  }
  static validateEmail(email: string, alertText?: string): boolean {
    const regEx = /^[a-z0-9.\-_]{5,31}@([a-z]{2,10}.)?[a-z]{3,6}.[a-z]{2,10}$/;

    if (!regEx.test(email)) {
      alert(alertText ? alertText : 'Email does not match the specified pattern');

      return false
    }

    return true
  }
  static validatePassword(value: string, alertText?: string) {
    const min = 8;
    const max = 32;
    const regEx = new RegExp(`\^\[a-zA-Zа-яА-ЯёЁ0-9!@№#$%^:?&*()_+-=\]\{${min},${max}\}\$`);

    if (!regEx.test(value)) {
      alert(alertText ? alertText : 'Password does not match the specified pattern');

      return false;
    }

    return true;
  }
}