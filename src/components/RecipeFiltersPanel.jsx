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
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
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
        p: { xs: 2, md: 2.25 },
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(251, 244, 232, 0.98) 0%, rgba(241, 228, 208, 0.98) 100%)',
        boxShadow: '0 18px 36px rgba(24, 13, 7, 0.2)',
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
            display: 'flex',
            gap: { xs: 1.5, md: 2 },
            alignItems: { xs: 'stretch', sm: 'flex-start' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <BoxCopy />
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<RestartAltOutlinedIcon />}
            onClick={onReset}
            sx={{
              minHeight: 40,
              alignSelf: { xs: 'stretch', sm: 'flex-start' },
              px: 1.75,
            }}
          >
            Reset filters
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'minmax(0, 2fr) repeat(3, minmax(150px, 0.95fr))',
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
        </Box>
      </Stack>
    </Paper>
  )
}

function BoxCopy() {
  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" sx={{ color: 'secondary.main' }}>
        Archive Route
      </Typography>
      <Typography variant="h6">Find the next dish to explore</Typography>
    </Stack>
  )
}

function FilterField({ label, children }) {
  return (
    <Stack spacing={0.55}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0 }}>
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
