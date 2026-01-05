import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminOnlyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    // 1. Must be logged in
    if (!user) {
      return ctx.response.unauthorized('Please log in.')
    }

    // 2. Must be EITHER an Admin OR an Employee
    // We block them only if they are NOT an Admin AND NOT an Employee
    if (!user.isAdmin && !user.isEmployee) {
      return ctx.response.forbidden('You do not have permission to access this resource.')
    }

    return next()
  }
}