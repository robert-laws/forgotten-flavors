import { Alert, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

function CartDrawer({ open, onClose, cartItems, onUpdateCartQuantity, onRemoveCartItem, cartItemCount, cartSubtotal }) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 400 }, p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Cart</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {cartItems.length === 0 && <Alert severity="info">Your cart is empty. Add kit items from any recipe.</Alert>}

          {cartItems.length > 0 && (
            <>
              <List dense disablePadding>
                {cartItems.map((item) => (
                  <ListItem key={item.id} disableGutters sx={{ alignItems: 'flex-start', py: 1 }}>
                    <ListItemText
                      primary={item.itemName}
                      secondary={`${item.recipeName} · $${item.unitPrice.toFixed(2)} each`}
                      sx={{ mr: 1 }}
                    />
                    <Stack direction="row" spacing={0.25} alignItems="center">
                      <IconButton size="small" onClick={() => onUpdateCartQuantity(item.id, -1)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton size="small" onClick={() => onUpdateCartQuantity(item.id, 1)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Button size="small" color="inherit" onClick={() => onRemoveCartItem(item.id)}>
                      Remove
                    </Button>
                  </ListItem>
                ))}
              </List>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">Subtotal ({cartItemCount} items)</Typography>
                <Typography variant="h6">${cartSubtotal.toFixed(2)}</Typography>
              </Stack>

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
