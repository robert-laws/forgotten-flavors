import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import TuneIcon from '@mui/icons-material/Tune'
import { formatSourceReference, getRecipeImageAlt, getRecipeMediaUrl } from '../utils/recipeUtils'

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RecipeDetailPage() {
  const { id } = useParams()
  const [allRecipes, setAllRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}recipes.json`)
        if (!res.ok) throw new Error('Could not load the recipe archive.')
        const data = await res.json()
        setAllRecipes(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const recipe = useMemo(() => allRecipes.find((r) => r.id === id) ?? null, [allRecipes, id])

  const related = useMemo(
    () => allRecipes.filter((r) => r.id !== id && r.culture === recipe?.culture).slice(0, 3),
    [allRecipes, id, recipe],
  )

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: '100vh' }}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Retrieving from the archive…
        </Typography>
      </Stack>
    )
  }

  if (error || !recipe) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'This recipe could not be found in the archive.'}
        </Alert>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} variant="outlined">
          Return to archive
        </Button>
      </Container>
    )
  }

  const totalMinutes = recipe.steps?.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) || null
  const yearLabel = formatYear(recipe.history?.firstRecordedYear)
  const yearsAgo =
    recipe.history?.firstRecordedYear != null
      ? Math.abs(2026 - recipe.history.firstRecordedYear)
      : null

  const required = (recipe.ingredients || []).filter((i) => !i.optional)
  const optional = (recipe.ingredients || []).filter((i) => i.optional)
  const heroImageUrl = getRecipeMediaUrl(recipe, 'heroImage')

  return (
    <Box sx={{ minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: 'linear-gradient(158deg, #131817 0%, #1e2a25 55%, #2d251e 100%)',
          pt: { xs: 2.5, md: 3.5 },
          pb: { xs: 7, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(115deg, rgba(63,107,98,0.2) 0%, transparent 58%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(203,137,89,0.25), transparent)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Back */}
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon sx={{ fontSize: 17 }} />}
            sx={{
              color: 'rgba(255,243,229,0.55)',
              mb: { xs: 3.5, md: 5 },
              px: 0,
              '&:hover': { color: '#fff8ef', bgcolor: 'transparent' },
            }}
          >
            Archive
          </Button>

          <Box
            sx={{
              display: 'grid',
              gap: { xs: 3, md: 5 },
              alignItems: 'end',
              gridTemplateColumns: { xs: '1fr', md: heroImageUrl ? 'minmax(0, 1fr) minmax(360px, 0.68fr)' : '1fr' },
              mb: 4.5,
            }}
          >
            <Box>
              {/* Culture · Era */}
              <Typography
                variant="overline"
                sx={{ color: 'rgba(203,137,89,0.8)', display: 'block', letterSpacing: 0 }}
              >
                {[recipe.culture, recipe.era].filter(Boolean).join(' · ')}
              </Typography>

              {/* Title */}
              <Typography
                variant="h2"
                sx={{
                  color: '#fff8ef',
                  mt: 0.75,
                  mb: 2.5,
                  maxWidth: 740,
                }}
              >
                {recipe.name}
              </Typography>

              {/* Meta chips */}
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {recipe.region && (
                  <Chip
                    label={recipe.region}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,248,239,0.09)',
                      color: '#ffe8d0',
                      border: '1px solid rgba(255,248,239,0.16)',
                    }}
                  />
                )}
                {yearLabel && (
                  <Chip
                    label={`circa ${yearLabel}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(155,86,49,0.2)',
                      color: '#ffd4a8',
                      border: '1px solid rgba(203,137,89,0.28)',
                    }}
                  />
                )}
                {recipe.history?.authenticity && (
                  <Chip
                    label={recipe.history.authenticity === 'inspired' ? 'Inspired' : 'Hybrid reconstruction'}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(63,107,98,0.22)',
                      color: '#b4dad5',
                      border: '1px solid rgba(125,156,147,0.28)',
                    }}
                  />
                )}
                {recipe.tags?.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,248,239,0.05)',
                      color: 'rgba(255,243,229,0.5)',
                      border: '1px solid rgba(255,248,239,0.09)',
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {heroImageUrl && (
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 4,
                  aspectRatio: { xs: '16 / 10', md: '4 / 3' },
                  minHeight: { xs: 230, md: 390 },
                  border: '1px solid rgba(255,248,239,0.12)',
                  boxShadow: '0 28px 70px rgba(0,0,0,0.34)',
                  bgcolor: '#211812',
                }}
              >
                <Box
                  component="img"
                  src={heroImageUrl}
                  alt={getRecipeImageAlt(recipe)}
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(17,12,8,0) 42%, rgba(17,12,8,0.66) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Stats bar */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)',
              },
              gap: { xs: 2.5, md: 0 },
              pt: 3,
              borderTop: '1px solid rgba(255,243,229,0.1)',
              '& > *:not(:last-child)': {
                borderRight: { md: '1px solid rgba(255,243,229,0.1)' },
                pr: { md: 3 },
              },
              '& > *:not(:first-of-type)': {
                pl: { md: 3 },
              },
            }}
          >
            {totalMinutes && (
              <StatBlock
                icon={<AccessTimeOutlinedIcon sx={{ fontSize: 17 }} />}
                label="Total time"
                value={`${totalMinutes} min`}
              />
            )}
            {recipe.servings && (
              <StatBlock
                icon={<PeopleOutlineIcon sx={{ fontSize: 17 }} />}
                label="Serves"
                value={recipe.servings}
              />
            )}
            {recipe.difficulty && (
              <StatBlock
                icon={<TuneIcon sx={{ fontSize: 17 }} />}
                label="Difficulty"
                value={capitalize(recipe.difficulty)}
              />
            )}
            {yearsAgo && (
              <StatBlock
                icon={<HistoryEduIcon sx={{ fontSize: 17 }} />}
                label="Approx. age"
                value={`~${yearsAgo.toLocaleString()} yrs`}
              />
            )}
            <StatBlock label="Ingredients" value={`${(recipe.ingredients || []).length} items`} />
          </Box>
        </Container>
      </Box>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          mt: { xs: -5, md: -7 },
          position: 'relative',
          zIndex: 2,
          borderRadius: '8px 8px 0 0',
          bgcolor: 'background.default',
          boxShadow: '0 -2px 40px rgba(20,12,6,0.35)',
        }}
      >
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={8}>

          {/* Lead paragraph */}
          {(recipe.description || recipe.summary) && (
            <Typography
              sx={{
                fontSize: { xs: '1.0625rem', md: '1.175rem' },
                lineHeight: 1.88,
                color: 'text.secondary',
                maxWidth: 760,
              }}
            >
              {recipe.description || recipe.summary}
            </Typography>
          )}

          {/* ── The Story ── */}
          {recipe.history && (
            <Box>
              <SectionLabel>The Story</SectionLabel>

              {/* Year display */}
              {yearLabel && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    mb: 3.5,
                    px: 3,
                    py: 2,
                    borderRadius: 4,
                    border: '1px solid rgba(155,86,49,0.18)',
                    bgcolor: 'rgba(155,86,49,0.055)',
                    gap: 0.35,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Fraunces", serif',
                      fontSize: { xs: '1.6rem', md: '2.1rem' },
                      fontWeight: 700,
                      color: 'primary.dark',
                      letterSpacing: 0,
                      lineHeight: 1,
                    }}
                  >
                    circa {yearLabel}
                  </Typography>
                  {yearsAgo && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      approximately {yearsAgo.toLocaleString()} years ago
                    </Typography>
                  )}
                </Box>
              )}

              {/* Context */}
              <Typography sx={{ lineHeight: 1.88, mb: recipe.history.culturalNote ? 3 : 0 }}>
                {recipe.history.context}
              </Typography>

              {/* Cultural note blockquote */}
              {recipe.history.culturalNote && (
                <Box
                  sx={{
                    pl: 3,
                    py: 0.75,
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                    mt: 2.5,
                  }}
                >
                  <Typography
                    sx={{ lineHeight: 1.88, fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    {recipe.history.culturalNote}
                  </Typography>
                </Box>
              )}

              {/* Authenticity callout */}
              {recipe.history.authenticity && (
                <Box
                  sx={{
                    mt: 3.5,
                    p: 2.25,
                    borderRadius: 3,
                    bgcolor:
                      recipe.history.authenticity === 'inspired'
                        ? 'rgba(63,107,98,0.07)'
                        : 'rgba(155,86,49,0.06)',
                    border: '1px solid',
                    borderColor:
                      recipe.history.authenticity === 'inspired'
                        ? 'rgba(63,107,98,0.16)'
                        : 'rgba(155,86,49,0.16)',
                    maxWidth: 600,
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 700,
                        color:
                          recipe.history.authenticity === 'inspired'
                            ? 'secondary.dark'
                            : 'primary.dark',
                      }}
                    >
                      {recipe.history.authenticity === 'inspired'
                        ? 'Inspired recipe — '
                        : 'Hybrid reconstruction — '}
                    </Box>
                    {recipe.history.authenticity === 'inspired'
                      ? 'Crafted in the spirit of the era using historically plausible ingredients and techniques, rather than a direct period transcription.'
                      : 'Blends documented period techniques with modern interpretation to produce an approachable reconstruction.'}
                  </Typography>
                </Box>
              )}

              {/* Sources */}
              {recipe.history.sources?.length > 0 && (
                <Box sx={{ mt: 3.5 }}>
                  <Typography
                    variant="overline"
                    sx={{ color: 'text.secondary', mb: 1.25, display: 'block', fontSize: '0.8rem', letterSpacing: 0 }}
                  >
                    Sources &amp; References
                  </Typography>
                  <Stack spacing={0.75}>
                    {recipe.history.sources.map((source, i) => {
                      const sourceLabel = formatSourceReference(source)

                      return (
                      <Typography
                        key={source.id || source.url || sourceLabel || i}
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          pl: 1.75,
                          borderLeft: '2px solid',
                          borderColor: 'divider',
                          lineHeight: 1.6,
                        }}
                      >
                        {sourceLabel}
                      </Typography>
                      )
                    })}
                  </Stack>
                </Box>
              )}
            </Box>
          )}

          <Divider />

          {/* ── Ingredients + Method ── */}
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 5, md: 7 },
              gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
              alignItems: 'start',
            }}
          >
            {/* Ingredients */}
            <Box>
              <SectionLabel>Ingredients</SectionLabel>
              {recipe.servings && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                  Quantities for {recipe.servings} servings
                </Typography>
              )}
              <Stack>
                {required.map((item, i) => (
                  <IngredientRow key={i} item={item} />
                ))}
                {optional.length > 0 && (
                  <>
                    <Typography
                      variant="overline"
                      sx={{ color: 'text.secondary', pt: 2, pb: 0.5, display: 'block', fontSize: '0.8rem', letterSpacing: 0 }}
                    >
                      Optional
                    </Typography>
                    {optional.map((item, i) => (
                      <IngredientRow key={`opt-${i}`} item={item} optional />
                    ))}
                  </>
                )}
              </Stack>
            </Box>

            {/* Method */}
            <Box>
              <SectionLabel>Method</SectionLabel>
              {totalMinutes && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                  {totalMinutes} min total across {(recipe.steps || []).length} steps
                </Typography>
              )}
              <Stack spacing={2}>
                {(recipe.steps || []).map((step) => (
                  <StepCard key={step.order} step={step} />
                ))}
              </Stack>
            </Box>
          </Box>

          {/* Tags */}
          {recipe.tags?.length > 0 && (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
              <Typography
                variant="overline"
                sx={{ color: 'text.secondary', fontSize: '0.8rem', letterSpacing: 0, mr: 0.5 }}
              >
                Tags
              </Typography>
              {recipe.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  size="small"
                  sx={{ color: 'text.secondary', borderColor: 'divider' }}
                />
              ))}
            </Stack>
          )}

          {/* ── Related recipes ── */}
          {related.length > 0 && (
            <Box>
              <SectionLabel>More from {recipe.culture}</SectionLabel>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                }}
              >
                {related.map((r) => (
                  <RelatedCard key={r.id} recipe={r} />
                ))}
              </Box>
            </Box>
          )}

        </Stack>
      </Container>
      </Box>
    </Box>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'block',
        mb: 2.25,
        color: 'primary.dark',
        fontSize: '0.8rem',
        letterSpacing: 0,
      }}
    >
      {children}
    </Typography>
  )
}

