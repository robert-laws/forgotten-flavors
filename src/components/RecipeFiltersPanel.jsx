import { Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, Paper, Select, TextField } from '@mui/material'

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
            onChange={(event) => onQueryChange(event.target.value)}
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
                onErasChange(typeof value === 'string' ? value.split(',') : value)
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
            <Select labelId="sort-label" label="Sort" value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="name">Name (A-Z)</MenuItem>
              <MenuItem value="time">Prep time</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={2} md={1}>
          <Button fullWidth size="small" variant="text" onClick={onReset}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default RecipeFiltersPanel
