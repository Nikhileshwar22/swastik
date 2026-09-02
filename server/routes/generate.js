const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const { uploadMixed, handleUploadError } = require('../middleware/upload')
const { generateConcepts, isDemoMode } = require('../services/openaiImageService')
const { analyzeRequirements } = require('../services/analysisService')

// Demo concept titles and descriptions
const DEMO_CONCEPTS = [
  {
    id: 'concept-1',
    title: 'Warm Modern Luxury',
    description: 'A luxurious contemporary interpretation with warm golden lighting, rich wood tones, and marble accents. Inviting yet refined.',
  },
  {
    id: 'concept-2',
    title: 'Contemporary Earth Tones',
    description: 'An earthy contemporary vision with terracotta accents, natural textures, and warm ambient lighting. Grounded and elegant.',
  },
  {
    id: 'concept-3',
    title: 'Minimal Premium',
    description: 'Clean minimalist lines with premium stone textures, crisp whites, and precision lighting. Understated sophistication.',
  },
  {
    id: 'concept-4',
    title: 'Modern Indian Contemporary',
    description: 'Modern design with subtle Indian contemporary sensibility. Warm hues, brass accents, and rich fabric textures.',
  },
]

function getDemoImages(serverRoot) {
  const demoDir = path.join(serverRoot, 'demo-images')
  const files = fs.readdirSync(demoDir).filter(f =>
    /\.(png|jpg|jpeg|webp|svg)$/i.test(f)
  )
  return files.map(f => `/demo-images/${f}`)
}

// POST /api/generate
router.post(
  '/',
  uploadMixed.fields([
    { name: 'roomImages', maxCount: 3 },
    { name: 'referenceImages', maxCount: 5 },
    { name: 'floorPlan', maxCount: 1 },
  ]),
  handleUploadError,
  async (req, res) => {
    try {
      const {
        budget = '',
        styles = '',
        colors = '',
        materials = '',
        additionalRequirements = '',
        analysis: analysisJson = '',
      } = req.body

      const parsedStyles = parseField(styles)
      const parsedColors = parseField(colors)
      const parsedMaterials = parseField(materials)

      // Use provided analysis or derive fresh
      let analysis
      try {
        analysis = analysisJson ? JSON.parse(analysisJson) : null
      } catch { analysis = null }

      if (!analysis) {
        analysis = analyzeRequirements({
          budget,
          styles: parsedStyles,
          colors: parsedColors,
          materials: parsedMaterials,
          additionalRequirements,
          hasRoomImages: !!(req.files?.roomImages?.length),
          hasReferenceImages: !!(req.files?.referenceImages?.length),
        })
      }

      const requirements = {
        budget,
        style: parsedStyles,
        colors: parsedColors,
        materials: parsedMaterials,
        additionalRequirements,
      }

      // â”€â”€ DEMO MODE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (isDemoMode()) {
        await simulateDelay(3000, 5000)

        const serverRoot = path.join(__dirname, '..')
        let demoImageUrls = []
        try {
          demoImageUrls = getDemoImages(serverRoot)
        } catch (e) {
          console.warn('No demo images found, using placeholder.')
        }

        const concepts = DEMO_CONCEPTS.map((concept, i) => ({
          ...concept,
          imageUrl: demoImageUrls[i % demoImageUrls.length] || `/demo-images/demo-${i + 1}.svg`,
        }))

        return res.json({ success: true, concepts, demoMode: true })
      }

      // â”€â”€ REAL AI MODE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const roomImages = (req.files?.roomImages || []).map(f => ({
        buffer: f.buffer,
        mimetype: f.mimetype,
        originalname: f.originalname,
      }))
      const referenceImages = (req.files?.referenceImages || []).map(f => ({
        buffer: f.buffer,
        mimetype: f.mimetype,
        originalname: f.originalname,
      }))

      if (roomImages.length === 0 && referenceImages.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Please upload at least one room image or reference image.',
        })
      }

      const concepts = await generateConcepts(roomImages, referenceImages, analysis, requirements)
      res.json({ success: true, concepts, demoMode: false })

    } catch (err) {
      console.error('Generate error:', err.message)

      // Friendly error messages
      if (err.message.includes('API key')) {
        return res.status(500).json({ success: false, error: 'OpenAI API key is not configured. Running in Demo Mode.' })
      }
      if (err.message.includes('rate limit') || err.status === 429) {
        return res.status(429).json({ success: false, error: 'Generation limit reached. Please wait a moment and try again.' })
      }
      if (err.message.includes('billing') || err.status === 402) {
        return res.status(402).json({ success: false, error: 'OpenAI billing issue. Please check your account.' })
      }

      res.status(500).json({
        success: false,
        error: "We couldn't generate the concepts right now. Please try again.",
      })
    }
  }
)

function parseField(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return value.split(',').map(s => s.trim()).filter(Boolean)
  }
}

function simulateDelay(min, max) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = router
