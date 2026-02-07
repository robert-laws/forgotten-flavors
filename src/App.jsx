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
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 10% 0%, rgba(164, 107, 49, 0.22), transparent 40%), radial-gradient(circle at 95% 10%, rgba(47, 91, 84, 0.18), transparent 35%), #efe4d4',
        pb: 8,
      }}
    >
      <Box sx={{ borderBottom: '1px solid rgba(35, 24, 14, 0.12)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={8}>
              <Stack spacing={2.5}>
                <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 2 }}>
                  FORGOTTEN FLAVORS
                </Typography>
                <Typography variant="h2" sx={{ maxWidth: 780 }}>
                  Lost Tables, Reimagined for Modern Kitchens
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 760, color: 'text.secondary' }}>
                  Explore creative Roman and Greek reconstructions, then build your cooking flow with ingredients, prep guidance, and
                  historical context.
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip icon={<PublicOutlinedIcon />} label={`${cultures.length - 1} cultures`} color="secondary" />
                  <Chip icon={<MenuBookOutlinedIcon />} label={`${recipes.length} recipes`} color="secondary" />
                  <Chip icon={<LocalMallOutlinedIcon />} label="Kit-ready concepts" color="secondary" />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ height: '100%', p: 3 }}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    ITERATION 1 FOCUS
                  </Typography>
                  <Typography variant="h5">Discovery Experience</Typography>
                  <Typography variant="body2" color="text.secondary">
                    This pass optimizes recipe browsing: better filtering, stronger visual hierarchy, and a cleaner path to recipe detail
                    and purchase intent.
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{ p: 2.5, position: { md: 'sticky' }, top: { md: 24 } }}>
              <Stack spacing={2}>
                <Typography variant="h6">Filters</Typography>
                <TextField
                  label="Search"
                  placeholder="Name, region, flavor"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  fullWidth
                />

                <FormControl fullWidth>
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

                <FormControl fullWidth>
                  <InputLabel id="era-filter-label">Era</InputLabel>
                  <Select labelId="era-filter-label" label="Era" value={era} onChange={(event) => setEra(event.target.value)}>
                    {eras.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value === 'all' ? 'All eras' : value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Divider />

                <Button
                  variant="text"
                  onClick={() => {
                    setQuery('')
                    setCulture('all')
                    setEra('all')
                    setSortBy('featured')
                  }}
                >
                  Reset all
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }}>
                <Box>
                  <Typography variant="h4">Recipe Repository</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Showing {filteredRecipes.length} of {recipes.length} recipes
                  </Typography>
                </Box>
                <FormControl sx={{ minWidth: 220 }}>
                  <InputLabel id="sort-label">Sort</InputLabel>
                  <Select labelId="sort-label" label="Sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <MenuItem value="featured">Featured</MenuItem>
                    <MenuItem value="name">Name (A-Z)</MenuItem>
                    <MenuItem value="time">Prep time (fastest)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              {loading && (
                <Stack alignItems="center" sx={{ py: 8 }}>
                  <CircularProgress />
                </Stack>
              )}

              {error && <Alert severity="error">{error}</Alert>}

              {!loading && !error && (
                <Grid container spacing={2.5}>
                  {filteredRecipes.map((recipe) => {
                    const minutes = estimateMinutes(recipe)

                    return (
                      <Grid key={recipe.id} item xs={12} lg={6}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Stack spacing={1.75}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                                <Typography variant="h5" sx={{ lineHeight: 1.15 }}>
                                  {recipe.name}
                                </Typography>
                                {minutes && <Chip size="small" label={`${minutes} min`} />}
                              </Stack>

                              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                {recipe.culture && <Chip label={recipe.culture} variant="outlined" color="secondary" size="small" />}
                                {recipe.region && <Chip label={recipe.region} variant="outlined" size="small" />}
                                {recipe.era && <Chip label={recipe.era} variant="outlined" size="small" />}
                              </Stack>

                              {recipe.summary && (
                                <Typography variant="body2" color="text.secondary">
                                  {recipe.summary}
                                </Typography>
                              )}

                              <Divider />

                              <Typography variant="subtitle2" color="text.secondary">
                                Key ingredients
                              </Typography>
                              <Stack spacing={0.5}>
                                {(recipe.ingredients || []).slice(0, 4).map((item, index) => (
                                  <Typography key={`${recipe.id}-ingredient-${index}`} variant="body2">
                                    {getIngredientLine(item)}
                                  </Typography>
                                ))}
                              </Stack>

                              <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                                <Button variant="contained" size="small">
                                  View Recipe
                                </Button>
                                <Button variant="outlined" size="small">
                                  Build Ingredient Kit
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
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default App
