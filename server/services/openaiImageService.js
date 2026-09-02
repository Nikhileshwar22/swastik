const fetch = require('node-fetch')
const FormData = require('form-data')

// ── Demo mode check ──────────────────────────────────────────────────────────
function isDemoMode() {
  const key = process.env.STABILITY_API_KEY || process.env.OPENAI_API_KEY
  return !key || key.trim() === ''
}

function getStabilityKey() {
  const key = process.env.STABILITY_API_KEY
  if (!key || key.trim() === '') throw new Error('STABILITY_API_KEY is not configured.')
  return key.trim()
}

// ── Prompt builders ──────────────────────────────────────────────────────────
function buildGenerationPrompt(analysis, requirements) {
  const { budget = '', style = [], colors = [], materials = [], additionalRequirements = '' } = requirements
  const styleStr = Array.isArray(style) ? style.join(', ') : (style || '')
  const colorsStr = Array.isArray(colors) ? colors.join(', ') : (colors || '')
  const materialsStr = Array.isArray(materials) ? materials.join(', ') : (materials || '')
  const budgetGuidance = getBudgetGuidance(budget)

  return [
    'photorealistic interior design visualization, professional architectural rendering,',
    'ultra realistic 3D CGI quality, interior design magazine photography,',
    `${styleStr || analysis.style || 'modern contemporary'} style,`,
    `color palette: ${colorsStr || analysis.colors?.join(', ') || 'warm neutrals beige cream'},`,
    `materials: ${materialsStr || analysis.materials?.join(', ') || 'wood marble fabric'},`,
    budgetGuidance,
    additionalRequirements || analysis.designDirection || '',
    'warm ambient lighting, cove lighting, natural light from windows,',
    'detailed textures wood grain marble veining fabric weave,',
    'realistic furniture proper proportions soft shadows,',
    'clean composition eye-level perspective full room view,',
    '8k resolution hyperrealistic photorealistic render, no text no watermarks',
  ].filter(Boolean).join(' ')
}

function buildVariantPrompt(basePrompt, variant) {
  return `${basePrompt}, ${variant.suffix}, trending on architectural digest, award winning interior design`.slice(0, 2000)
}

function buildRefinementPrompt(modification) {
  return [
    'photorealistic interior design visualization, professional architectural rendering,',
    `${modification},`,
    'same room layout same perspective same lighting mood,',
    'ultra realistic 3D CGI quality, no text no watermarks,',
    'interior design magazine quality, 8k hyperrealistic',
  ].join(' ').slice(0, 2000)
}

function getBudgetGuidance(budget) {
  if (!budget) return ''
  const b = budget.toLowerCase()
  if (b.includes('under') || b.includes('2 lakh')) return 'affordable laminate veneer standard furniture,'
  if (b.includes('4') || b.includes('7')) return 'mid-range engineered wood ceramic quality furniture,'
  if (b.includes('10') || b.includes('20') || b.includes('+')) return 'luxury marble solid wood designer furniture brass fixtures,'
  return ''
}

const CONCEPT_VARIANTS = [
  {
    title: 'Warm Modern Luxury',
    suffix: 'warm golden hour lighting rich walnut wood tones cream marble surfaces plush velvet sofa brass accent fixtures luxurious atmosphere',
  },
  {
    title: 'Contemporary Earth Tones',
    suffix: 'earthy terracotta sage green accents natural linen textures rattan details warm ambient pendant lighting organic grounded feel',
  },
  {
    title: 'Minimal Premium',
    suffix: 'crisp white walls light oak flooring travertine stone surfaces sleek low profile sofa precision recessed lighting minimalist luxury',
  },
  {
    title: 'Modern Indian Contemporary',
    suffix: 'warm saffron gold accents teak wood brass fixtures contemporary sectional sofa subtle Indian jali screen pattern culturally rich modern',
  },
]

// ── Core generation using Stability AI REST API ───────────────────────────────
async function generateWithStability(prompt) {
  const key = getStabilityKey()

  const form = new FormData()
  form.append('prompt', prompt)
  form.append('output_format', 'jpeg')
  form.append('width', '1344')
  form.append('height', '768')
  form.append('steps', '30')

  const response = await fetch(
    'https://api.stability.ai/v2beta/stable-image/generate/sd3',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: 'image/*',
        ...form.getHeaders(),
      },
      body: form,
    }
  )

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Stability AI error ${response.status}: ${errText}`)
  }

  const buffer = await response.buffer()
  return `data:image/jpeg;base64,${buffer.toString('base64')}`
}

// ── Public API ─────────────────────────────────────────────────────────────
async function generateConcepts(roomImages, referenceImages, analysis, requirements) {
  const basePrompt = buildGenerationPrompt(analysis, requirements)
  const concepts = []

  for (let i = 0; i < CONCEPT_VARIANTS.length; i++) {
    const variant = CONCEPT_VARIANTS[i]
    const prompt = buildVariantPrompt(basePrompt, variant)
    console.log(`Generating concept ${i + 1}: ${variant.title}`)

    try {
      const imageUrl = await generateWithStability(prompt)
      console.log(`✓ Concept ${i + 1} done`)
      concepts.push({
        id: `concept-${i + 1}`,
        title: variant.title,
        description: generateDescription(variant.title, analysis, requirements),
        imageUrl,
      })
    } catch (err) {
      console.error(`✗ Concept ${i + 1} failed: ${err.message}`)
    }
  }

  if (concepts.length === 0) {
    throw new Error('Failed to generate any concepts. Check your STABILITY_API_KEY and credits at platform.stability.ai')
  }
  return concepts
}

async function refineImage(imageBuffer, imageMimeType, modification) {
  const prompt = buildRefinementPrompt(modification)

  try {
    const imageUrl = await generateWithStability(prompt)
    return { imageUrl, description: `Revised: ${modification.slice(0, 100)}` }
  } catch (err) {
    throw new Error(`Refinement failed: ${err.message}`)
  }
}

function generateDescription(title, analysis, requirements) {
  const style = (Array.isArray(requirements.style) ? requirements.style[0] : requirements.style) || analysis.style || 'contemporary'
  const materials = (requirements.materials || analysis.materials || []).slice(0, 2).join(' & ') || 'premium materials'
  const colors = (requirements.colors || analysis.colors || [])[0] || 'neutral tones'
  const map = {
    'Warm Modern Luxury': `A luxurious ${style.toLowerCase()} space with warm ${colors}, ${materials} and golden accent lighting. Rich, inviting and refined.`,
    'Contemporary Earth Tones': `An earthy contemporary design using natural ${materials} with organic ${colors} tones. Grounded and elegant.`,
    'Minimal Premium': `A refined minimalist approach with premium ${materials} and a restrained palette of ${colors}. Understated elegance.`,
    'Modern Indian Contemporary': `Modern design with Indian contemporary sensibility. Warm ${colors} with ${materials} and cultural design language.`,
  }
  return map[title] || `A personalized ${title.toLowerCase()} concept.`
}

module.exports = { generateConcepts, refineImage, isDemoMode, buildGenerationPrompt }
