require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const analyzeRouter = require('./routes/analyze')
const generateRouter = require('./routes/generate')
const refineRouter = require('./routes/refine')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? false
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Demo images
app.use('/demo-images', express.static(path.join(__dirname, 'demo-images')))

// API routes
app.use('/api/analyze', analyzeRouter)
app.use('/api/generate', generateRouter)
app.use('/api/refine', refineRouter)

// Health check
app.get('/api/health', (req, res) => {
  const demoMode = !process.env.STABILITY_API_KEY && !process.env.OPENAI_API_KEY
  res.json({ status: 'ok', demoMode, timestamp: new Date().toISOString() })
})

// Serve React frontend — always (works in both dev-production and production)
const clientBuildPath = path.join(__dirname, 'public')
app.use(express.static(clientBuildPath))
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message)
  res.status(500).json({ success: false, error: 'An unexpected error occurred.' })
})

app.listen(PORT, () => {
  const demoMode = !process.env.STABILITY_API_KEY && !process.env.OPENAI_API_KEY
  console.log(`\n Swastik running on http://localhost:${PORT}`)
  console.log(`   Mode: ${demoMode ? 'Demo Mode (no API key)' : 'AI Mode (Stability AI connected)'}`)
  console.log(`   Env: ${process.env.NODE_ENV || 'development'}\n`)
})