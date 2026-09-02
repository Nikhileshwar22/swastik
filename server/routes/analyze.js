const express = require('express')
const router = express.Router()
const { uploadMixed, handleUploadError } = require('../middleware/upload')
const { analyzeRequirements } = require('../services/analysisService')

// POST /api/analyze
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
      } = req.body

      const parsedStyles = parseField(styles)
      const parsedColors = parseField(colors)
      const parsedMaterials = parseField(materials)

      const hasRoomImages = !!(req.files?.roomImages?.length)
      const hasReferenceImages = !!(req.files?.referenceImages?.length)

      const analysis = analyzeRequirements({
        budget,
        styles: parsedStyles,
        colors: parsedColors,
        materials: parsedMaterials,
        additionalRequirements,
        hasRoomImages,
        hasReferenceImages,
      })

      res.json({ success: true, analysis })
    } catch (err) {
      console.error('Analyze error:', err.message)
      res.status(500).json({ success: false, error: 'Analysis failed. Please try again.' })
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

module.exports = router
