/**
 * Analyzes the user's uploaded images and structured requirements
 * to produce a design analysis summary.
 *
 * In a production app this could call GPT-4o Vision.
 * For the MVP we derive a rich analysis from the structured inputs
 * so the analysis step always works — with or without an API key.
 */

const STYLE_DESCRIPTORS = {
  'Modern': {
    colors: ['White', 'Light Grey', 'Warm Beige'],
    materials: ['Glass', 'Metal', 'Concrete', 'Wood'],
    furniture: ['Clean-line sofa', 'Floating TV unit', 'Minimalist coffee table'],
    lighting: ['Recessed downlights', 'Linear pendant', 'Warm white LEDs'],
  },
  'Contemporary': {
    colors: ['Warm Beige', 'Taupe', 'Soft White'],
    materials: ['Wood', 'Glass', 'Fabric', 'Metal'],
    furniture: ['Sectional sofa', 'Marble coffee table', 'Accent chairs'],
    lighting: ['Pendant lights', 'Floor lamps', 'Cove lighting'],
  },
  'Modern Luxury': {
    colors: ['Cream', 'Walnut Brown', 'Gold Accents', 'Deep Charcoal'],
    materials: ['Marble', 'Solid Wood', 'Velvet', 'Brass'],
    furniture: ['Designer sectional', 'Marble console', 'Statement armchairs', 'Custom TV wall'],
    lighting: ['Chandelier', 'Cove lighting', 'Brass wall sconces', 'Spotlights'],
  },
  'Minimalist': {
    colors: ['Pure White', 'Light Grey', 'Warm Off-white'],
    materials: ['Concrete', 'Natural Wood', 'White Stone', 'Linen'],
    furniture: ['Low-profile sofa', 'Simple coffee table', 'Hidden storage'],
    lighting: ['Natural light focus', 'Recessed LEDs', 'Simple pendants'],
  },
  'Scandinavian': {
    colors: ['White', 'Light Grey', 'Natural Wood Tones', 'Dusty Blue'],
    materials: ['Light Wood', 'Wool', 'Linen', 'Ceramic'],
    furniture: ['Nordic sofa', 'Wooden coffee table', 'Hygge accessories'],
    lighting: ['Natural daylight', 'Warm Edison bulbs', 'Simple pendants'],
  },
  'Traditional': {
    colors: ['Warm Ivory', 'Rich Brown', 'Deep Red', 'Gold'],
    materials: ['Teak Wood', 'Marble', 'Fabric', 'Brass'],
    furniture: ['Classic sofa set', 'Carved coffee table', 'Heavy curtains', 'Decorative artifacts'],
    lighting: ['Chandeliers', 'Table lamps', 'Decorative wall lights'],
  },
  'Indian Contemporary': {
    colors: ['Warm Beige', 'Saffron Accents', 'Earthy Brown', 'Gold'],
    materials: ['Teak', 'Jaipuri Stone', 'Brass', 'Handloom Fabric'],
    furniture: ['Contemporary sofa with Indian cushions', 'Brass accent table', 'Jali screen panel'],
    lighting: ['Warm ambient lighting', 'Decorative diyas', 'Pendant lights'],
  },
  'Industrial': {
    colors: ['Charcoal', 'Raw Grey', 'Rust', 'Warm Brown'],
    materials: ['Exposed Brick', 'Steel', 'Reclaimed Wood', 'Concrete'],
    furniture: ['Leather sofa', 'Metal frame coffee table', 'Open shelving'],
    lighting: ['Edison bulbs', 'Industrial pendants', 'Track lighting'],
  },
  'Classic': {
    colors: ['Ivory', 'Champagne', 'Navy', 'Burgundy'],
    materials: ['Marble', 'Oak', 'Velvet', 'Gilded Brass'],
    furniture: ['Chesterfield sofa', 'Ornate mirror', 'Classic armchairs', 'Antique coffee table'],
    lighting: ['Crystal chandelier', 'Table lamps', 'Wall sconces'],
  },
  'Japandi': {
    colors: ['Warm White', 'Natural Wood', 'Sage Green', 'Charcoal'],
    materials: ['Bamboo', 'Natural Wood', 'Washi', 'Ceramic', 'Linen'],
    furniture: ['Low sofa', 'Wooden slatted bench', 'Bonsai', 'Ceramic vases'],
    lighting: ['Diffused paper lanterns', 'Natural light', 'Warm recessed LEDs'],
  },
}

const MATERIAL_DESCRIPTIONS = {
  'Wood': 'warm natural wood',
  'Marble': 'luxurious marble surfaces',
  'Granite': 'durable granite accents',
  'Glass': 'sleek glass elements',
  'Metal': 'refined metal details',
  'Concrete': 'raw concrete textures',
  'Stone': 'natural stone finishes',
  'Veneer': 'wood veneer paneling',
  'Laminate': 'high-quality laminate finishes',
  'Fabric': 'textured fabric upholstery',
  'Natural materials': 'organic natural materials',
}

