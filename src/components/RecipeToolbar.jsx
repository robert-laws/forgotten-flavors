import { Chip, Stack, Typography } from '@mui/material'

function RecipeToolbar({
  filteredCount,
  totalCount,
  page,
  pageSize,
  activeFilters,
  quickFilters,
  onToggleFast,
  onToggleKitReady,
  quickFilterChipSx,
}) {
  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 1.25 }}>
        <Typography variant="h5">Recipe Repository</Typography>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredCount === 0 ? 0 : (page - 1) * pageSize + 1}
          -
          {Math.min(page * pageSize, filteredCount)} of {filteredCount}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2, alignItems: 'center' }}>
        <Chip
          label="45 min or less"
          variant="outlined"
          sx={{
            ...quickFilterChipSx(quickFilters.fast),
            px: 0.65,
            py: 0.4,
          }}
          onClick={onToggleFast}
        />
        <Chip
          label="Kit-ready only"
          variant="outlined"
          sx={{
            ...quickFilterChipSx(quickFilters.kitReady),
            px: 0.65,
            py: 0.4,
          }}
          onClick={onToggleKitReady}
        />
        <Chip
          color="secondary"
          variant="filled"
          label={`${filteredCount} match${filteredCount === 1 ? '' : 'es'}`}
          sx={{ fontWeight: 700 }}
        />
        <Typography variant="body2" color="text.secondary">
          {filteredCount !== totalCount ? `of ${totalCount} total` : 'all shown'}
        </Typography>
        {activeFilters.map((label) => (
          <Chip key={label} label={label} size="small" variant="outlined" color="secondary" />
        ))}
      </Stack>
    </>
  )
}

export default RecipeToolbar
