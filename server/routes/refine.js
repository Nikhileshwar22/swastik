const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const { uploadMixed, handleUploadError } = require('../middleware/upload')
const { refineImage, isDemoMode } = require('../services/openaiImageService')

function getDemoImages(serverRoot) {
  const demoDir = path.join(serverRoot, 'demo-images')
  const files = fs.readdirSync(demoDir).filter(f =>
    /\.(png|jpg|jpeg|webp|svg)$/i.test(f)
  )
  return files.map(f => `/demo-images/${f}`)
}

// POST /api/refine
router.post(
  '/',
  uploadMixed.fields([
    { name: 'image', maxCount: 1 },
  ]),
  handleUploadError,
  async (req, res) => {
    try {
      const { modification = '', currentImageUrl = '' } = req.body

      if (!modification.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Please describe what you would like to change.',
        })
      }

      // â”€â”€ DEMO MODE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (isDemoMode()) {
        await simulateDelay(2500, 4000)

        const serverRoot = path.join(__dirname, '..')
        let demoImageUrls = []
        try {
          demoImageUrls = getDemoImages(serverRoot)
        } catch (e) { /* no demo images */ }

        // Pick a different demo image as the "refined" version
        const currentIdx = demoImageUrls.findIndex(u => currentImageUrl.includes(path.basename(u)))
        const nextIdx = (currentIdx + 1) % Math.max(demoImageUrls.length, 1)
        const refinedUrl = demoImageUrls[nextIdx] || demoImageUrls[0] || '/demo-images/demo-1.svg'

        return res.json({
          success: true,
          imageUrl: refinedUrl,
          description: `Revised: ${modification.slice(0, 120)}`,
          demoMode: true,
        })
      }

      // â”€â”€ REAL AI MODE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const imageFile = req.files?.image?.[0]

      if (!imageFile && !currentImageUrl) {
        return res.status(400).json({
          success: false,
          error: 'Please provide the image to refine.',
        })
      }

      const imageBuffer = imageFile?.buffer || null
      const imageMimeType = imageFile?.mimetype || 'image/png'

      const result = await refineImage(imageBuffer, imageMimeType, modification)

      res.json({
        success: true,
        imageUrl: result.imageUrl,
        description: result.description,
        demoMode: false,
      })

    } catch (err) {
      console.error('Refine error:', err.message)

      if (err.message.includes('rate limit') || err.status === 429) {
        return res.status(429).json({ success: false, error: 'Generation limit reached. Please wait a moment.' })
      }

      res.status(500).json({
        success: false,
        error: "We couldn't refine the design right now. Please try again.",
      })
    }
  }
)

function simulateDelay(min, max) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = router
