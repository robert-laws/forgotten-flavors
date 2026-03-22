import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

function RecipeFiltersPanel({
  query,
  onQueryChange,
  culturesSelected,
  onCulturesChange,
  availableCultures,
  cultureCounts,
  erasSelected,
  onErasChange,
  availableEras,
  eraCounts,
  sortBy,
  onSortByChange,
  onReset,
  formatSelectedValues,
}) {
  return (
    <Paper
      sx={{
        p: { xs: 2, md: 2.75 },
        borderRadius: 7,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(251, 244, 232, 0.98) 0%, rgba(241, 228, 208, 0.98) 100%)',
        boxShadow: '0 22px 50px rgba(24, 13, 7, 0.24)',
        '& .MuiInputBase-input, & .MuiSelect-select': {
          fontSize: '0.95rem',
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.88rem',
        },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 250, 243, 0.92)',
        },
      }}
    >
      <Stack spacing={2.25}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.25}
          justifyContent="space-between"
          alignItems={{ md: 'flex-end' }}
        >
          <BoxCopy />
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
            Search by name, then narrow through culture and era without leaving the repository view.
          </Typography>
        </Stack>

        <Grid container spacing={1.25} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              placeholder="Name, region, flavor"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
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
                  onCulturesChange(typeof value === 'string' ? value.split(',') : value)
                }}
                renderValue={(selected) => formatSelectedValues(selected, 'All cultures')}
                MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
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
                  onErasChange(typeof value === 'string' ? value.split(',') : value)
                }}
                renderValue={(selected) => formatSelectedValues(selected, 'All eras')}
                MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
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

          <Grid item xs={8} sm={8} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-label">Sort</InputLabel>
              <Select labelId="sort-label" label="Sort" value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="time">Prep time</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4} sm={4} md={12}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color="primary"
              onClick={onReset}
              sx={{
                borderWidth: 1.5,
                justifyContent: { md: 'center' },
              }}
            >
              Reset filters
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  )
}

function BoxCopy() {
  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" sx={{ color: 'secondary.main' }}>
        Discovery Deck
      </Typography>
      <Typography variant="h6">Build a route through the archive</Typography>
    </Stack>
  )
}

export default RecipeFiltersPanel
