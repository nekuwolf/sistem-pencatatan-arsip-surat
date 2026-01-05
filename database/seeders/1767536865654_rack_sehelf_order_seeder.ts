import { BaseSeeder } from '@adonisjs/lucid/seeders'
// Adjust import path as needed
import ArchiveRackShelfOrder from '#models/archive_rack_shelf_order'
import Organization from '#models/organization'

export default class extends BaseSeeder {
  async run() {
    // 1. Find the Organization ID
    const organization = await Organization.findByOrFail('short_name', 'DISKOMINFOS DENPASAR')

    // 2. Prepare Data
    const racks = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
    const seedData: Partial<ArchiveRackShelfOrder>[] = []
    let idCounter = 1

    // 3. Loop: 10 Racks
    for (const rackName of racks) {
      
      // Loop: 7 Shelves per Rack
      for (let shelf = 1; shelf <= 7; shelf++) {
        
        // Loop: 9 Positions per Shelf
        for (let pos = 1; pos <= 9; pos++) {
          
          seedData.push({
            id: idCounter++,
            rackName: rackName,
            shelfName: shelf.toString(),
            positionOrder: pos,
            organizationId: organization.id,
          })
          
        }
      }
    }

    // 4. Insert into Database
    // Total rows: 10 * 7 * 9 = 630 rows
    await ArchiveRackShelfOrder.updateOrCreateMany('id', seedData)
    
    console.log(`Seeded ${seedData.length} positions (10 Racks x 7 Shelves x 9 Positions)`)
  }
}