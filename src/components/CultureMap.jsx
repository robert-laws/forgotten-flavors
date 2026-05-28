import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import { formatYear } from '../utils/atlasUtils'

const WIDTH = 820
const HEIGHT = 420

function CultureMap({ atlas, culturesSelected, onToggleCulture }) {
  const [land, setLand] = useState(null)
  const [hovered, setHovered] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    let active = true
    fetch(`${import.meta.env.BASE_URL}data/world-land-110m.json`)
      .then((response) => (response.ok ? response.json() : Promise.reject(response)))
      .then((topology) => {
        if (active) {
          setLand(feature(topology, topology.objects.land))
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const projection = useMemo(
    () =>
      geoNaturalEarth1()
        .scale(150)
        .center([20, 25])
        .translate([WIDTH / 2, HEIGHT / 2]),
    [],
  )

  const pathGenerator = useMemo(() => geoPath(projection), [projection])
  const landPath = useMemo(() => (land ? pathGenerator(land) : ''), [land, pathGenerator])

  const maxCount = useMemo(
    () => atlas.reduce((max, entry) => Math.max(max, entry.count), 1),
    [atlas],
  )

  const markers = useMemo(
    () =>
      atlas
        .map((entry) => {
          const point = projection(entry.coordinates)
          if (!point) {
            return null
          }
          const radius = 6 + (entry.count / maxCount) * 9
          return { ...entry, x: point[0], y: point[1], radius }
        })
        .filter(Boolean),
    [atlas, projection, maxCount],
  )

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      <Box
        component="svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="World map of culinary cultures in the archive"
        sx={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <radialGradient id="atlas-ocean" cx="42%" cy="34%" r="80%">
            <stop offset="0%" stopColor="rgba(63, 107, 98, 0.20)" />
            <stop offset="100%" stopColor="rgba(31, 24, 18, 0.04)" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#atlas-ocean)" rx="14" />

        {landPath && (
          <path
            d={landPath}
            fill="rgba(155, 86, 49, 0.14)"
            stroke="rgba(97, 73, 49, 0.32)"
            strokeWidth={0.6}
          />
        )}

        {markers.map((marker) => {
          const selected = culturesSelected.includes(marker.culture)
          const isHovered = hovered?.culture === marker.culture
          return (
            <g
              key={marker.culture}
              transform={`translate(${marker.x}, ${marker.y})`}
              style={{ cursor: 'pointer' }}
              onClick={() => onToggleCulture(marker.culture)}
              onMouseEnter={() => setHovered(marker)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(marker)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              role="button"
              aria-pressed={selected}
              aria-label={`${marker.culture}, ${marker.count} recipes`}
            >
              {(selected || isHovered) && (
                <circle
                  r={marker.radius + 6}
                  fill="none"
                  stroke={selected ? 'rgba(155, 86, 49, 0.55)' : 'rgba(63, 107, 98, 0.45)'}
                  strokeWidth={1.5}
                />
              )}
              <circle
                r={marker.radius}
                fill={selected ? '#9b5631' : 'rgba(63, 107, 98, 0.82)'}
                stroke="#fbf4e8"
                strokeWidth={1.5}
                style={{ transition: 'fill 0.18s ease' }}
              />
            </g>
          )
        })}
      </Box>

      {hovered && (
        <Box
          sx={{
            position: 'absolute',
            left: `${(hovered.x / WIDTH) * 100}%`,
            top: `${(hovered.y / HEIGHT) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 14px))',
            pointerEvents: 'none',
            px: 1.5,
            py: 1,
            borderRadius: 2,
            bgcolor: 'rgba(27, 21, 17, 0.94)',
            color: '#fff4e9',
            boxShadow: '0 12px 28px rgba(0,0,0,0.32)',
            minWidth: 150,
            zIndex: 4,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#ffd5b7', lineHeight: 1.3 }}>
            {hovered.culture}
          </Typography>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography variant="caption" sx={{ color: 'rgba(255,240,228,0.75)' }}>
              {hovered.count} recipes
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,240,228,0.75)' }}>
              {formatYear(hovered.minYear)} – {formatYear(hovered.maxYear)}
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default CultureMap
