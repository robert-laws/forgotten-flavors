import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'

function RecipeDetailsDrawer({
  selectedRecipe,
  detailTab,
  onDetailTabChange,
  onClose,
  estimateMinutes,
  getRecipeSubstitutions,
  getIngredientLine,
  getKitItems,
  getMockPrice,
  onAddCartItem,
  onAddKitToCart,
  variationName,
  onVariationNameChange,
  variationNotes,
  onVariationNotesChange,
  onSaveVariation,
  savedVariations,
}) {
  return (
    <Drawer anchor="right" open={Boolean(selectedRecipe)} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 470 }, p: 2.5 }}>
        {selectedRecipe && (
          <Stack spacing={2}>
            {(() => {
              const totalMinutes = estimateMinutes(selectedRecipe)
              const substitutions = getRecipeSubstitutions(selectedRecipe)

              return (
                <>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h5" sx={{ lineHeight: 1.15, mb: 0.5 }}>
                        {selectedRecipe.name}
                      </Typography>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        {selectedRecipe.culture && <Chip label={selectedRecipe.culture} size="small" color="secondary" variant="outlined" />}
                        {selectedRecipe.region && <Chip label={selectedRecipe.region} size="small" variant="outlined" />}
                        {selectedRecipe.era && <Chip label={selectedRecipe.era} size="small" variant="outlined" />}
                      </Stack>
                    </Box>
                    <IconButton onClick={onClose}>
                      <CloseIcon />
                    </IconButton>
                  </Stack>

                  <Tabs value={detailTab} onChange={(_, value) => onDetailTabChange(value)}>
                    <Tab label="Recipe" value="recipe" />
                    <Tab label="History" value="history" />
                    <Tab label="Kit" value="kit" />
                    <Tab label="Variations" value="variations" />
                  </Tabs>

                  {detailTab === 'recipe' && (
                    <Stack spacing={1.5}>
                      {selectedRecipe.summary && (
                        <Typography variant="body2" color="text.secondary">
                          {selectedRecipe.summary}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        {totalMinutes && <Chip size="small" label={`${totalMinutes} min total`} />}
                        <Chip size="small" label={`${(selectedRecipe.ingredients || []).length} ingredients`} />
                        <Chip size="small" label={`${(selectedRecipe.steps || []).length} steps`} />
                      </Stack>
                      <Divider />
                      <Typography variant="subtitle2">Ingredients</Typography>
                      <List dense disablePadding>
                        {(selectedRecipe.ingredients || []).map((item, index) => (
                          <ListItem key={`${selectedRecipe.id}-drawer-ingredient-${index}`} disableGutters>
                            <ListItemText primary={getIngredientLine(item)} />
                          </ListItem>
                        ))}
                      </List>
                      <Typography variant="subtitle2">Steps</Typography>
                      <List dense disablePadding>
                        {(selectedRecipe.steps || []).map((step) => (
                          <ListItem key={`${selectedRecipe.id}-drawer-step-${step.order}`} disableGutters>
                            <ListItemText
                              primary={`${step.order}. ${step.instruction}`}
                              secondary={
                                step.durationMinutes
                                  ? `${step.durationMinutes} min${step.tutorialTips?.length ? ` · Tip: ${step.tutorialTips[0]}` : ''}`
                                  : step.tutorialTips?.length
                                    ? `Tip: ${step.tutorialTips[0]}`
                                    : ''
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                      {substitutions.length > 0 && (
                        <>
                          <Typography variant="subtitle2">Substitution ideas</Typography>
                          <List dense disablePadding>
                            {substitutions.map((substitution) => (
                              <ListItem key={substitution} disableGutters>
                                <ListItemText primary={substitution} />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                    </Stack>
                  )}

                  {detailTab === 'history' && (
                    <Stack spacing={1.25}>
                      <Typography variant="body2" color="text.secondary">
                        {selectedRecipe.history?.context || 'No history available for this recipe.'}
                      </Typography>
                      {selectedRecipe.history?.sources?.length > 0 && (
                        <>
                          <Typography variant="subtitle2">Sources</Typography>
                          <List dense disablePadding>
                            {selectedRecipe.history.sources.map((source) => (
                              <ListItem key={source} disableGutters>
                                <ListItemText primary={source} />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                    </Stack>
                  )}

                  {detailTab === 'kit' && (
                    <Stack spacing={1.25}>
                      <Typography variant="body2" color="text.secondary">
                        Add a ready-to-cook ingredient kit to the cart.
                      </Typography>
                      {getKitItems(selectedRecipe).length > 0 ? (
                        <List dense disablePadding>
                          {getKitItems(selectedRecipe).map((item) => (
                            <ListItem key={item} disableGutters>
                              <ListItemText primary={item} secondary={`$${getMockPrice(item).toFixed(2)}`} />
                              <Button size="small" variant="outlined" onClick={() => onAddCartItem(selectedRecipe, item)}>
                                Add
                              </Button>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Alert severity="info">No predefined kit items yet for this recipe.</Alert>
                      )}
                      <Button variant="contained" startIcon={<LocalMallOutlinedIcon />} onClick={() => onAddKitToCart(selectedRecipe)}>
                        Add Entire Kit
                      </Button>
                    </Stack>
                  )}

                  {detailTab === 'variations' && (
                    <Stack spacing={1.5}>
                      <Typography variant="body2" color="text.secondary">
                        Save your personal twist for this recipe. Variations persist for this browser session.
                      </Typography>
                      <TextField
                        label="Variation name"
                        size="small"
                        value={variationName}
                        onChange={(event) => onVariationNameChange(event.target.value)}
                      />
                      <TextField
                        label="What changed?"
                        size="small"
                        multiline
                        minRows={3}
                        value={variationNotes}
                        onChange={(event) => onVariationNotesChange(event.target.value)}
                      />
                      <Button variant="contained" onClick={onSaveVariation}>
                        Save variation
                      </Button>
                      {savedVariations.length === 0 ? (
                        <Alert severity="info">No variations saved for this recipe yet.</Alert>
                      ) : (
                        <List dense disablePadding>
                          {savedVariations.map((variation) => (
                            <ListItem key={variation.id} disableGutters>
                              <ListItemText primary={variation.name} secondary={variation.notes} />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Stack>
                  )}
                </>
              )
            })()}
          </Stack>
        )}
      </Box>
    </Drawer>
  )
}

export default RecipeDetailsDrawer
