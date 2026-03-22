import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined'

function DiscoveryHighlights({ featuredCultures, featuredEras, fastRecipesCount, curatedKitCount }) {
  const explorationModes = [
    {
      title: 'Follow culture trails',
      detail: 'Move from Roman pantry roasting to Andalusian spice kitchens through compact cultural clusters.',
      icon: <TravelExploreOutlinedIcon fontSize="small" />,
    },
    {
      title: 'Read historical context',
      detail: 'Every recipe opens into a dossier with period notes, sources, and reconstruction details.',
      icon: <HistoryEduOutlinedIcon fontSize="small" />,
    },
    {
      title: 'Build cookable kits',
      detail: 'Shift from archival curiosity to a practical ingredient bundle without leaving the collection.',
      icon: <LocalMallOutlinedIcon fontSize="small" />,
    },
  ]

  return (
    <Box id="highlights" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: { xs: '1fr', lg: '1.25fr 0.95fr' },
          }}
        >
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
              background: 'linear-gradient(135deg, #221813 0%, #38281f 100%)',
              color: '#fff8ef',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 'auto auto -52px -40px',
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(203, 137, 89, 0.34), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <Stack spacing={2.5} sx={{ position: 'relative' }}>
              <Box>
                <Typography variant="overline" sx={{ color: 'rgba(255, 236, 220, 0.74)' }}>
                  Curated Pathways
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, maxWidth: 640 }}>
                  A discovery surface that feels closer to an exhibition catalog than a utility table.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gap: 1.25,
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                }}
              >
                {explorationModes.map((item) => (
                  <Box
                    key={item.title}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      border: '1px solid rgba(255, 236, 220, 0.1)',
                      bgcolor: 'rgba(255, 249, 241, 0.06)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: 'rgba(203, 137, 89, 0.2)',
                          color: '#ffd5b7',
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 240, 228, 0.78)' }}>
                        {item.detail}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Paper>

          <Box sx={{ display: 'grid', gap: 2.5 }}>
            <Paper
              sx={{
                p: { xs: 2.5, md: 3 },
                background: 'linear-gradient(180deg, rgba(248, 239, 226, 0.98) 0%, rgba(240, 228, 206, 0.98) 100%)',
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="overline" sx={{ color: 'secondary.main' }}>
                  Culture Atlas
                </Typography>
                <Typography variant="h6">Major routes through the collection</Typography>
                <Stack spacing={1}>
                  {featuredCultures.map((culture) => (
                    <Stack key={culture.label} direction="row" justifyContent="space-between" alignItems="baseline">
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {culture.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {culture.count} recipes
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>

            <Paper
              sx={{
                p: { xs: 2.5, md: 3 },
                background: 'linear-gradient(180deg, rgba(222, 235, 225, 0.98) 0%, rgba(207, 225, 210, 0.98) 100%)',
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="overline" sx={{ color: 'secondary.dark' }}>
                  Kitchen Readiness
                </Typography>
                <Typography variant="h6">Dense enough for browsing, practical enough for cooking</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 1.75,
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 250, 244, 0.76)',
                      border: '1px solid rgba(56, 88, 80, 0.12)',
                    }}
                  >
                    <Typography variant="h5">{fastRecipesCount}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      under 45 minutes
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      p: 1.75,
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 250, 244, 0.76)',
                      border: '1px solid rgba(56, 88, 80, 0.12)',
                    }}
                  >
                    <Typography variant="h5">{curatedKitCount}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      kit-linked recipes
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Featured eras include {featuredEras.map((era) => era.label).slice(0, 3).join(', ')} and beyond.
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default DiscoveryHighlights
