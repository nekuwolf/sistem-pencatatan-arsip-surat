// app/strategies/singular_naming_strategy.ts
import { SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import { LucidModel } from '@adonisjs/lucid/types/model'
import string from '@poppinss/utils/string' // <--- Use this direct path

export class SingularNamingStrategy extends SnakeCaseNamingStrategy {
  public override tableName(model: LucidModel): string {
    // string.snakeCase is available here
    return string.snakeCase(model.name)
  }
}