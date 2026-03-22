import { Alert, Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

function CartDrawer({ open, onClose, cartItems, onUpdateCartQuantity, onRemoveCartItem, cartItemCount, cartSubtotal }) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 420 },
        },
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          <Box
            sx={{
              p: 2.25,
              borderRadius: 6,
              bgcolor: 'rgba(255, 248, 239, 0.07)',
              border: '1px solid rgba(255, 236, 220, 0.1)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="overline" sx={{ color: 'rgba(255, 236, 220, 0.74)' }}>
                  Cart Ledger
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5, color: '#fff8ef' }}>
                  Selected kit items
                </Typography>
              </Box>
              <IconButton onClick={onClose} sx={{ color: '#fff4ea' }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          {cartItems.length === 0 && <Alert severity="info">Your cart is empty. Add kit items from any recipe.</Alert>}

          {cartItems.length > 0 && (
            <>
              <Stack spacing={1.1}>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 1.6,
                      borderRadius: 5,
                      border: '1px solid rgba(94, 70, 50, 0.12)',
                      bgcolor: 'rgba(255, 248, 239, 0.98)',
                      color: 'text.primary',
                    }}
                  >
                    <Stack spacing={1.1}>
                      <Box>
                        <Typography variant="subtitle2">{item.itemName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.recipeName} · $${item.unitPrice.toFixed(2)} each
                        </Typography>
                      </Box>

                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Stack direction="row" spacing={0.4} alignItems="center">
                          <IconButton size="small" onClick={() => onUpdateCartQuantity(item.id, -1)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton size="small" onClick={() => onUpdateCartQuantity(item.id, 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Button size="small" color="inherit" onClick={() => onRemoveCartItem(item.id)}>
                          Remove
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ borderColor: 'rgba(255, 236, 220, 0.12)' }} />

              <Box
                sx={{
                  p: 2.1,
                  borderRadius: 5,
                  bgcolor: 'rgba(255, 248, 239, 0.98)',
                  color: 'text.primary',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1">Subtotal ({cartItemCount} items)</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mock checkout for preview flow
                    </Typography>
                  </Box>
                  <Typography variant="h5">${cartSubtotal.toFixed(2)}</Typography>
                </Stack>
              </Box>

              <Button variant="contained" size="large" startIcon={<ShoppingCartOutlinedIcon />}>
                Checkout (Mock)
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Drawer>
  )
}

export default CartDrawer
