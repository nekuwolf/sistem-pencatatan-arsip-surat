import { Exception } from "@adonisjs/core/exceptions"

export class EmailAlreadyRegisteredException extends Exception {
  static status = 400
  static code = 'E_EMAIL_ALREADY_REGISTERED'
}

export class InvalidRegisterCodeException extends Exception {
  static status = 400
  static code = 'E_INVALID_REGISTER_CODE'
}

export class ExpiredRegisterCodeException extends Exception {
  static status = 400
  static code = 'E_EXPIRED_REGISTER_CODE'
}

export class InvalidOrExpiredRegisterCodeException extends Exception {
  static status = 400
  static code = 'E_INVALID_OR_EXPIRED_REGISTER_CODE'
}

export class RegisterCodeAlreadyUsedException extends Exception {
  static status = 400
  static code = 'E_REGISTER_CODE_ALREADY_USED'
}

export class RegisterCodeCreationFailedException extends Exception {
  static status = 500
  static code = 'E_REGISTER_CODE_CREATION_FAILED'
}

export class InvalidEmailException extends Exception {
  static status = 400
  static code = 'E_INVALID_EMAIL'
}

export class InvalidPasswordException extends Exception {
  static status = 400
  static code = 'E_INVALID_PASSWORD'
}

export class PersonalPhoneNumberRegisteredException extends Exception {
  static status = 400
  static code = 'E_PERSONAL_PHONE_NUMBER_ALREADY_REGISTERED'
}

export class UserDataAlreadyExistException extends Exception {
  static status = 400
  static code = 'E_USER_DATA_ALREADY_EXIST'
}