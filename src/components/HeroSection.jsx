import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

const heroImage = `${import.meta.env.BASE_URL}images/site/hero-archive-table.webp`
const ingredientImage = `${import.meta.env.BASE_URL}images/site/accent-ingredient-study.webp`
const eraMapImage = `${import.meta.env.BASE_URL}images/site/era-antique-map.webp`

function HeroSection({
  allCulturesCount,
  recipesCount,
  cartItemCount,
  onOpenCart,
  archiveReady,
  featuredCultures,
  featuredEras,
  curatedKitCount,
  sourceRichCount,
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 231, 214, 0.08)',
        background:
          'linear-gradient(135deg, #141817 0%, #1c2824 48%, #2c241d 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.16,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.88), rgba(0,0,0,0.18))',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 3.75, md: 7.5 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2.5, md: 4 },
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
          }}
        >
          <Stack spacing={{ xs: 2.1, md: 3 }}>
            <Stack direction="row" spacing={1.25} alignItems="center" useFlexGap flexWrap="wrap">
              <Typography variant="overline" sx={{ color: 'rgba(255, 236, 220, 0.76)' }}>
                Forgotten Flavors
              </Typography>
              <Chip
                label="Archive Edition"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 249, 241, 0.08)',
                  color: '#ffe9d7',
                  border: '1px solid rgba(255, 229, 208, 0.12)',
                }}
              />
            </Stack>

            <Box>
              <Typography variant="h1" sx={{ color: '#fff8ef', maxWidth: 760 }}>
                Lost tables, reframed as a modern culinary archive.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  maxWidth: 620,
                  color: 'rgba(255, 240, 228, 0.78)',
                  fontSize: { xs: '0.98rem', md: '1.07rem' },
                  lineHeight: 1.7,
                }}
              >
                Browse reconstructions across Roman, Greek, Egyptian, Persian, and later kitchen traditions through sourced
                dossiers, cookable kits, and practical notes for today&apos;s kitchen.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Button href="#repository" variant="contained" color="primary" size="large">
                Enter repository
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                startIcon={<ShoppingCartOutlinedIcon />}
                onClick={onOpenCart}
                sx={{
                  color: '#fff4e9',
                  borderColor: 'rgba(255, 232, 214, 0.22)',
                  '&:hover': {
                    borderColor: 'rgba(255, 232, 214, 0.42)',
                    bgcolor: 'rgba(255, 249, 241, 0.05)',
                  },
                }}
              >
                Cart ({cartItemCount})
              </Button>
            </Stack>

            {archiveReady && (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip
                  icon={<PublicOutlinedIcon />}
                  label={`${allCulturesCount} cultures`}
                  sx={{ bgcolor: 'rgba(255, 249, 241, 0.08)', color: '#fff2e3' }}
                />
                <Chip
                  icon={<AutoStoriesOutlinedIcon />}
                  label={`${recipesCount} recipes`}
                  sx={{ bgcolor: 'rgba(255, 249, 241, 0.08)', color: '#fff2e3' }}
                />
                <Chip
                  icon={<Inventory2OutlinedIcon />}
                  label={`${curatedKitCount} kit-linked entries`}
                  sx={{ bgcolor: 'rgba(255, 249, 241, 0.08)', color: '#fff2e3' }}
                />
              </Stack>
            )}
          </Stack>

          <Stack spacing={2}>
            <Box
              sx={{
                minHeight: { xs: 220, md: 430 },
                p: { xs: 2.25, md: 3 },
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 233, 214, 0.12)',
                backgroundImage: `linear-gradient(180deg, rgba(18, 13, 10, 0.1) 0%, rgba(18, 13, 10, 0.52) 62%, rgba(18, 13, 10, 0.88) 100%), url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: { xs: '68% center', md: 'center' },
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              {archiveReady && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 18,
                    right: 18,
                    width: 112,
                    height: 112,
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 233, 214, 0.16)',
                    color: '#ffe8d2',
                    display: { xs: 'none', md: 'grid' },
                    placeItems: 'center',
                    textAlign: 'center',
                    bgcolor: 'rgba(255, 249, 241, 0.05)',
                  }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ fontSize: '1.45rem' }}>
                      {sourceRichCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 240, 228, 0.78)' }}>
                      sourced entries
                    </Typography>
                  </Box>
                </Box>
              )}

              <Stack spacing={2} sx={{ maxWidth: 390, position: 'relative', zIndex: 1 }}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'rgba(255, 236, 220, 0.72)' }}>
                    Curator&apos;s Note
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.75, color: '#fff8ef', fontSize: { xs: '1.55rem', md: '2.1rem' } }}>
                    From pantry fragments to cookable dossiers
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 240, 228, 0.86)',
                    lineHeight: 1.75,
                    maxWidth: 360,
                    textShadow: '0 1px 18px rgba(0, 0, 0, 0.34)',
                  }}
                >
                  A reconstructed table scene sets the archive tone: tactile, moody, and grounded in ingredients, tools, and
                  source notes rather than decorative fantasy.
                </Typography>

                {archiveReady && (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    {featuredCultures.slice(0, 4).map((culture) => (
                      <Chip
                        key={culture.label}
                        label={`${culture.label} · ${culture.count}`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 249, 241, 0.08)',
                          color: '#fff0e0',
                          border: '1px solid rgba(255, 231, 214, 0.14)',
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            </Box>

            {archiveReady && (
              <Box
                sx={{
                  display: { xs: 'none', sm: 'grid' },
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                }}
              >
                <Box
                  sx={{
                    borderRadius: 4,
                    bgcolor: '#f7efe1',
                    border: '1px solid rgba(91, 64, 42, 0.12)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      minHeight: 108,
                      backgroundImage: `linear-gradient(180deg, rgba(33, 22, 15, 0.1) 0%, rgba(33, 22, 15, 0.45) 100%), url(${ingredientImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Box sx={{ p: 2.1 }}>
                    <Typography variant="overline" sx={{ color: 'secondary.main' }}>
                      Leading Cultures
                    </Typography>
                    <Stack spacing={0.7} sx={{ mt: 1.1 }}>
                      {featuredCultures.slice(0, 3).map((culture) => (
                        <Stack key={culture.label} direction="row" justifyContent="space-between" alignItems="baseline">
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {culture.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {culture.count} recipes
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Box>

                <Box
                  sx={{
                    borderRadius: 4,
                    bgcolor: 'rgba(92, 121, 113, 0.18)',
                    border: '1px solid rgba(190, 216, 205, 0.16)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      minHeight: 108,
                      backgroundImage: `linear-gradient(180deg, rgba(23, 18, 15, 0.12) 0%, rgba(23, 18, 15, 0.34) 100%), url(${eraMapImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center 44%',
                      filter: 'saturate(0.76) sepia(0.12)',
                    }}
                  />
                  <Box sx={{ p: 2.1 }}>
                    <Typography variant="overline" sx={{ color: '#d7ece5' }}>
                      Era Span
                    </Typography>
                    <Stack spacing={0.7} sx={{ mt: 1.1 }}>
                      {featuredEras.slice(0, 3).map((era) => (
                        <Stack key={era.label} direction="row" justifyContent="space-between" alignItems="baseline">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#f4f2ed' }}>
                            {era.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(241, 246, 243, 0.72)' }}>
                            {era.count} recipes
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Box>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection
