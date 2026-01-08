## How To Run
1. Download this repository
2. Run "npm install"
3. Run "mkdir tmp" (if needed)
4. Make the .env file, use the .env.example as starting point
   * Run "copy .env.example .env"
6. Run "node ace migration:run --force"
7. Run "node ace db:seed"
8. Run "npm run dev" to start development server

The seeded email is "admin1@seeder.seed", and the password is "password123"
