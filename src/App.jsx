import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  AppBar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [culture, setCulture] = useState('all')

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
        setError('Could not load recipes. Check that recipes.json is available.')
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

  const filteredRecipes = useMemo(() => {
    const lowered = query.trim().toLowerCase()

    return recipes.filter((recipe) => {
      const matchesCulture = culture === 'all' || recipe.culture === culture
      const searchable = [
        recipe.name,
        recipe.summary,
        recipe.region,
        recipe.era,
        recipe.culture,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch = lowered.length === 0 || searchable.includes(lowered)
      return matchesCulture && matchesSearch
    })
  }, [recipes, query, culture])

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f4ede2 0%, #e8d8c1 50%, #d8b892 100%)' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Forgotten Flavors
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Reconstructed Roman and Greek Recipes
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 900 }}>
            A creative, inspired catalog of nearly-lost culinary traditions. Filter by culture and search by flavor, era, or region.
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Search recipes"
              variant="outlined"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              fullWidth
            />
            <FormControl sx={{ minWidth: 220 }}>
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
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </Typography>
        </Stack>

        {loading && (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <Grid container spacing={3}>
            {filteredRecipes.map((recipe) => (
              <Grid key={recipe.id} item xs={12} md={6} xl={4}>
                <Card sx={{ height: '100%', borderRadius: 3, backdropFilter: 'blur(6px)' }}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {recipe.name}
                      </Typography>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {recipe.culture && <Chip label={recipe.culture} color="secondary" variant="outlined" />}
                        {recipe.region && <Chip label={recipe.region} variant="outlined" />}
                        {recipe.era && <Chip label={recipe.era} variant="outlined" />}
                      </Stack>
                      {recipe.summary && (
                        <Typography variant="body2" color="text.secondary">
                          {recipe.summary}
                        </Typography>
                      )}

                      <Divider />

                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Ingredients
                      </Typography>
                      <List dense disablePadding>
                        {(recipe.ingredients || []).slice(0, 6).map((item, index) => (
                          <ListItem key={`${recipe.id}-ingredient-${index}`} disableGutters sx={{ py: 0.25 }}>
                            <ListItemText
                              primary={`${item.name} - ${item.quantity ?? ''}${item.unit ? ` ${item.unit}` : ''}${item.optional ? ' (optional)' : ''}`}
                            />
                          </ListItem>
                        ))}
                      </List>

                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Steps
                      </Typography>
                      <List dense disablePadding>
                        {(recipe.steps || []).slice(0, 3).map((step) => (
                          <ListItem key={`${recipe.id}-step-${step.order}`} disableGutters sx={{ py: 0.25 }}>
                            <ListItemText primary={`${step.order}. ${step.instruction}`} />
                          </ListItem>
                        ))}
                      </List>

                      {recipe.history?.context && (
                        <>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            History
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {recipe.history.context}
                          </Typography>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default App
