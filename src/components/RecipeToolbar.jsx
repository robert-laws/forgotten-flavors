import { Box, Chip, Paper, Stack, Typography } from '@mui/material'

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
  const rangeStart = filteredCount === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, filteredCount)

  return (
    <Stack id="repository" spacing={2.5} sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          alignItems: 'end',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr auto' },
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.main' }}>
            Repository
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.5 }}>
            Recipe repository
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 660 }}>
            Compare reconstructions across periods, keep filters visible, and move into recipe dossiers or kit-building without
            losing your place.
          </Typography>
        </Box>

        <Paper
          sx={{
            p: 2.25,
            minWidth: { md: 240 },
            background: 'linear-gradient(135deg, #1c1511 0%, #35261c 100%)',
            color: '#fff8ef',
          }}
        >
          <Typography variant="overline" sx={{ color: 'rgba(255, 236, 220, 0.72)' }}>
            Current View
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5 }}>
            {rangeStart}-{rangeEnd}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 240, 228, 0.78)' }}>
            of {filteredCount} recipes{filteredCount !== totalCount ? ` from ${totalCount} total` : ''}
          </Typography>
        </Paper>
      </Box>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ alignItems: 'center' }}>
        <Chip
          label="45 min or less"
          variant="outlined"
          sx={{
            ...quickFilterChipSx(quickFilters.fast),
            px: 0.9,
            py: 0.45,
          }}
          onClick={onToggleFast}
        />
        <Chip
          label="Kit-ready only"
          variant="outlined"
          sx={{
            ...quickFilterChipSx(quickFilters.kitReady),
            px: 0.9,
            py: 0.45,
          }}
          onClick={onToggleKitReady}
        />
        <Chip
          label={`${filteredCount} match${filteredCount === 1 ? '' : 'es'}`}
          sx={{
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            px: 0.75,
            py: 0.35,
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {filteredCount !== totalCount ? `Filtered from ${totalCount} total` : `Full ${totalCount}-recipe archive`}
        </Typography>
        {activeFilters.map((label) => (
          <Chip key={label} label={label} size="small" variant="outlined" color="primary" />
        ))}
      </Stack>
    </Stack>
  )
}

export default RecipeToolbar
