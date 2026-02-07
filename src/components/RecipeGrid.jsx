import { Box, Button, Card, CardContent, Chip, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'

function RecipeGrid({ recipes, estimateMinutes, getIngredientLine, onOpenRecipeDetails }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
      }}
    >
      {recipes.map((recipe) => {
        const minutes = estimateMinutes(recipe)

        return (
          <Card key={recipe.id} sx={{ height: '100%', minHeight: 340 }}>
            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack spacing={1.25} sx={{ height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                    {recipe.name}
                  </Typography>
                  {minutes && <Chip size="small" label={`${minutes} min`} />}
                </Stack>

                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                  {recipe.culture && <Chip label={recipe.culture} variant="outlined" color="secondary" size="small" />}
                  {recipe.region && <Chip label={recipe.region} variant="outlined" size="small" />}
                  {recipe.era && <Chip label={recipe.era} variant="outlined" size="small" />}
                </Stack>

                {recipe.summary && (
                  <Typography variant="body2" color="text.secondary">
                    {recipe.summary}
                  </Typography>
                )}

                <Box sx={{ flexGrow: 1 }}>
                  <Divider />
                  <Box sx={{ pt: 0.75 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Key ingredients
                    </Typography>
                    <List dense disablePadding sx={{ mt: 0.25 }}>
                      {(recipe.ingredients || []).slice(0, 2).map((item, index) => (
                        <ListItem key={`${recipe.id}-ingredient-${index}`} disableGutters sx={{ py: 0 }}>
                          <ListItemText
                            primary={getIngredientLine(item)}
                            primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} sx={{ pt: 0.5, mt: 'auto' }}>
                  <Button fullWidth variant="contained" size="small" onClick={() => onOpenRecipeDetails(recipe, 'recipe')}>
                    View
                  </Button>
                  <Button fullWidth variant="outlined" size="small" onClick={() => onOpenRecipeDetails(recipe, 'kit')}>
                    Kit
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}

export default RecipeGrid
