import { Box, Button, Card, CardContent, Chip, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'

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

        return (
          <Card
            key={recipe.id}
            sx={{
              height: '100%',
              minHeight: 420,
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(251, 244, 232, 0.98) 0%, rgba(244, 235, 222, 0.98) 100%)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: '0 0 auto 0',
                height: 7,
                background: 'linear-gradient(90deg, #9b5631 0%, #d59a69 55%, #3f6b62 100%)',
              },
            }}
          >
            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack spacing={1.75} sx={{ p: 2.25, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.25}>
                  <Box>
                    <Typography variant="overline" sx={{ color: 'secondary.main' }}>
                      {recipe.culture || 'Archive'}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 0.35, lineHeight: 1.08 }}>
                      {recipe.name}
                    </Typography>
                  </Box>

                  <Stack spacing={0.75} alignItems="flex-end">
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
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {recipe.summary}
                  </Typography>
                )}

                <Box
                  sx={{
                    p: 1.6,
                    borderRadius: 5,
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
                    <Button fullWidth variant="contained" size="small" onClick={() => onOpenRecipeDetails(recipe, 'recipe')}>
                      Open dossier
                    </Button>
                    <Button fullWidth variant="outlined" size="small" onClick={() => onOpenRecipeDetails(recipe, 'kit')}>
                      Build kit
                    </Button>
                  </Stack>
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
