import { Box, Button, Card, CardContent, Chip, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import { Link } from 'react-router-dom'
import { getRecipeImageAlt, getRecipeMediaUrl } from '../utils/recipeUtils'

function RecipeGrid({ recipes, estimateMinutes, getIngredientLine, onOpenRecipeDetails }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2.25,
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
      }}
    >
      {recipes.map((recipe) => {
        const minutes = estimateMinutes(recipe)
        const recordedYear = formatRecordedYear(recipe.history?.firstRecordedYear)
        const thumbnailUrl = getRecipeMediaUrl(recipe, 'thumbnailImage')

        return (
          <Card
            key={recipe.id}
            sx={{
              height: '100%',
              minHeight: 540,
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(251, 244, 232, 0.98) 0%, rgba(244, 235, 222, 0.98) 100%)',
            }}
          >
            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {thumbnailUrl && (
                <Box
                  sx={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    overflow: 'hidden',
                    bgcolor: '#201812',
                    borderBottom: '1px solid rgba(72, 50, 32, 0.12)',
                  }}
                >
                  <Box
                    component="img"
                    src={thumbnailUrl}
                    alt={getRecipeImageAlt(recipe)}
                    loading="lazy"
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
                        'linear-gradient(180deg, rgba(16, 10, 6, 0.02) 0%, rgba(16, 10, 6, 0.18) 62%, rgba(16, 10, 6, 0.58) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <Chip
                    label={recipe.macroRegion || recipe.region || 'Archive'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      left: 14,
                      bottom: 14,
                      bgcolor: 'rgba(255, 248, 239, 0.88)',
                      color: 'text.primary',
                      border: '1px solid rgba(255, 248, 239, 0.5)',
                    }}
                  />
                </Box>
              )}

              <Stack spacing={1.75} sx={{ p: 2.25, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.25}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', display: 'block', lineHeight: 1.4 }}
                    >
                      {recipe.culture || 'Archive'}
                    </Typography>
                    <Typography
                      component={Link}
                      to={`/recipe/${recipe.id}`}
                      variant="h6"
                      sx={{
                        mt: 0.35,
                        lineHeight: 1.08,
                        color: 'text.primary',
                        display: 'block',
                        textDecoration: 'underline',
                        textDecorationColor: 'rgba(155, 86, 49, 0.36)',
                        textDecorationThickness: 2,
                        textUnderlineOffset: 5,
                        transition: 'color 0.15s ease, text-decoration-color 0.15s ease',
                        '&:hover': {
                          color: 'primary.main',
                          textDecorationColor: 'primary.main',
                        },
                        '&:focus-visible': {
                          outline: '3px solid rgba(155, 86, 49, 0.32)',
                          outlineOffset: 4,
                          borderRadius: 1,
                        },
                      }}
                    >
                      {recipe.name}
                    </Typography>
                  </Box>

                  <Stack spacing={0.75} alignItems="flex-end" sx={{ flexShrink: 0 }}>
                    {recordedYear && <Chip size="small" label={recordedYear} variant="outlined" />}
                    {minutes && (
                      <Chip
                        size="small"
                        label={`${minutes} min`}
                        sx={{ bgcolor: 'rgba(63, 107, 98, 0.12)', color: 'secondary.dark' }}
                      />
                    )}
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                  {recipe.region && <Chip label={recipe.region} variant="outlined" size="small" color="secondary" />}
                  {recipe.era && <Chip label={recipe.era} variant="outlined" size="small" />}
                </Stack>

                {recipe.summary && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {recipe.summary}
                  </Typography>
                )}

                <Box
                  sx={{
                    p: 1.6,
                    borderRadius: 4,
                    bgcolor: 'rgba(84, 118, 109, 0.08)',
                    border: '1px solid rgba(63, 107, 98, 0.12)',
                  }}
                >
                  <Typography variant="overline" sx={{ color: 'secondary.main' }}>
                    Kitchen Notes
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense disablePadding>
                    {(recipe.ingredients || []).slice(0, 2).map((item, index) => (
                      <ListItem key={`${recipe.id}-ingredient-${index}`} disableGutters sx={{ py: 0.2 }}>
                        <ListItemText
                          primary={getIngredientLine(item)}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Stack direction="row" spacing={1} sx={{ pt: 0.75 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<ArticleOutlinedIcon />}
                      onClick={() => onOpenRecipeDetails(recipe, 'recipe')}
                    >
                      Open dossier
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<LocalMallOutlinedIcon />}
                      onClick={() => onOpenRecipeDetails(recipe, 'kit')}
                    >
                      Build kit
                    </Button>
                  </Stack>
                  <Button
                    component={Link}
                    to={`/recipe/${recipe.id}`}
                    fullWidth
                    size="small"
                    endIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                    sx={{
                      mt: 0.75,
                      color: 'text.secondary',
                      fontSize: '0.78rem',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    View full story
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}

function formatRecordedYear(year) {
  if (!Number.isFinite(year)) {
    return null
  }

  if (year < 0) {
    return `${Math.abs(year)} BCE`
  }

  return `${year} CE`
}

export default RecipeGrid
