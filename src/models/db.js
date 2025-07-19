import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const adapter = new JSONFile('./src/data/db.json')


const db = new Low(adapter, { dishes: [], users: [] })

async function initDB() {
  await db.read()
  
  if (!db.data) {
    db.data = { dishes: [], users: [] }
  }
  
  await db.write()
}

export { db, initDB }
