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

const sectionCardSx = {
  p: 2.1,
  borderRadius: 4,
  border: '1px solid rgba(94, 70, 50, 0.12)',
  bgcolor: 'rgba(255, 248, 239, 0.98)',
  color: 'text.primary',
}

function RecipeDetailsDrawer({
  selectedRecipe,
  detailTab,
  onDetailTabChange,
  onClose,
  estimateMinutes,
  getRecipeSubstitutions,
  getIngredientLine,
  getCuratedKitItems,
  getMockPrice,
  getSuggestedKitItems,
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
    <Drawer
      anchor="right"
      open={Boolean(selectedRecipe)}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 520 },
        },
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        {selectedRecipe && (
          <Stack spacing={2}>
            {(() => {
              const totalMinutes = estimateMinutes(selectedRecipe)
              const curatedKitItems = getCuratedKitItems(selectedRecipe)
              const substitutions = getRecipeSubstitutions(selectedRecipe)
              const suggestedKitItems = getSuggestedKitItems(selectedRecipe)

              return (
                <>
                  <Box
                    sx={{
                      p: 2.25,
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 248, 239, 0.07)',
                      border: '1px solid rgba(255, 236, 220, 0.1)',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                      <Box>
                        <Typography variant="overline" sx={{ color: 'rgba(255, 236, 220, 0.74)' }}>
                          Recipe Dossier
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 0.5, color: '#fff8ef', lineHeight: 1.05 }}>
                          {selectedRecipe.name}
                        </Typography>
                        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1.25 }}>
                          {selectedRecipe.culture && (
                            <Chip label={selectedRecipe.culture} size="small" sx={{ bgcolor: 'rgba(255, 248, 239, 0.1)', color: '#fff2e4' }} />
                          )}
                          {selectedRecipe.region && (
                            <Chip label={selectedRecipe.region} size="small" sx={{ bgcolor: 'rgba(255, 248, 239, 0.1)', color: '#fff2e4' }} />
                          )}
                          {selectedRecipe.era && (
                            <Chip label={selectedRecipe.era} size="small" sx={{ bgcolor: 'rgba(255, 248, 239, 0.1)', color: '#fff2e4' }} />
                          )}
                        </Stack>
                      </Box>

                      <IconButton aria-label="Close recipe dossier" onClick={onClose} sx={{ color: '#fff4ea' }}>
                        <CloseIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Tabs
                    value={detailTab}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    onChange={(_, value) => onDetailTabChange(value)}
                    sx={{
                      minHeight: 0,
                      p: 0.5,
                      bgcolor: 'rgba(255, 248, 239, 0.06)',
                      borderRadius: 4,
                      '& .MuiTab-root': {
                        color: 'rgba(255, 239, 227, 0.72)',
                        minWidth: 92,
                      },
                      '& .MuiTab-root.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: '#fff8ef',
                      },
                      '& .MuiTab-root.Mui-selected .MuiTab-wrapper': {
                        color: '#fff8ef',
                      },
                      '& .MuiTabs-indicator': {
                        display: 'none',
                      },
                    }}
                  >
                    <Tab label="Recipe" value="recipe" />
                    <Tab label="History" value="history" />
                    <Tab label="Kit" value="kit" />
                    <Tab label="Variations" value="variations" />
                  </Tabs>

                  {detailTab === 'recipe' && (
                    <Stack spacing={1.5}>
                      <Box sx={sectionCardSx}>
                        <Stack spacing={1.5}>
                          {selectedRecipe.summary && (
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                              {selectedRecipe.summary}
                            </Typography>
                          )}
                          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                            {totalMinutes && <Chip size="small" label={`${totalMinutes} min total`} />}
                            <Chip size="small" label={`${(selectedRecipe.ingredients || []).length} ingredients`} />
                            <Chip size="small" label={`${(selectedRecipe.steps || []).length} steps`} />
                          </Stack>
                        </Stack>
                      </Box>

                      <Box sx={sectionCardSx}>
                        <Typography variant="subtitle2">Ingredients</Typography>
                        <List dense disablePadding sx={{ mt: 0.75 }}>
                          {(selectedRecipe.ingredients || []).map((item, index) => (
                            <ListItem key={`${selectedRecipe.id}-drawer-ingredient-${index}`} disableGutters>
                              <ListItemText primary={getIngredientLine(item)} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      <Box sx={sectionCardSx}>
                        <Typography variant="subtitle2">Steps</Typography>
                        <List dense disablePadding sx={{ mt: 0.75 }}>
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
                      </Box>

                      {substitutions.length > 0 && (
                        <Box sx={sectionCardSx}>
                          <Typography variant="subtitle2">Substitution ideas</Typography>
                          <List dense disablePadding sx={{ mt: 0.75 }}>
                            {substitutions.map((substitution) => (
                              <ListItem key={substitution} disableGutters>
                                <ListItemText primary={substitution} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Stack>
                  )}

                  {detailTab === 'history' && (
                    <Box sx={sectionCardSx}>
                      <Stack spacing={1.25}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                          {selectedRecipe.history?.context || 'No history available for this recipe.'}
                        </Typography>

                        {selectedRecipe.history?.sources?.length > 0 && (
                          <>
                            <Divider />
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
                    </Box>
                  )}

                  {detailTab === 'kit' && (
                    <Box sx={sectionCardSx}>
                      <Stack spacing={1.25}>
                        {curatedKitItems.length > 0 ? (
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Add the archive&apos;s curated ingredient kit to the cart.
                            </Typography>
                            <List dense disablePadding>
                              {curatedKitItems.map((item) => (
                                <ListItem key={item} disableGutters sx={{ gap: 1.25, alignItems: 'center' }}>
                                  <ListItemText primary={item} secondary={`$${getMockPrice(item).toFixed(2)}`} />
                                  <Button size="small" variant="outlined" onClick={() => onAddCartItem(selectedRecipe, item)}>
                                    Add
                                  </Button>
                                </ListItem>
                              ))}
                            </List>
                            <Button
                              variant="contained"
                              startIcon={<LocalMallOutlinedIcon />}
                              onClick={() => onAddKitToCart(selectedRecipe, curatedKitItems)}
                            >
                              Add curated kit
                            </Button>
                          </>
                        ) : suggestedKitItems.length > 0 ? (
                          <>
                            <Alert severity="info">
                              No curated commerce kit is linked for this recipe yet. These pantry picks are suggested from the ingredient list.
                            </Alert>
                            <Typography variant="subtitle2">Suggested pantry picks</Typography>
                            <List dense disablePadding>
                              {suggestedKitItems.map((item) => (
                                <ListItem key={item} disableGutters sx={{ gap: 1.25, alignItems: 'center' }}>
                                  <ListItemText primary={item} secondary={`$${getMockPrice(item).toFixed(2)}`} />
                                  <Button size="small" variant="outlined" onClick={() => onAddCartItem(selectedRecipe, item)}>
                                    Add
                                  </Button>
                                </ListItem>
                              ))}
                            </List>
                            <Button
                              variant="outlined"
                              startIcon={<LocalMallOutlinedIcon />}
                              onClick={() => onAddKitToCart(selectedRecipe, suggestedKitItems)}
                            >
                              Add suggested bundle
                            </Button>
                          </>
                        ) : (
                          <Alert severity="info">No kit items or ingredient suggestions are available for this recipe yet.</Alert>
                        )}
                      </Stack>
                    </Box>
                  )}

                  {detailTab === 'variations' && (
                    <Box sx={sectionCardSx}>
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
                    </Box>
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
