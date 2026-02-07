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

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 2 }}>
          <Typography variant="h5">Recipe Repository</Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredRecipes.length} of {recipes.length}
          </Typography>
        </Stack>

        {loading && (
          <Stack alignItems="center" sx={{ py: 8 }}>
            <CircularProgress />
          </Stack>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
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
                          <Button variant="contained" size="small">
                            View
                          </Button>
                          <Button variant="outlined" size="small">
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
    </Box>
  )
}

export default App
