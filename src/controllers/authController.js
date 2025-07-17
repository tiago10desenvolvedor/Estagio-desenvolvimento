
import { db } from '../models/db.js'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'segredo123'

export const registerUser = async (req, res) => {
  const { email, password } = req.body

  await db.read()
  const existingUser = db.data.users.find((u) => u.email === email)
  if (existingUser) {
    return res.status(400).json({ message: 'Usuário já existe' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  db.data.users.push({ email, password: hashedPassword })
  await db.write()

  res.status(201).json({ message: 'Usuário registrado com sucesso' })
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  await db.read()
  const user = db.data.users.find((u) => u.email === email)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Credenciais inválidas' })
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' })
  res.json({ token })
}

