// app/exceptions/register_failed_exception.ts
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class RegisterFailedException extends Exception {
  public messages: Record<string, string>

  constructor(messages: Record<string, string>) {
    super('Registration failed')
    this.messages = messages
  }

  async handle(error: this, ctx: HttpContext) {
    // FIX: Use .flash() directly. 
    // We manually key it as 'errors' to match standard validation behavior.
    ctx.session.flash('errors', error.messages)
    
    // Flash the form input (old values)
    ctx.session.flashAll()

    return ctx.response.redirect().back()
  }
}