function StatBlock({ icon, label, value }) {
  return (
    <Stack spacing={0.4}>
      <Stack direction="row" spacing={0.65} alignItems="center">
        {icon && (
          <Box sx={{ color: 'rgba(203,137,89,0.65)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </Box>
        )}
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,243,229,0.42)',
            textTransform: 'uppercase',
            letterSpacing: 0,
            fontWeight: 700,
            fontSize: '0.62rem',
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ color: '#fff8ef', fontWeight: 700, fontSize: '1.0rem', lineHeight: 1 }}>
        {value}
      </Typography>
    </Stack>
  )
}

function IngredientRow({ item }) {
  const qty = item.quantity && item.unit ? `${item.quantity} ${item.unit}` : ''
  const nameParts = [item.prep, item.name].filter(Boolean)
  const displayName = nameParts.join(' ')

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr',
        gap: 1.5,
        py: 1.1,
        borderBottom: '1px solid rgba(72,50,32,0.08)',
        alignItems: 'baseline',
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, color: 'primary.dark', lineHeight: 1.5 }}
      >
        {qty}
      </Typography>
      <Box>
        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.55 }}>
          {displayName}
        </Typography>
        {item.substitutions?.length > 0 && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            sub: {item.substitutions[0]}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

function StepCard({ step }) {
  return (
    <Box
      sx={{
        p: 2.25,
        borderRadius: 4,
        bgcolor: 'rgba(251,244,232,0.55)',
        border: '1px solid rgba(94,70,50,0.1)',
      }}
    >
      <Stack direction="row" spacing={1.75} alignItems="flex-start">
        {/* Step number */}
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: '#fff8ef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '0.72rem',
            fontWeight: 800,
            mt: 0.1,
          }}
        >
          {step.order}
        </Box>

        <Stack spacing={1.25} sx={{ flex: 1 }}>
          {/* Instruction */}
          <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
            {step.instruction}
          </Typography>

          {/* Duration */}
          {step.durationMinutes && (
            <Box>
              <Chip
                size="small"
                label={`${step.durationMinutes} min`}
                sx={{
                  bgcolor: 'rgba(63,107,98,0.1)',
                  color: 'secondary.dark',
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
            </Box>
          )}

          {/* Tip */}
          {step.tutorialTips?.length > 0 && (
            <Box
              sx={{
                px: 1.75,
                py: 1,
                borderRadius: 2,
                bgcolor: 'rgba(155,86,49,0.065)',
                borderLeft: '2px solid',
                borderColor: 'primary.light',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', lineHeight: 1.65, display: 'block' }}
              >
                Tip: {step.tutorialTips[0]}
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

function RelatedCard({ recipe }) {
  const yearLabel = formatYear(recipe.history?.firstRecordedYear)

  return (
    <Box
      component={Link}
      to={`/recipe/${recipe.id}`}
      sx={{
        display: 'block',
        p: 2.25,
        borderRadius: 4,
        border: '1px solid rgba(94,70,50,0.12)',
        bgcolor: 'rgba(251,244,232,0.55)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          borderColor: 'rgba(155,86,49,0.4)',
          boxShadow: '0 4px 20px rgba(155,86,49,0.1)',
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'secondary.main',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0,
          display: 'block',
          mb: 0.5,
        }}
      >
        {recipe.era}
      </Typography>
      <Typography variant="h6" sx={{ fontSize: '1rem', lineHeight: 1.2, mb: 0.75 }}>
        {recipe.name}
      </Typography>
      {recipe.summary && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6, mb: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {recipe.summary}
        </Typography>
      )}
      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
        {recipe.region && <Chip label={recipe.region} size="small" variant="outlined" sx={{ fontSize: '0.68rem', height: 22 }} />}
        {yearLabel && <Chip label={yearLabel} size="small" sx={{ fontSize: '0.68rem', height: 22 }} />}
      </Stack>
    </Box>
  )
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function formatYear(year) {
  if (!Number.isFinite(year)) return null
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
