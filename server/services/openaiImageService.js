const https = require('https')
const http = require('http')

function isDemoMode() {
  return false // Pollinations is always free - no key needed
}

function buildGenerationPrompt(analysis, requirements) {
  const { budget = '', style = [], colors = [], materials = [], additionalRequirements = '' } = requirements
  const styleStr = Array.isArray(style) ? style.join(', ') : (style || '')
  const colorsStr = Array.isArray(colors) ? colors.join(', ') : (colors || '')
  const materialsStr = Array.isArray(materials) ? materials.join(', ') : (materials || '')
  return [
    'photorealistic interior design visualization',
    'professional architectural CGI rendering',
    'ultra realistic 3D render interior design magazine quality',
    styleStr || analysis.style || 'modern contemporary',
    'style interior',
    colorsStr ? `color palette ${colorsStr}` : 'warm neutral beige cream color palette',
    materialsStr ? `materials ${materialsStr}` : 'wood marble fabric materials',
    budget ? `budget ${budget}` : '',
    additionalRequirements || analysis.designDirection || '',
    'warm ambient lighting cove lighting natural light windows',
    'detailed textures wood grain marble veining',
    'realistic furniture proper proportions soft shadows',
    'clean composition eye level perspective full room',
    'hyperrealistic 8k no text no watermarks',
  ].filter(Boolean).join(', ')
}

const CONCEPT_VARIANTS = [
  {
    title: 'Warm Modern Luxury',
    suffix: 'warm golden lighting rich walnut wood tones cream marble surfaces plush velvet sofa brass accent fixtures luxurious atmosphere',
  },
  {
    title: 'Contemporary Earth Tones',
    suffix: 'earthy terracotta sage green accents natural linen textures rattan details warm ambient pendant lighting organic grounded',
  },
  {
    title: 'Minimal Premium',
    suffix: 'crisp white walls light oak flooring travertine stone sleek low profile furniture precision recessed lighting minimalist luxury',
  },
  {
    title: 'Modern Indian Contemporary',
    suffix: 'warm saffron gold accents teak wood brass fixtures contemporary sofa subtle Indian jali screen culturally rich modern',
  },
]

function fetchImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchImageAsBase64(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const contentType = res.headers['content-type'] || 'image/jpeg'
        resolve(`data:${contentType};base64,${buffer.toString('base64')}`)
      })
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function generateWithPollinations(prompt) {
  const encoded = encodeURIComponent(prompt)
  // Use a unique seed per call for variation
  const seed = Math.floor(Math.random() * 999999)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1344&height=768&seed=${seed}&nologo=true&enhance=true&model=flux`

  console.log(`Calling Pollinations: ${url.slice(0, 120)}...`)
  const base64 = await fetchImageAsBase64(url)
  return base64
}

async function generateConcepts(roomImages, referenceImages, analysis, requirements) {
  const basePrompt = buildGenerationPrompt(analysis, requirements)
  const concepts = []

  for (let i = 0; i < CONCEPT_VARIANTS.length; i++) {
    const variant = CONCEPT_VARIANTS[i]
    const prompt = `${basePrompt}, ${variant.suffix}, trending architectural digest award winning interior`.slice(0, 1800)
    console.log(`Generating concept ${i + 1}: ${variant.title}`)

    try {
      const imageUrl = await generateWithPollinations(prompt)
      console.log(`Concept ${i + 1} done (${imageUrl.length} chars)`)
      concepts.push({
        id: `concept-${i + 1}`,
        title: variant.title,
        description: generateDescription(variant.title, analysis, requirements),
        imageUrl,
      })
    } catch (err) {
      console.error(`Concept ${i + 1} failed: ${err.message}`)
    }
  }

  if (concepts.length === 0) {
    throw new Error('Failed to generate concepts. Please try again in a moment.')
  }
  return concepts
}

async function refineImage(imageBuffer, imageMimeType, modification) {
  const prompt = [
    'photorealistic interior design visualization professional CGI rendering',
    modification,
    'same room layout same perspective same lighting mood',
    'ultra realistic interior design magazine quality hyperrealistic no text no watermarks',
  ].join(', ').slice(0, 1800)

  const imageUrl = await generateWithPollinations(prompt)
  return { imageUrl, description: `Revised: ${modification.slice(0, 100)}` }
}

function generateDescription(title, analysis, requirements) {
  const style = (Array.isArray(requirements.style) ? requirements.style[0] : requirements.style) || analysis.style || 'contemporary'
  const materials = (requirements.materials || analysis.materials || []).slice(0, 2).join(' & ') || 'premium materials'
  const colors = (requirements.colors || analysis.colors || [])[0] || 'neutral tones'
  const map = {
    'Warm Modern Luxury': `A luxurious ${style.toLowerCase()} space with warm ${colors}, ${materials} and golden accent lighting.`,
    'Contemporary Earth Tones': `An earthy contemporary design using natural ${materials} with organic ${colors} tones.`,
    'Minimal Premium': `A refined minimalist approach with premium ${materials} and a restrained ${colors} palette.`,
    'Modern Indian Contemporary': `Modern design with Indian contemporary sensibility using ${materials} in warm ${colors}.`,
  }
  return map[title] || `A personalized ${title.toLowerCase()} concept.`
}

module.exports = { generateConcepts, refineImage, isDemoMode, buildGenerationPrompt }