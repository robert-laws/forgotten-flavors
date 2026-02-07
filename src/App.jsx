import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Container, Pagination, Paper, Stack, Typography } from '@mui/material'
import CartDrawer from './components/CartDrawer'
import HeroSection from './components/HeroSection'
import RecipeDetailsDrawer from './components/RecipeDetailsDrawer'
import RecipeFiltersPanel from './components/RecipeFiltersPanel'
import RecipeGrid from './components/RecipeGrid'
import RecipeToolbar from './components/RecipeToolbar'
import {
  estimateMinutes,
  formatSelectedValues,
  getIngredientLine,
  getKitItems,
  getMockPrice,
  getRecipeSubstitutions,
  quickFilterChipSx,
  toCartItemId,
} from './utils/recipeUtils'

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [culturesSelected, setCulturesSelected] = useState([])
  const [erasSelected, setErasSelected] = useState([])
  const [quickFilters, setQuickFilters] = useState({
    fast: false,
    kitReady: false,
  })
  const [sortBy, setSortBy] = useState('featured')
  const [page, setPage] = useState(1)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [detailTab, setDetailTab] = useState('recipe')
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [variationsByRecipe, setVariationsByRecipe] = useState({})
  const [variationName, setVariationName] = useState('')
  const [variationNotes, setVariationNotes] = useState('')

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}recipes.json`)
        if (!response.ok) {
          throw new Error('Could not load recipes.')
        }
        const data = await response.json()
        setRecipes(Array.isArray(data) ? data : [])
      } catch {
        setError('Could not load recipes. Check that public/recipes.json is available.')
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  const allCultures = useMemo(() => {
    const values = new Set(recipes.map((recipe) => recipe.culture).filter(Boolean))
    return Array.from(values)
  }, [recipes])

  const queryLowered = query.trim().toLowerCase()

  const availableCultures = useMemo(() => {
    const values = new Set(
      recipes
        .filter((recipe) => {
          const matchesEra = erasSelected.length === 0 || erasSelected.includes(recipe.era)
          const matchesFast = !quickFilters.fast || (estimateMinutes(recipe) ?? Number.MAX_SAFE_INTEGER) <= 45
          const matchesKitReady = !quickFilters.kitReady || getKitItems(recipe).length > 0
          const searchable = [recipe.name, recipe.summary, recipe.region, recipe.era, recipe.culture]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          const matchesSearch = queryLowered.length === 0 || searchable.includes(queryLowered)
          return matchesEra && matchesFast && matchesKitReady && matchesSearch
        })
        .map((recipe) => recipe.culture)
        .filter(Boolean),
    )

    return Array.from(values)
  }, [recipes, erasSelected, quickFilters, queryLowered])

  const availableEras = useMemo(() => {
    const values = new Set(
      recipes
        .filter((recipe) => {
          const matchesCulture =
            culturesSelected.length === 0 || culturesSelected.includes(recipe.culture)
          const matchesFast = !quickFilters.fast || (estimateMinutes(recipe) ?? Number.MAX_SAFE_INTEGER) <= 45
          const matchesKitReady = !quickFilters.kitReady || getKitItems(recipe).length > 0
          const searchable = [recipe.name, recipe.summary, recipe.region, recipe.era, recipe.culture]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          const matchesSearch = queryLowered.length === 0 || searchable.includes(queryLowered)
          return matchesCulture && matchesFast && matchesKitReady && matchesSearch
        })
        .map((recipe) => recipe.era)
        .filter(Boolean),
    )

    return Array.from(values)
  }, [recipes, culturesSelected, quickFilters, queryLowered])

  const cultureCounts = useMemo(() => {
    const counts = new Map()

    recipes.forEach((recipe) => {
      const matchesEra = erasSelected.length === 0 || erasSelected.includes(recipe.era)
      const matchesFast = !quickFilters.fast || (estimateMinutes(recipe) ?? Number.MAX_SAFE_INTEGER) <= 45
      const matchesKitReady = !quickFilters.kitReady || getKitItems(recipe).length > 0
      const searchable = [recipe.name, recipe.summary, recipe.region, recipe.era, recipe.culture]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const matchesSearch = queryLowered.length === 0 || searchable.includes(queryLowered)

      if (matchesEra && matchesFast && matchesKitReady && matchesSearch && recipe.culture) {
        counts.set(recipe.culture, (counts.get(recipe.culture) || 0) + 1)
      }
    })

    return counts
  }, [recipes, erasSelected, quickFilters, queryLowered])

  const eraCounts = useMemo(() => {
    const counts = new Map()

    recipes.forEach((recipe) => {
      const matchesCulture =
        culturesSelected.length === 0 || culturesSelected.includes(recipe.culture)
      const matchesFast = !quickFilters.fast || (estimateMinutes(recipe) ?? Number.MAX_SAFE_INTEGER) <= 45
      const matchesKitReady = !quickFilters.kitReady || getKitItems(recipe).length > 0
      const searchable = [recipe.name, recipe.summary, recipe.region, recipe.era, recipe.culture]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const matchesSearch = queryLowered.length === 0 || searchable.includes(queryLowered)

      if (matchesCulture && matchesFast && matchesKitReady && matchesSearch && recipe.era) {
        counts.set(recipe.era, (counts.get(recipe.era) || 0) + 1)
      }
    })

    return counts
  }, [recipes, culturesSelected, quickFilters, queryLowered])

  const filteredRecipes = useMemo(() => {
    const matches = recipes.filter((recipe) => {
      const matchesCulture =
        culturesSelected.length === 0 || culturesSelected.includes(recipe.culture)
      const matchesEra = erasSelected.length === 0 || erasSelected.includes(recipe.era)
      const matchesFast = !quickFilters.fast || (estimateMinutes(recipe) ?? Number.MAX_SAFE_INTEGER) <= 45
      const matchesKitReady = !quickFilters.kitReady || getKitItems(recipe).length > 0
      const searchable = [recipe.name, recipe.summary, recipe.region, recipe.era, recipe.culture]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch = queryLowered.length === 0 || searchable.includes(queryLowered)
      return matchesCulture && matchesEra && matchesFast && matchesKitReady && matchesSearch
    })

    return matches.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'time') {
        const aMinutes = estimateMinutes(a) ?? Number.MAX_SAFE_INTEGER
        const bMinutes = estimateMinutes(b) ?? Number.MAX_SAFE_INTEGER
        return aMinutes - bMinutes
      }
      return a.name.localeCompare(b.name)
    })
  }, [recipes, queryLowered, culturesSelected, erasSelected, quickFilters, sortBy])

  const activeFilters = [
    query ? `Search: ${query}` : null,
    culturesSelected.length > 0 ? `Culture: ${culturesSelected.join(', ')}` : null,
    erasSelected.length > 0 ? `Era: ${erasSelected.join(', ')}` : null,
    sortBy !== 'featured' ? `Sort: ${sortBy}` : null,
  ].filter(Boolean)

  const pageSize = 9
  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / pageSize))
  const pagedRecipes = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRecipes.slice(start, start + pageSize)
  }, [filteredRecipes, page])

  const cartItemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems])

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [cartItems],
  )

  useEffect(() => {
    setPage(1)
  }, [query, culturesSelected, erasSelected, quickFilters, sortBy])

  useEffect(() => {
    setCulturesSelected((previous) => {
      const next = previous.filter((value) => availableCultures.includes(value))
      return next.length === previous.length ? previous : next
    })
  }, [availableCultures])

  useEffect(() => {
    setErasSelected((previous) => {
      const next = previous.filter((value) => availableEras.includes(value))
      return next.length === previous.length ? previous : next
    })
  }, [availableEras])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const openRecipeDetails = (recipe, tab = 'recipe') => {
    setSelectedRecipe(recipe)
    setDetailTab(tab)
    setVariationName('')
    setVariationNotes('')
  }

  const closeRecipeDetails = () => {
    setSelectedRecipe(null)
    setDetailTab('recipe')
    setVariationName('')
    setVariationNotes('')
  }

  const addCartItem = (recipe, itemName) => {
    const id = toCartItemId(recipe.id, itemName)

    setCartItems((previous) => {
      const existing = previous.find((item) => item.id === id)
      if (existing) {
        return previous.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        )
      }

      return [
        ...previous,
        {
          id,
          itemName,
          recipeName: recipe.name,
          unitPrice: getMockPrice(itemName),
          quantity: 1,
        },
      ]
    })
  }

  const addKitToCart = (recipe) => {
    const kitItems = getKitItems(recipe)
    if (kitItems.length === 0) {
      return
    }

    kitItems.forEach((itemName) => {
      addCartItem(recipe, itemName)
    })

    setCartOpen(true)
  }

  const updateCartQuantity = (id, change) => {
    setCartItems((previous) =>
      previous
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + change,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeCartItem = (id) => {
    setCartItems((previous) => previous.filter((item) => item.id !== id))
  }

  const saveVariation = () => {
    if (!selectedRecipe) {
      return
    }

    const cleanName = variationName.trim()
    const cleanNotes = variationNotes.trim()
    if (!cleanName && !cleanNotes) {
      return
    }

    const nextVariation = {
      id: `${selectedRecipe.id}-${Date.now()}`,
      name: cleanName || 'Untitled variation',
      notes: cleanNotes || 'No notes provided.',
    }

    setVariationsByRecipe((previous) => ({
      ...previous,
      [selectedRecipe.id]: [...(previous[selectedRecipe.id] || []), nextVariation],
    }))
    setVariationName('')
    setVariationNotes('')
  }

  const resetFilters = () => {
    setQuery('')
    setCulturesSelected([])
    setErasSelected([])
    setQuickFilters({ fast: false, kitReady: false })
    setSortBy('featured')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 8% 0%, rgba(164, 107, 49, 0.18), transparent 40%), radial-gradient(circle at 96% 12%, rgba(47, 91, 84, 0.14), transparent 32%), #efe4d4',
        pb: 7,
      }}
    >
      <HeroSection
        allCulturesCount={allCultures.length}
        recipesCount={recipes.length}
        cartItemCount={cartItemCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <RecipeFiltersPanel
          query={query}
          onQueryChange={setQuery}
          culturesSelected={culturesSelected}
          onCulturesChange={setCulturesSelected}
          availableCultures={availableCultures}
          cultureCounts={cultureCounts}
          erasSelected={erasSelected}
          onErasChange={setErasSelected}
          availableEras={availableEras}
          eraCounts={eraCounts}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onReset={resetFilters}
          formatSelectedValues={formatSelectedValues}
        />

        <RecipeToolbar
          filteredCount={filteredRecipes.length}
          totalCount={recipes.length}
          page={page}
          pageSize={pageSize}
          activeFilters={activeFilters}
          quickFilters={quickFilters}
          onToggleFast={() =>
            setQuickFilters((previous) => ({
              ...previous,
              fast: !previous.fast,
            }))
          }
          onToggleKitReady={() =>
            setQuickFilters((previous) => ({
              ...previous,
              kitReady: !previous.kitReady,
            }))
          }
          quickFilterChipSx={quickFilterChipSx}
        />

        {loading && (
          <Stack alignItems="center" sx={{ py: 8 }}>
            <CircularProgress />
          </Stack>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && filteredRecipes.length === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              No recipes match current filters
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try broadening your search or clearing one of the active filters.
            </Typography>
            <Button variant="outlined" onClick={resetFilters}>
              Clear filters
            </Button>
          </Paper>
        )}

        {!loading && !error && filteredRecipes.length > 0 && (
          <RecipeGrid
            recipes={pagedRecipes}
            estimateMinutes={estimateMinutes}
            getIngredientLine={getIngredientLine}
            onOpenRecipeDetails={openRecipeDetails}
          />
        )}

        {!loading && !error && filteredRecipes.length > pageSize && (
          <Stack alignItems="center" sx={{ mt: 3 }}>
            <Pagination page={page} count={totalPages} onChange={(_, value) => setPage(value)} color="secondary" shape="rounded" />
          </Stack>
        )}
      </Container>

      <RecipeDetailsDrawer
        selectedRecipe={selectedRecipe}
        detailTab={detailTab}
        onDetailTabChange={setDetailTab}
        onClose={closeRecipeDetails}
        estimateMinutes={estimateMinutes}
        getRecipeSubstitutions={getRecipeSubstitutions}
        getIngredientLine={getIngredientLine}
        getKitItems={getKitItems}
        getMockPrice={getMockPrice}
        onAddCartItem={addCartItem}
        onAddKitToCart={addKitToCart}
        variationName={variationName}
        onVariationNameChange={setVariationName}
        variationNotes={variationNotes}
        onVariationNotesChange={setVariationNotes}
        onSaveVariation={saveVariation}
        savedVariations={selectedRecipe ? variationsByRecipe[selectedRecipe.id] || [] : []}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateCartQuantity={updateCartQuantity}
        onRemoveCartItem={removeCartItem}
        cartItemCount={cartItemCount}
        cartSubtotal={cartSubtotal}
      />
    </Box>
  )
}

export default App
