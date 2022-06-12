export default class UserValidator {
  static validateNickname(nickname: string, alert = true) {
    const min = 3;
    const max = 25;
    const regEx = new RegExp(`\^\[a-zA-Zа-яА-ЯёЁ0-9!@$*_-\]\{${min},${max}\}\$`);

    if (!regEx.test(nickname)) {
      if (!alert) {
        return false;
      }

      throw Error('Nickname does not match the specified pattern');
    }

    return true;
  }

  static validateEmail(email: string, alert = true): boolean {
    const emailParts = email.split("@");

    if (emailParts.length === 1 || emailParts.length > 2) {
      if (!alert) {
        return false;
      }

      throw Error("@ symbol in email is required");
    };

    const recipientName = emailParts[0];
    const domainName = emailParts[1];

    if (!/^[a-zA-Z0-9!#$%&'*+-/=?^_`{}|]{1,64}$/.test(recipientName)) {
      if (!alert) {
        return false;
      }
      throw Error("Incorrect email recipient name");
    };

    if (domainName.length > 253) {
      if (!alert) {
        return false;
      }
      throw Error("Domain name is too long, maximum length is 253 symbols");
    };

    const subDomains = domainName.split(".");

    if (subDomains.length < 2) {
      throw Error("Incorrect sub domains recieved");
    }

    const topLevelDomain = subDomains.splice(-1, 1)[0];

    subDomains.forEach(domain => {
      if (!/^[a-zA-Z0-9-]+$/) {
        if (!alert) {
          return false;
        }
        throw Error(`Your sub domain \"${domain}\" doesnt match the specified pattern: a-zA-Z0-9 symbols available`)
      }
    });

    if (!/^[a-z]{2,14}$/.test(topLevelDomain)) {
      if (!alert) {
        return false;
      }
      throw Error(`Your top level domain \"${topLevelDomain}\" doesn't match the specified pattern, a-z symbols available, with length range from 2 to 14 symbols`)
    }
    return true;
  }

  static validatePassword(value: string, alert = true) {
    const min = 8;
    const max = 32;
    const regEx = new RegExp(`\^\[a-zA-Zа-яА-ЯёЁ0-9!@№#$%^:?&*()_+-=\]\{${min},${max}\}\$`);

    if (!regEx.test(value)) {
      if (!alert) {
        return false;
      }

      throw Error('Password does not match the specified pattern. Symbols a-zA-Zа-яА-ЯёЁ0-9!@№#$%^:?&*()_+-= allowed, with length from 8 to 32');
    }

    return true;
  }
}