import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const adapter = new JSONFile('./src/data/db.json')

// Aqui você já passa o default data no construtor do Low
const db = new Low(adapter, { dishes: [], users: [] })

async function initDB() {
  await db.read()
  // db.data já estará definido com o default passado no construtor se o arquivo estiver vazio

  // Caso queira garantir, pode fazer:
  if (!db.data) {
    db.data = { dishes: [], users: [] }
  }
  
  await db.write()
}

export { db, initDB }
