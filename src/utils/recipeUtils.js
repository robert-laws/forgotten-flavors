export function estimateMinutes(recipe) {
  const durations = (recipe.steps || [])
    .map((step) => Number(step.durationMinutes))
    .filter((value) => Number.isFinite(value) && value > 0)

  if (durations.length === 0) {
    return null
  }

  return durations.reduce((sum, value) => sum + value, 0)
}

export function getIngredientLine(item) {
  const qty = item.quantity ?? ''
  const unit = item.unit ? ` ${item.unit}` : ''
  const optional = item.optional ? ' (optional)' : ''
  return `${item.name} - ${qty}${unit}${optional}`.trim()
}

export function getCuratedKitItems(recipe) {
  return (recipe.commerce?.ingredientLinks || []).filter(Boolean)
}

export function hasCuratedKit(recipe) {
  return getCuratedKitItems(recipe).length > 0
}

export function getSuggestedKitItems(recipe) {
  return Array.from(new Set((recipe.ingredients || []).map((item) => item.name).filter(Boolean))).slice(0, 4)
}

export function toCartItemId(recipeId, itemName) {
  return `${recipeId}:${itemName}`
}

export function getMockPrice(itemName) {
  const hash = itemName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return Number((5 + (hash % 160) / 10).toFixed(2))
}

export function getRecipeSubstitutions(recipe) {
  const substitutions = (recipe.ingredients || [])
    .flatMap((ingredient) => ingredient.substitutions || [])
    .filter(Boolean)

  return Array.from(new Set(substitutions))
}

export function formatSelectedValues(selected, emptyLabel) {
  if (!Array.isArray(selected) || selected.length === 0) {
    return emptyLabel
  }

  if (selected.length === 1) {
    return selected[0]
  }

  return `${selected.length} selected`
}

export function quickFilterChipSx(active) {
  return {
    borderWidth: 1.5,
    borderColor: active ? 'primary.main' : 'rgba(84, 64, 46, 0.16)',
    bgcolor: active ? 'primary.main' : 'rgba(255, 248, 238, 0.86)',
    color: active ? 'primary.contrastText' : 'text.primary',
    boxShadow: active ? '0 12px 24px rgba(155, 86, 49, 0.18)' : 'none',
    fontWeight: 700,
    '&:hover': {
      bgcolor: active ? 'primary.dark' : 'rgba(155, 86, 49, 0.08)',
    },
  }
}
