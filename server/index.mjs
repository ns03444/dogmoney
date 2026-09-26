import express from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = Number(process.env.PORT || 8080)
const dataFile = process.env.DOGMONEY_DATA_FILE || '/data/dogmoney.json'
const fallbackDataFile = path.join(__dirname, 'data.json')
const sessions = new Map()

function emptyDb() {
  return { users: [], bets: [] }
}

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  } catch {
    try {
      return JSON.parse(fs.readFileSync(fallbackDataFile, 'utf8'))
    } catch {
      return emptyDb()
    }
  }
}

let db = loadDb()
if (!Array.isArray(db.users)) db = emptyDb()
if (!Array.isArray(db.bets)) db.bets = []

function persist() {
  try {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true })
    const temp = `${dataFile}.tmp`
    fs.writeFileSync(temp, JSON.stringify(db, null, 2))
    fs.renameSync(temp, dataFile)
  } catch (error) {
    // /data may not be mounted in a local or demo deployment; keep serving in memory.
    try {
      fs.mkdirSync(path.dirname(fallbackDataFile), { recursive: true })
      fs.writeFileSync(fallbackDataFile, JSON.stringify(db, null, 2))
    } catch (fallbackError) {
      console.error('Could not persist database', error, fallbackError)
    }
  }
}

function publicUser(user) {
  return { id: user.id, username: user.username, role: user.role, active: user.active }
}

function seedUser(username, password, role) {
  if (db.users.some((user) => user.username === username)) return
  db.users.push({
    id: crypto.randomUUID(),
    username,
    passwordHash: bcrypt.hashSync(password, 12),
    role,
    active: true,
    balance: 1000,
    createdAt: new Date().toISOString(),
  })
  persist()
}

seedUser('admin', 'admin', 'admin')
seedUser('test', 'test123', 'user')

function parseCookies(request) {
  const header = request.headers.cookie || ''
  return Object.fromEntries(header.split(';').filter(Boolean).map((part) => {
    const index = part.indexOf('=')
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())]
  }))
}

function setSessionCookie(response, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  response.setHeader('Set-Cookie', `dm_session=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800${secure}`)
}

function clearSessionCookie(response) {
  response.setHeader('Set-Cookie', 'dm_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0')
}

function currentUser(request) {
  const token = parseCookies(request).dm_session
  const userId = token ? sessions.get(token) : null
  return userId ? db.users.find((user) => user.id === userId && user.active) : null
}

function requireAuth(request, response, next) {
  const user = currentUser(request)
  if (!user) return response.status(401).json({ error: 'Authentication required.' })
  request.user = user
  next()
}

function requireAdmin(request, response, next) {
  if (request.user.role !== 'admin') return response.status(403).json({ error: 'Admin access required.' })
  next()
}

app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (_request, response) => response.json({ ok: true }))

app.post('/api/auth/register', (request, response) => {
  const username = String(request.body?.username || '').trim().toLowerCase()
  const password = String(request.body?.password || '')
  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    return response.status(400).json({ error: 'Username must be 3–24 letters, numbers, or underscores.' })
  }
  if (password.length < 6 || password.length > 128) {
    return response.status(400).json({ error: 'Password must be 6–128 characters.' })
  }
  if (db.users.some((user) => user.username === username)) {
    return response.status(409).json({ error: 'That username is already registered.' })
  }
  const user = {
    id: crypto.randomUUID(),
    username,
    passwordHash: bcrypt.hashSync(password, 12),
    role: 'user',
    active: true,
    balance: 1000,
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)
  persist()
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, user.id)
  setSessionCookie(response, token)
  return response.status(201).json({ user: publicUser(user) })
})

app.post('/api/auth/login', (request, response) => {
  const username = String(request.body?.username || '').trim().toLowerCase()
  const password = String(request.body?.password || '')
  const user = db.users.find((candidate) => candidate.username === username)
  if (!user || !user.active || !bcrypt.compareSync(password, user.passwordHash)) {
    return response.status(401).json({ error: 'Invalid username or password.' })
  }
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, user.id)
  setSessionCookie(response, token)
  return response.json({ user: publicUser(user) })
})

app.post('/api/auth/logout', (request, response) => {
  const token = parseCookies(request).dm_session
  if (token) sessions.delete(token)
  clearSessionCookie(response)
  return response.json({ ok: true })
})

app.get('/api/auth/me', requireAuth, (request, response) => response.json({ user: publicUser(request.user) }))

app.get('/api/admin/users', requireAuth, requireAdmin, (_request, response) => {
  response.json({ users: db.users.map((user) => ({ ...publicUser(user), balance: user.balance, bets: db.bets.filter((bet) => bet.userId === user.id).length, createdAt: user.createdAt })) })
})

app.patch('/api/admin/users/:id', requireAuth, requireAdmin, (request, response) => {
  const user = db.users.find((candidate) => candidate.id === request.params.id)
  if (!user) return response.status(404).json({ error: 'User not found.' })
  if (request.body?.balance != null) {
    const balance = Number(request.body.balance)
    if (!Number.isFinite(balance) || balance < 0) return response.status(400).json({ error: 'Balance must be a non-negative number.' })
    user.balance = Math.round(balance * 100) / 100
  }
  if (typeof request.body?.active === 'boolean') {
    if (user.id === request.user.id && !request.body.active) return response.status(400).json({ error: 'You cannot deactivate your own admin account.' })
    user.active = request.body.active
  }
  persist()
  return response.json({ user: { ...publicUser(user), balance: user.balance } })
})

const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get(/.*/, (_request, response) => response.sendFile(path.join(distPath, 'index.html')))

app.listen(port, '0.0.0.0', () => console.log(`dogmoney API listening on ${port}`))
