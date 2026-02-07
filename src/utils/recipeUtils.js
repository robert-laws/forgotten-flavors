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

export function getKitItems(recipe) {
  if ((recipe.commerce?.ingredientLinks || []).length > 0) {
    return recipe.commerce.ingredientLinks
  }

  return (recipe.ingredients || []).slice(0, 4).map((item) => item.name)
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
    borderColor: active ? 'secondary.main' : 'rgba(39, 25, 15, 0.2)',
    bgcolor: active ? 'secondary.main' : 'background.paper',
    color: active ? 'secondary.contrastText' : 'text.primary',
    fontWeight: 600,
    '&:hover': {
      bgcolor: active ? 'secondary.dark' : 'rgba(45, 95, 88, 0.08)',
    },
  }
}
