import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import CloseIcon from '@mui/icons-material/Close'

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

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [culture, setCulture] = useState('all')
  const [era, setEra] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [detailTab, setDetailTab] = useState('recipe')

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

  const cultures = useMemo(() => {
    const values = new Set(recipes.map((recipe) => recipe.culture).filter(Boolean))
    return ['all', ...Array.from(values)]
  }, [recipes])

  const eras = useMemo(() => {
    const values = new Set(recipes.map((recipe) => recipe.era).filter(Boolean))
    return ['all', ...Array.from(values)]
  }, [recipes])

  const filteredRecipes = useMemo(() => {
    const lowered = query.trim().toLowerCase()

    const matches = recipes.filter((recipe) => {
      const matchesCulture = culture === 'all' || recipe.culture === culture
      const matchesEra = era === 'all' || recipe.era === era
      const searchable = [recipe.name, recipe.summary, recipe.region, recipe.era, recipe.culture]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch = lowered.length === 0 || searchable.includes(lowered)
      return matchesCulture && matchesEra && matchesSearch
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
  }, [recipes, query, culture, era, sortBy])

  const activeFilters = [
    query ? `Search: ${query}` : null,
    culture !== 'all' ? `Culture: ${culture}` : null,
    era !== 'all' ? `Era: ${era}` : null,
    sortBy !== 'featured' ? `Sort: ${sortBy}` : null,
  ].filter(Boolean)

  const openRecipeDetails = (recipe, tab = 'recipe') => {
    setSelectedRecipe(recipe)
    setDetailTab(tab)
  }

  const closeRecipeDetails = () => {
    setSelectedRecipe(null)
    setDetailTab('recipe')
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
            <Typography variant="h2" sx={{ maxWidth: 860 }}>
              Lost Tables, Reimagined for Modern Kitchens
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 760 }}>
              Browse inspired Roman and Greek reconstructions with compact discovery tools and clear paths to cook or build ingredient
              kits.
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip icon={<PublicOutlinedIcon />} label={`${cultures.length - 1} cultures`} color="secondary" />
              <Chip icon={<MenuBookOutlinedIcon />} label={`${recipes.length} recipes`} color="secondary" />
              <Chip icon={<LocalMallOutlinedIcon />} label="Kit-ready concepts" color="secondary" />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2.5 }}>
          <Grid container spacing={1.25} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                placeholder="Name, region, flavor"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="culture-filter-label">Culture</InputLabel>
                <Select
                  labelId="culture-filter-label"
                  label="Culture"
                  value={culture}
                  onChange={(event) => setCulture(event.target.value)}
                >
                  {cultures.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value === 'all' ? 'All cultures' : value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="era-filter-label">Era</InputLabel>
                <Select labelId="era-filter-label" label="Era" value={era} onChange={(event) => setEra(event.target.value)}>
                  {eras.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value === 'all' ? 'All eras' : value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select labelId="sort-label" label="Sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="time">Prep time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={6} md={1}>
              <Button
                fullWidth
                size="small"
                variant="text"
                onClick={() => {
                  setQuery('')
                  setCulture('all')
                  setEra('all')
                  setSortBy('featured')
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 1.5 }}>
          <Typography variant="h5">Recipe Repository</Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredRecipes.length} of {recipes.length}
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
                setCulture('all')
                setEra('all')
                setSortBy('featured')
              }}
            >
              Clear filters
            </Button>
          </Paper>
        )}

        {!loading && !error && filteredRecipes.length > 0 && (
          <Grid container spacing={2}>
            {filteredRecipes.map((recipe) => {
              const minutes = estimateMinutes(recipe)

              return (
                <Grid key={recipe.id} item xs={12} sm={6} lg={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={1.25}>
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

                        <Stack spacing={0.25} sx={{ pt: 0.25 }}>
                          {(recipe.ingredients || []).slice(0, 3).map((item, index) => (
                            <Typography key={`${recipe.id}-ingredient-${index}`} variant="caption" color="text.secondary">
                              {getIngredientLine(item)}
                            </Typography>
                          ))}
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
                          <Button variant="contained" size="small" onClick={() => openRecipeDetails(recipe, 'recipe')}>
                            View
                          </Button>
                          <Button variant="outlined" size="small" onClick={() => openRecipeDetails(recipe, 'kit')}>
                            Kit
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Container>

      <Drawer anchor="right" open={Boolean(selectedRecipe)} onClose={closeRecipeDetails}>
        <Box sx={{ width: { xs: '100vw', sm: 470 }, p: 2.5 }}>
          {selectedRecipe && (
            <Stack spacing={2}>
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
              </Tabs>

              {detailTab === 'recipe' && (
                <Stack spacing={1.5}>
                  {selectedRecipe.summary && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedRecipe.summary}
                    </Typography>
                  )}
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
                          secondary={step.durationMinutes ? `${step.durationMinutes} min` : ''}
                        />
                      </ListItem>
                    ))}
                  </List>
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
                    Build an ingredient kit from this recipe. This is a starter mock flow for Iteration 2.
                  </Typography>
                  {(selectedRecipe.commerce?.ingredientLinks || []).length > 0 ? (
                    <List dense disablePadding>
                      {selectedRecipe.commerce.ingredientLinks.map((item) => (
                        <ListItem key={item} disableGutters>
                          <ListItemText primary={item} secondary="Mock listing" />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info">No predefined kit items yet for this recipe.</Alert>
                  )}
                  <Button variant="contained" startIcon={<LocalMallOutlinedIcon />}>
                    Add Kit to Cart (Mock)
                  </Button>
                </Stack>
              )}
            </Stack>
          )}
        </Box>
      </Drawer>
    </Box>
  )
}

export default App
