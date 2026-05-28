import { CULTURE_COORDS } from '../data/cultureGeo'

// Deterministic earthy color per culture so map/timeline share a visual key.
export function getCultureColor(culture) {
  const text = culture || ''
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 360
  }
  const hue = 18 + (hash % 150) // copper-to-sage band
  return `hsl(${hue}, 42%, 46%)`
}

export function getRecipeYear(recipe) {
  const year = recipe?.history?.firstRecordedYear
  return typeof year === 'number' && Number.isFinite(year) ? year : null
}

export function formatYear(year) {
  if (typeof year !== 'number' || !Number.isFinite(year)) {
    return '—'
  }
  if (year < 0) {
    return `${Math.abs(year)} BCE`
  }
  return `${year} CE`
}

// True when the recipe falls inside an active year range. A null range (the
// default) and recipes without a recorded year always pass.
export function withinYears(recipe, range, lo, hi) {
  if (!range) {
    return true
  }
  const year = getRecipeYear(recipe)
  return year == null || (year >= lo && year <= hi)
}

export function getYearBounds(recipes) {
  const years = recipes.map(getRecipeYear).filter((value) => value != null)
  if (years.length === 0) {
    return { min: 0, max: 0 }
  }
  return { min: Math.min(...years), max: Math.max(...years) }
}

// One marker per culture: coordinates, recipe count, and the span of years it
// covers in the archive. Cultures without a known coordinate are skipped.
export function buildCultureAtlas(recipes) {
  const byCulture = new Map()

  recipes.forEach((recipe) => {
    const culture = recipe.culture
    if (!culture) {
      return
    }
    const entry = byCulture.get(culture) || {
      culture,
      count: 0,
      years: [],
      eras: new Set(),
      regions: new Set(),
    }
    entry.count += 1
    const year = getRecipeYear(recipe)
    if (year != null) {
      entry.years.push(year)
    }
    if (recipe.era) {
      entry.eras.add(recipe.era)
    }
    if (recipe.region) {
      entry.regions.add(recipe.region)
    }
    byCulture.set(culture, entry)
  })

  return Array.from(byCulture.values())
    .filter((entry) => CULTURE_COORDS[entry.culture])
    .map((entry) => ({
      culture: entry.culture,
      count: entry.count,
      coordinates: CULTURE_COORDS[entry.culture],
      minYear: entry.years.length ? Math.min(...entry.years) : null,
      maxYear: entry.years.length ? Math.max(...entry.years) : null,
      eraCount: entry.eras.size,
      regions: Array.from(entry.regions),
    }))
    .sort((a, b) => b.count - a.count || a.culture.localeCompare(b.culture))
}

// One band per era, positioned by its earliest/latest recorded year, grouped by
// culture so the timeline reads as parallel lanes.
export function buildEraAtlas(recipes) {
  const byEra = new Map()

  recipes.forEach((recipe) => {
    const era = recipe.era
    if (!era) {
      return
    }
    const entry = byEra.get(era) || {
      era,
      culture: recipe.culture || '',
      count: 0,
      years: [],
    }
    entry.count += 1
    const year = getRecipeYear(recipe)
    if (year != null) {
      entry.years.push(year)
    }
    byEra.set(era, entry)
  })

  return Array.from(byEra.values())
    .filter((entry) => entry.years.length > 0)
    .map((entry) => ({
      era: entry.era,
      culture: entry.culture,
      count: entry.count,
      minYear: Math.min(...entry.years),
      maxYear: Math.max(...entry.years),
      midYear: Math.round((Math.min(...entry.years) + Math.max(...entry.years)) / 2),
    }))
    .sort((a, b) => a.minYear - b.minYear || a.era.localeCompare(b.era))
}
