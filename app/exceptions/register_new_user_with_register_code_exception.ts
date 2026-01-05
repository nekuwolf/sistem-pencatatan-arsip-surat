import { Exception } from '@adonisjs/core/exceptions'

export default class RegisterNewUserWithRegisterCodeException extends Exception {
  constructor(public errors: Record<string, string>) {
    super('RegisterNewUserWithRegisterCodeException', {
      status: 422,
      code: 'E_REGISTER_NEW_USER_WITH_REGISTER_CODE_EXCEPTION',
    })
  }
}
