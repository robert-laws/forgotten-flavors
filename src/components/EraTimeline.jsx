import { useMemo, useState } from 'react'
import { Box, Slider, Stack, Typography } from '@mui/material'
import { formatYear, getCultureColor } from '../utils/atlasUtils'

const WIDTH = 820
const PAD_LEFT = 16
const PAD_RIGHT = 16
const TOP = 30
const LANE_HEIGHT = 16
const BAND_HEIGHT = 9
const MIN_BAND_WIDTH = 9

function niceTicks(min, max) {
  const span = max - min
  const step =
    span > 2400 ? 500 : span > 1000 ? 250 : span > 400 ? 100 : span > 150 ? 50 : span > 60 ? 25 : 10
  const start = Math.ceil(min / step) * step
  const ticks = []
  for (let year = start; year <= max; year += step) {
    ticks.push(year)
  }
  return ticks
}

function EraTimeline({ eras, bounds, yearRange, onYearRangeChange, erasSelected, onToggleEra }) {
  const [hovered, setHovered] = useState(null)

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT

  const [lo, hi] = yearRange
  const isFullRange = lo <= bounds.min && hi >= bounds.max

  // The plot zooms to the selected window; the slider below stays full-span.
  const rawLo = isFullRange ? bounds.min : lo
  const rawHi = isFullRange ? bounds.max : hi
  const viewPad = Math.max(1, (rawHi - rawLo) * 0.04)
  const viewMin = rawLo - viewPad
  const viewMax = rawHi + viewPad
  const span = Math.max(1, viewMax - viewMin)
  const scaleX = (year) => PAD_LEFT + ((year - viewMin) / span) * plotWidth

  // Greedy lane packing so era bands don't overlap horizontally. Only bands that
  // intersect the current view are placed, and edges are clipped to the plot.
  const placed = useMemo(() => {
    const laneEnds = []
    return eras
      .filter((era) => era.maxYear >= viewMin && era.minYear <= viewMax)
      .map((era) => {
        const rawX1 = scaleX(era.minYear)
        const rawX2 = Math.max(scaleX(era.maxYear), rawX1 + MIN_BAND_WIDTH)
        const x1 = Math.max(rawX1, PAD_LEFT)
        const x2 = Math.min(rawX2, WIDTH - PAD_RIGHT)
        let lane = laneEnds.findIndex((end) => x1 > end + 4)
        if (lane === -1) {
          lane = laneEnds.length
        }
        laneEnds[lane] = x2
        return { ...era, x1, x2, lane }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eras, viewMin, viewMax])

  const laneCount = placed.reduce((max, band) => Math.max(max, band.lane + 1), 1)
  const height = TOP + laneCount * LANE_HEIGHT + 12
  const ticks = useMemo(() => niceTicks(rawLo, rawHi), [rawLo, rawHi])

  return (
    <Box>
      <Box
        component="svg"
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label="Timeline of culinary eras in the archive"
        sx={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {ticks.map((year) => (
          <g key={year}>
            <line
              x1={scaleX(year)}
              x2={scaleX(year)}
              y1={TOP - 8}
              y2={height - 10}
              stroke="rgba(97, 73, 49, 0.12)"
              strokeWidth={1}
            />
            <text
              x={scaleX(year)}
              y={16}
              textAnchor="middle"
              fontSize={10}
              fill="rgba(97, 73, 49, 0.7)"
              fontFamily="Manrope, sans-serif"
            >
              {formatYear(year)}
            </text>
          </g>
        ))}

        {placed.map((band) => {
          const selected = erasSelected.includes(band.era)
          const inRange = band.maxYear >= lo && band.minYear <= hi
          const color = getCultureColor(band.culture)
          const y = TOP + band.lane * LANE_HEIGHT
          return (
            <rect
              key={band.era}
              x={band.x1}
              y={y}
              width={band.x2 - band.x1}
              height={BAND_HEIGHT}
              rx={BAND_HEIGHT / 2}
              fill={color}
              opacity={inRange ? (selected ? 1 : 0.82) : 0.22}
              stroke={selected ? '#1f1812' : 'transparent'}
              strokeWidth={selected ? 1.5 : 0}
              style={{ cursor: 'pointer', transition: 'opacity 0.18s ease, x 0.25s ease, width 0.25s ease' }}
              onClick={() => onToggleEra(band.era)}
              onMouseEnter={() => setHovered({ ...band, y })}
              onMouseLeave={() => setHovered(null)}
            >
              <title>{`${band.era} · ${band.culture} (${band.count})`}</title>
            </rect>
          )
        })}
      </Box>

      <Box
        sx={{
          minHeight: 24,
          mt: -0.5,
          mb: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {hovered && (
          <>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getCultureColor(hovered.culture) }} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {hovered.era}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {hovered.culture} · {formatYear(hovered.minYear)}–{formatYear(hovered.maxYear)} · {hovered.count} recipes
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ px: 1, mt: 0.5 }}>
        <Slider
          value={yearRange}
          min={bounds.min}
          max={bounds.max}
          onChange={(_, value) => onYearRangeChange(value)}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatYear(value)}
          getAriaLabel={() => 'Year range'}
          color="primary"
        />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            {formatYear(bounds.min)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isFullRange ? 'Full span' : `${formatYear(lo)} – ${formatYear(hi)}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatYear(bounds.max)}
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}

export default EraTimeline
