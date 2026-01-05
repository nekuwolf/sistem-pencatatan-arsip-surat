import { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  public async boot() {
    /**
     * Import the BaseModel and your strategy
     */
    const { BaseModel } = await import('@adonisjs/lucid/orm')
    const { SingularNamingStrategy } = await import('../app/strategies/singular_naming_strategy.js')

    /**
     * Assign the strategy to the BaseModel. 
     * All models extending BaseModel will now use this strategy.
     */
    BaseModel.namingStrategy = new SingularNamingStrategy()
  }
}