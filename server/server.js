require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const analyzeRouter = require('./routes/analyze')
const generateRouter = require('./routes/generate')
const refineRouter = require('./routes/refine')

const app = express()
const PORT = process.env.PORT || 5000

// â”€â”€â”€ Middleware â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? false  // Same-origin in production (served from Express)
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// â”€â”€â”€ Static Files â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Serve demo images from /public/demo-images
app.use('/demo-images', express.static(path.join(__dirname, 'demo-images')))

// â”€â”€â”€ API Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use('/api/analyze', analyzeRouter)
app.use('/api/generate', generateRouter)
app.use('/api/refine', refineRouter)

// Health check
app.get('/api/health', (req, res) => {
  const demoMode = !process.env.STABILITY_API_KEY && !process.env.OPENAI_API_KEY
  res.json({
    status: 'ok',
    demoMode,
    timestamp: new Date().toISOString(),
  })
})

// â”€â”€â”€ Serve React Frontend in Production â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const clientBuildPath = path.join(__dirname, 'public')
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  })
}

// â”€â”€â”€ Global Error Handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message)
  res.status(500).json({
    success: false,
    error: 'An unexpected error occurred. Please try again.',
  })
})

app.listen(PORT, () => {
  const demoMode = !process.env.STABILITY_API_KEY && !process.env.OPENAI_API_KEY
  console.log(`\nðŸ›ï¸  Swastik server running on http://localhost:${PORT}`)
  console.log(`   Mode: ${demoMode ? 'ðŸŽ­ Demo Mode (no API key)' : 'ðŸ¤– AI Mode (Stability AI connected)'}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`)
})

