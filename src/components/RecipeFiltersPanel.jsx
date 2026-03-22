import {
  Button,
  Box,
  Checkbox,
  FormControl,
  InputAdornment,
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
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(251, 244, 232, 0.98) 0%, rgba(241, 228, 208, 0.98) 100%)',
        boxShadow: '0 22px 50px rgba(24, 13, 7, 0.24)',
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 250, 243, 0.92)',
          minHeight: 54,
        },
        '& .MuiInputBase-input, & .MuiSelect-select': {
          fontSize: '0.98rem',
        },
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        },
      }}
    >
      <Stack spacing={2.25}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 1.5, md: 2.25 },
            alignItems: 'end',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' },
          }}
        >
          <BoxCopy />

          <Box
            sx={{
              p: { xs: 1.15, md: 1.35 },
              borderRadius: 2,
              border: '1px solid rgba(83, 62, 43, 0.12)',
              bgcolor: 'rgba(255, 250, 242, 0.74)',
              justifySelf: { lg: 'end' },
            }}
          >
            <Typography variant="overline" sx={{ color: 'secondary.main' }}>
              How To Use It
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.45, lineHeight: 1.6, fontSize: '0.93rem' }}>
              Search broadly, then tighten the route with Culture and Era.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'minmax(0, 2fr) repeat(3, minmax(150px, 0.95fr)) 190px',
            },
            alignItems: 'end',
          }}
        >
          <FilterField label="Search">
            <TextField
              fullWidth
              size="small"
              placeholder="Search recipes, regions, flavors"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              inputProps={{ 'aria-label': 'Search recipes' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  opacity: 1,
                },
              }}
            />
          </FilterField>

          <FilterField label="Culture">
            <FormControl fullWidth size="small">
              <Select
                multiple
                displayEmpty
                value={culturesSelected}
                onChange={(event) => {
                  const value = event.target.value
                  onCulturesChange(typeof value === 'string' ? value.split(',') : value)
                }}
                renderValue={(selected) => renderValueLabel(formatSelectedValues(selected, 'All cultures'), selected.length === 0)}
                MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                inputProps={{ 'aria-label': 'Filter by culture' }}
                sx={{ minWidth: 0 }}
              >
                {availableCultures.map((value) => (
                  <MenuItem key={value} value={value}>
                    <Checkbox size="small" checked={culturesSelected.includes(value)} />
                    <ListItemText primary={`${value} (${cultureCounts.get(value) || 0})`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FilterField>

          <FilterField label="Era">
            <FormControl fullWidth size="small">
              <Select
                multiple
                displayEmpty
                value={erasSelected}
                onChange={(event) => {
                  const value = event.target.value
                  onErasChange(typeof value === 'string' ? value.split(',') : value)
                }}
                renderValue={(selected) => renderValueLabel(formatSelectedValues(selected, 'All eras'), selected.length === 0)}
                MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                inputProps={{ 'aria-label': 'Filter by era' }}
                sx={{ minWidth: 0 }}
              >
                {availableEras.map((value) => (
                  <MenuItem key={value} value={value}>
                    <Checkbox size="small" checked={erasSelected.includes(value)} />
                    <ListItemText primary={`${value} (${eraCounts.get(value) || 0})`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FilterField>

          <FilterField label="Sort">
            <FormControl fullWidth size="small">
              <Select
                value={sortBy}
                onChange={(event) => onSortByChange(event.target.value)}
                inputProps={{ 'aria-label': 'Sort recipes' }}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="time">Prep time</MenuItem>
              </Select>
            </FormControl>
          </FilterField>

          <Box sx={{ minWidth: { xl: 180 } }}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color="primary"
              onClick={onReset}
              sx={{
                minHeight: 54,
                borderWidth: 1.5,
              }}
            >
              Reset filters
            </Button>
          </Box>
        </Box>
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

function FilterField({ label, children }) {
  return (
    <Stack spacing={0.55}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0.35 }}>
        {label}
      </Typography>
      {children}
    </Stack>
  )
}

function renderValueLabel(text, muted) {
  return (
    <Typography component="span" sx={{ color: muted ? 'text.secondary' : 'text.primary' }}>
      {text}
    </Typography>
  )
}

export default RecipeFiltersPanel
