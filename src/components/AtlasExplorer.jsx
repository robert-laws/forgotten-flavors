import { Box, Button, Container, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import CultureMap from './CultureMap'
import EraTimeline from './EraTimeline'

function AtlasExplorer({
  view,
  onViewChange,
  cultureAtlas,
  eraAtlas,
  bounds,
  culturesSelected,
  onToggleCulture,
  erasSelected,
  onToggleEra,
  yearRange,
  onYearRangeChange,
  onReset,
  hasActiveSelection,
}) {
  return (
    <Box id="atlas" sx={{ py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: { xs: 2.5, md: 3.5 },
            background: 'linear-gradient(180deg, rgba(251, 244, 232, 0.98) 0%, rgba(243, 233, 215, 0.98) 100%)',
            overflow: 'visible',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
            spacing={1.5}
            sx={{ mb: 2.5 }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: 'secondary.main' }}>
                Interactive Atlas
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5 }}>
                {view === 'map' ? 'Trace the archive across the world' : 'Travel the archive through time'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
                {view === 'map'
                  ? 'Each marker is a culinary culture, sized by how many recipes it holds. Select one to filter the collection below.'
                  : 'Bands mark when each era’s recipes were first recorded. Drag the range or click a band to narrow the collection.'}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              {hasActiveSelection && (
                <Button size="small" variant="text" color="primary" onClick={onReset}>
                  Clear
                </Button>
              )}
              <ToggleButtonGroup
                value={view}
                exclusive
                size="small"
                onChange={(_, next) => next && onViewChange(next)}
                aria-label="Atlas view"
              >
                <ToggleButton value="map" aria-label="Map view">
                  <MapOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
                  Map
                </ToggleButton>
                <ToggleButton value="timeline" aria-label="Timeline view">
                  <TimelineOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
                  Timeline
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>

          {view === 'map' ? (
            <CultureMap
              atlas={cultureAtlas}
              culturesSelected={culturesSelected}
              onToggleCulture={onToggleCulture}
            />
          ) : (
            <EraTimeline
              eras={eraAtlas}
              bounds={bounds}
              yearRange={yearRange}
              onYearRangeChange={onYearRangeChange}
              erasSelected={erasSelected}
              onToggleEra={onToggleEra}
            />
          )}
        </Paper>
      </Container>
    </Box>
  )
}

export default AtlasExplorer
