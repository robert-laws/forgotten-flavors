import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

function estimateMinutes(recipe) {
  const durations = (recipe.steps || [])
    .map((step) => Number(step.durationMinutes))
    .filter((value) => Number.isFinite(value) && value > 0)

  if (durations.length === 0) {
    return null
  }

  return durations.reduce((sum, value) => sum + value, 0)
}

function getIngredientLine(item) {
  const qty = item.quantity ?? ''
  const unit = item.unit ? ` ${item.unit}` : ''
  const optional = item.optional ? ' (optional)' : ''
  return `${item.name} - ${qty}${unit}${optional}`.trim()
}

function getKitItems(recipe) {
  if ((recipe.commerce?.ingredientLinks || []).length > 0) {
    return recipe.commerce.ingredientLinks
  }

  return (recipe.ingredients || []).slice(0, 4).map((item) => item.name)
}

function toCartItemId(recipeId, itemName) {
  return `${recipeId}:${itemName}`
}

function getMockPrice(itemName) {
  const hash = itemName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return Number((5 + (hash % 160) / 10).toFixed(2))
}

function getRecipeSubstitutions(recipe) {
  const substitutions = (recipe.ingredients || [])
    .flatMap((ingredient) => ingredient.substitutions || [])
    .filter(Boolean)

  return Array.from(new Set(substitutions))
}

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

  const formatSelectedValues = (selected, emptyLabel) => {
    if (!Array.isArray(selected) || selected.length === 0) {
      return emptyLabel
    }

    if (selected.length === 1) {
      return selected[0]
    }

    return `${selected.length} selected`
  }

  const quickFilterChipSx = (active) => ({
    borderWidth: 1.5,
    borderColor: active ? 'secondary.main' : 'rgba(39, 25, 15, 0.2)',
    bgcolor: active ? 'secondary.main' : 'background.paper',
    color: active ? 'secondary.contrastText' : 'text.primary',
    fontWeight: 600,
    '&:hover': {
      bgcolor: active ? 'secondary.dark' : 'rgba(45, 95, 88, 0.08)',
    },
  })

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

  const allEras = useMemo(() => {
    const values = new Set(recipes.map((recipe) => recipe.era).filter(Boolean))
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
    quickFilters.fast ? 'Quick: 45 min or less' : null,
    quickFilters.kitReady ? 'Quick: kit-ready' : null,
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 8% 0%, rgba(164, 107, 49, 0.18), transparent 40%), radial-gradient(circle at 96% 12%, rgba(47, 91, 84, 0.14), transparent 32%), #efe4d4',
        pb: 7,
      }}
    >
      <Box sx={{ borderBottom: '1px solid rgba(35, 24, 14, 0.12)' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
          <Stack spacing={2}>
            <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 2 }}>
              FORGOTTEN FLAVORS
            </Typography>
            <Typography variant="h2" sx={{ maxWidth: 940 }}>
              Lost Tables, Reimagined for Modern Kitchens
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 760 }}>
              Browse inspired Roman and Greek reconstructions with compact discovery tools and clear paths to cook or build ingredient
              kits.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.25}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
            >
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip icon={<PublicOutlinedIcon />} label={`${allCultures.length} cultures`} color="secondary" />
                <Chip icon={<MenuBookOutlinedIcon />} label={`${recipes.length} recipes`} color="secondary" />
                <Chip icon={<LocalMallOutlinedIcon />} label="Kit-ready concepts" color="secondary" />
              </Stack>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ShoppingCartOutlinedIcon />}
                onClick={() => setCartOpen(true)}
                sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
              >
                Cart ({cartItemCount})
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: 2.5,
            '& .MuiInputBase-input, & .MuiSelect-select': {
              fontSize: '0.92rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.9rem',
            },
          }}
        >
          <Grid container spacing={1.25} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                placeholder="Name, region, flavor"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="culture-filter-label">Culture</InputLabel>
                <Select
                  multiple
                  labelId="culture-filter-label"
                  label="Culture"
                  value={culturesSelected}
                  onChange={(event) => {
                    const value = event.target.value
                    setCulturesSelected(typeof value === 'string' ? value.split(',') : value)
                  }}
                  renderValue={(selected) => formatSelectedValues(selected, 'All cultures')}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                  sx={{ minWidth: 170 }}
                >
                  {availableCultures.map((value) => (
                    <MenuItem key={value} value={value}>
                      <Checkbox size="small" checked={culturesSelected.includes(value)} />
                      <ListItemText primary={`${value} (${cultureCounts.get(value) || 0})`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="era-filter-label">Era</InputLabel>
                <Select
                  multiple
                  labelId="era-filter-label"
                  label="Era"
                  value={erasSelected}
                  onChange={(event) => {
                    const value = event.target.value
                    setErasSelected(typeof value === 'string' ? value.split(',') : value)
                  }}
                  renderValue={(selected) => formatSelectedValues(selected, 'All eras')}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                  sx={{ minWidth: 170 }}
                >
                  {availableEras.map((value) => (
                    <MenuItem key={value} value={value}>
                      <Checkbox size="small" checked={erasSelected.includes(value)} />
                      <ListItemText primary={`${value} (${eraCounts.get(value) || 0})`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select labelId="sort-label" label="Sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="time">Prep time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={2} md={1}>
              <Button
                fullWidth
                size="small"
                variant="text"
                onClick={() => {
                  setQuery('')
                  setCulturesSelected([])
                  setErasSelected([])
                  setQuickFilters({ fast: false, kitReady: false })
                  setSortBy('featured')
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip
            label="45 min or less"
            variant="outlined"
            sx={{
              ...quickFilterChipSx(quickFilters.fast),
              px: 0.65,
              py: 0.4,
            }}
            onClick={() =>
              setQuickFilters((previous) => ({
                ...previous,
                fast: !previous.fast,
              }))
            }
          />
          <Chip
            label="Kit-ready only"
            variant="outlined"
            sx={{
              ...quickFilterChipSx(quickFilters.kitReady),
              px: 0.65,
              py: 0.4,
            }}
            onClick={() =>
              setQuickFilters((previous) => ({
                ...previous,
                kitReady: !previous.kitReady,
              }))
            }
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 1.5 }}>
          <Typography variant="h5">Recipe Repository</Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredRecipes.length === 0 ? 0 : (page - 1) * pageSize + 1}
            -
            {Math.min(page * pageSize, filteredRecipes.length)} of {filteredRecipes.length}
          </Typography>
        </Stack>

        {activeFilters.length > 0 && (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
            {activeFilters.map((label) => (
              <Chip key={label} label={label} size="small" variant="outlined" color="secondary" />
            ))}
          </Stack>
        )}

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
            <Button
              variant="outlined"
              onClick={() => {
                setQuery('')
                setCulturesSelected([])
                setErasSelected([])
                setQuickFilters({ fast: false, kitReady: false })
                setSortBy('featured')
              }}
            >
              Clear filters
            </Button>
          </Paper>
        )}

        {!loading && !error && filteredRecipes.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            }}
          >
            {pagedRecipes.map((recipe) => {
              const minutes = estimateMinutes(recipe)

              return (
                <Card key={recipe.id} sx={{ height: '100%', minHeight: 340 }}>
                  <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack spacing={1.25} sx={{ height: '100%' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                          {recipe.name}
                        </Typography>
                        {minutes && <Chip size="small" label={`${minutes} min`} />}
                      </Stack>

                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        {recipe.culture && <Chip label={recipe.culture} variant="outlined" color="secondary" size="small" />}
                        {recipe.region && <Chip label={recipe.region} variant="outlined" size="small" />}
                        {recipe.era && <Chip label={recipe.era} variant="outlined" size="small" />}
                      </Stack>

                      {recipe.summary && (
                        <Typography variant="body2" color="text.secondary">
                          {recipe.summary}
                        </Typography>
                      )}

                      <Box sx={{ flexGrow: 1 }}>
                        <Divider />
                        <Box sx={{ pt: 0.75 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Key ingredients
                          </Typography>
                          <List dense disablePadding sx={{ mt: 0.25 }}>
                            {(recipe.ingredients || []).slice(0, 2).map((item, index) => (
                              <ListItem key={`${recipe.id}-ingredient-${index}`} disableGutters sx={{ py: 0 }}>
                                <ListItemText
                                  primary={getIngredientLine(item)}
                                  primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ pt: 0.5, mt: 'auto' }}>
                        <Button fullWidth variant="contained" size="small" onClick={() => openRecipeDetails(recipe, 'recipe')}>
                          View
                        </Button>
                        <Button fullWidth variant="outlined" size="small" onClick={() => openRecipeDetails(recipe, 'kit')}>
                          Kit
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        )}

        {!loading && !error && filteredRecipes.length > pageSize && (
          <Stack alignItems="center" sx={{ mt: 3 }}>
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, value) => setPage(value)}
              color="secondary"
              shape="rounded"
            />
          </Stack>
        )}
      </Container>

      <Drawer anchor="right" open={Boolean(selectedRecipe)} onClose={closeRecipeDetails}>
        <Box sx={{ width: { xs: '100vw', sm: 470 }, p: 2.5 }}>
          {selectedRecipe && (
            <Stack spacing={2}>
              {(() => {
                const totalMinutes = estimateMinutes(selectedRecipe)
                const substitutions = getRecipeSubstitutions(selectedRecipe)
                const savedVariations = variationsByRecipe[selectedRecipe.id] || []

                return (
                  <>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h5" sx={{ lineHeight: 1.15, mb: 0.5 }}>
                    {selectedRecipe.name}
                  </Typography>
                  <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                    {selectedRecipe.culture && <Chip label={selectedRecipe.culture} size="small" color="secondary" variant="outlined" />}
                    {selectedRecipe.region && <Chip label={selectedRecipe.region} size="small" variant="outlined" />}
                    {selectedRecipe.era && <Chip label={selectedRecipe.era} size="small" variant="outlined" />}
                  </Stack>
                </Box>
                <IconButton onClick={closeRecipeDetails}>
                  <CloseIcon />
                </IconButton>
              </Stack>

              <Tabs value={detailTab} onChange={(_, value) => setDetailTab(value)}>
                <Tab label="Recipe" value="recipe" />
                <Tab label="History" value="history" />
                <Tab label="Kit" value="kit" />
                <Tab label="Variations" value="variations" />
              </Tabs>

              {detailTab === 'recipe' && (
                <Stack spacing={1.5}>
                  {selectedRecipe.summary && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedRecipe.summary}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                    {totalMinutes && <Chip size="small" label={`${totalMinutes} min total`} />}
                    <Chip size="small" label={`${(selectedRecipe.ingredients || []).length} ingredients`} />
                    <Chip size="small" label={`${(selectedRecipe.steps || []).length} steps`} />
                  </Stack>
                  <Divider />
                  <Typography variant="subtitle2">Ingredients</Typography>
                  <List dense disablePadding>
                    {(selectedRecipe.ingredients || []).map((item, index) => (
                      <ListItem key={`${selectedRecipe.id}-drawer-ingredient-${index}`} disableGutters>
                        <ListItemText primary={getIngredientLine(item)} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="subtitle2">Steps</Typography>
                  <List dense disablePadding>
                    {(selectedRecipe.steps || []).map((step) => (
                      <ListItem key={`${selectedRecipe.id}-drawer-step-${step.order}`} disableGutters>
                        <ListItemText
                          primary={`${step.order}. ${step.instruction}`}
                          secondary={
                            step.durationMinutes
                              ? `${step.durationMinutes} min${step.tutorialTips?.length ? ` · Tip: ${step.tutorialTips[0]}` : ''}`
                              : step.tutorialTips?.length
                                ? `Tip: ${step.tutorialTips[0]}`
                                : ''
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  {substitutions.length > 0 && (
                    <>
                      <Typography variant="subtitle2">Substitution ideas</Typography>
                      <List dense disablePadding>
                        {substitutions.map((substitution) => (
                          <ListItem key={substitution} disableGutters>
                            <ListItemText primary={substitution} />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </Stack>
              )}

              {detailTab === 'history' && (
                <Stack spacing={1.25}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRecipe.history?.context || 'No history available for this recipe.'}
                  </Typography>
                  {selectedRecipe.history?.sources?.length > 0 && (
                    <>
                      <Typography variant="subtitle2">Sources</Typography>
                      <List dense disablePadding>
                        {selectedRecipe.history.sources.map((source) => (
                          <ListItem key={source} disableGutters>
                            <ListItemText primary={source} />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </Stack>
              )}

              {detailTab === 'kit' && (
                <Stack spacing={1.25}>
                  <Typography variant="body2" color="text.secondary">
                    Add a ready-to-cook ingredient kit to the cart.
                  </Typography>
                  {getKitItems(selectedRecipe).length > 0 ? (
                    <List dense disablePadding>
                      {getKitItems(selectedRecipe).map((item) => (
                        <ListItem key={item} disableGutters>
                          <ListItemText primary={item} secondary={`$${getMockPrice(item).toFixed(2)}`} />
                          <Button size="small" variant="outlined" onClick={() => addCartItem(selectedRecipe, item)}>
                            Add
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info">No predefined kit items yet for this recipe.</Alert>
                  )}
                  <Button variant="contained" startIcon={<LocalMallOutlinedIcon />} onClick={() => addKitToCart(selectedRecipe)}>
                    Add Entire Kit
                  </Button>
                </Stack>
              )}

              {detailTab === 'variations' && (
                <Stack spacing={1.5}>
                  <Typography variant="body2" color="text.secondary">
                    Save your personal twist for this recipe. Variations persist for this browser session.
                  </Typography>
                  <TextField
                    label="Variation name"
                    size="small"
                    value={variationName}
                    onChange={(event) => setVariationName(event.target.value)}
                  />
                  <TextField
                    label="What changed?"
                    size="small"
                    multiline
                    minRows={3}
                    value={variationNotes}
                    onChange={(event) => setVariationNotes(event.target.value)}
                  />
                  <Button variant="contained" onClick={saveVariation}>
                    Save variation
                  </Button>
                  {savedVariations.length === 0 ? (
                    <Alert severity="info">No variations saved for this recipe yet.</Alert>
                  ) : (
                    <List dense disablePadding>
                      {savedVariations.map((variation) => (
                        <ListItem key={variation.id} disableGutters>
                          <ListItemText primary={variation.name} secondary={variation.notes} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Stack>
              )}
                  </>
                )
              })()}
            </Stack>
          )}
        </Box>
      </Drawer>

      <Drawer anchor="left" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: { xs: '100vw', sm: 400 }, p: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">Cart</Typography>
              <IconButton onClick={() => setCartOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>

            {cartItems.length === 0 && (
              <Alert severity="info">Your cart is empty. Add kit items from any recipe.</Alert>
            )}

            {cartItems.length > 0 && (
              <>
                <List dense disablePadding>
                  {cartItems.map((item) => (
                    <ListItem key={item.id} disableGutters sx={{ alignItems: 'flex-start', py: 1 }}>
                      <ListItemText
                        primary={item.itemName}
                        secondary={`${item.recipeName} · $${item.unitPrice.toFixed(2)} each`}
                        sx={{ mr: 1 }}
                      />
                      <Stack direction="row" spacing={0.25} alignItems="center">
                        <IconButton size="small" onClick={() => updateCartQuantity(item.id, -1)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => updateCartQuantity(item.id, 1)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <Button size="small" color="inherit" onClick={() => removeCartItem(item.id)}>
                        Remove
                      </Button>
                    </ListItem>
                  ))}
                </List>

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">Subtotal ({cartItemCount} items)</Typography>
                  <Typography variant="h6">${cartSubtotal.toFixed(2)}</Typography>
                </Stack>

                <Button variant="contained" size="large" startIcon={<ShoppingCartOutlinedIcon />}>
                  Checkout (Mock)
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Drawer>
    </Box>
  )
}

export default App