function analyzeRequirements(data) {
  const {
    budget = '',
    styles = [],
    colors = [],
    materials = [],
    additionalRequirements = '',
    hasRoomImages = false,
    hasReferenceImages = false,
  } = data

  // Determine primary style
  const primaryStyle = styles[0] || 'Modern Luxury'
  const styleData = STYLE_DESCRIPTORS[primaryStyle] || STYLE_DESCRIPTORS['Modern Luxury']

  // Build color palette
  const colorPalette = colors.length > 0
    ? colors.slice(0, 4)
    : styleData.colors.slice(0, 3)

  // Build materials list
  const materialsList = materials.length > 0
    ? materials.slice(0, 4)
    : styleData.materials.slice(0, 3)

  // Build furniture list
  const furnitureList = styleData.furniture

  // Build lighting list
  const lightingList = styleData.lighting

  // Spatial characteristics (derived from context)
  const spatialCharacteristics = ['Existing room proportions preserved', 'Natural light integration']
  if (additionalRequirements.toLowerCase().includes('spacious') || additionalRequirements.toLowerCase().includes('open')) {
    spatialCharacteristics.push('Open-plan feel')
  }
  if (additionalRequirements.toLowerCase().includes('3bhk') || additionalRequirements.toLowerCase().includes('apartment')) {
    spatialCharacteristics.push('Apartment living room scale')
  }

  // Build design direction
  const designDirection = buildDesignDirection(primaryStyle, styles, budget, colors, materials, additionalRequirements)

  // Budget analysis
  const budgetAnalysis = analyzeBudget(budget)

  return {
    style: primaryStyle,
    allStyles: styles,
    colors: colorPalette,
    materials: materialsList,
    furniture: furnitureList,
    lighting: lightingList,
    spatialCharacteristics,
    designDirection,
    budgetAnalysis,
    clientPreferences: {
      budget,
      styles,
      colors,
      materials,
      additionalRequirements,
    },
  }
}

function buildDesignDirection(primaryStyle, allStyles, budget, colors, materials, additionalRequirements) {
  const styleDesc = primaryStyle.toLowerCase()
  const colorDesc = colors.length > 0 ? colors.slice(0, 2).join(' and ').toLowerCase() : 'neutral'
  const materialDesc = materials.length > 0 ? materials.slice(0, 2).join(' and ').toLowerCase() : 'quality'
  const budgetLevel = getBudgetLevel(budget)

  let direction = `Create a ${styleDesc} interior design transformation using ${colorDesc} tones with ${materialDesc} materials.`

  if (allStyles.length > 1) {
    direction += ` Blend elements of ${allStyles.slice(1).join(' and ').toLowerCase()} for a unique personalized result.`
  }

  if (budgetLevel === 'premium') {
    direction += ' Prioritize high-end finishes, custom elements, and premium lighting.'
  } else if (budgetLevel === 'mid') {
    direction += ' Use quality mid-range materials that look premium without excessive cost.'
  } else if (budgetLevel === 'budget') {
    direction += ' Focus on smart design choices: impactful colors, laminate/veneer finishes, and good lighting.'
  }

  if (additionalRequirements) {
    // Append key phrases from additional requirements
    const req = additionalRequirements.slice(0, 200)
    direction += ` Client note: ${req}`
  }

  return direction
}

function getBudgetLevel(budget) {
  if (!budget) return 'mid'
  const b = budget.toLowerCase()
  if (b.includes('under') || b.includes('2 lakh')) return 'budget'
  if (b.includes('4') || b.includes('7')) return 'mid'
  if (b.includes('10') || b.includes('15') || b.includes('20')) return 'premium'
  if (b.includes('20+') || b.includes('20 lakh+')) return 'luxury'
  return 'mid'
}

function analyzeBudget(budget) {
  if (!budget) {
    return {
      label: 'Not specified',
      furniture: 60,
      lighting: 40,
      wallTreatment: 50,
      flooring: 45,
      decor: 30,
    }
  }

  const level = getBudgetLevel(budget)

  const profiles = {
    budget: {
      label: budget,
      furniture: 55,
      lighting: 30,
      wallTreatment: 45,
      flooring: 35,
      decor: 20,
    },
    mid: {
      label: budget,
      furniture: 65,
      lighting: 50,
      wallTreatment: 55,
      flooring: 50,
      decor: 35,
    },
    premium: {
      label: budget,
      furniture: 75,
      lighting: 65,
      wallTreatment: 65,
      flooring: 60,
      decor: 50,
    },
    luxury: {
      label: budget,
      furniture: 90,
      lighting: 80,
      wallTreatment: 80,
      flooring: 75,
      decor: 65,
    },
  }

  return profiles[level] || profiles.mid
}

module.exports = { analyzeRequirements }
