import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

function HeroSection({ allCulturesCount, recipesCount, cartItemCount, onOpenCart }) {
  return (
    <Box sx={{ borderBottom: '1px solid rgba(35, 24, 14, 0.12)' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Stack spacing={2}>
          <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 2 }}>
            FORGOTTEN FLAVORS
          </Typography>
          <Typography variant="h2" sx={{ maxWidth: 940 }}>
            Lost Tables, Reimagined for Modern Kitchens
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 760 }}>
            Browse inspired Roman and Greek reconstructions with compact discovery tools and clear paths to cook or build ingredient
            kits.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} justifyContent="space-between" alignItems={{ sm: 'center' }}>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip icon={<PublicOutlinedIcon />} label={`${allCulturesCount} cultures`} color="secondary" />
              <Chip icon={<MenuBookOutlinedIcon />} label={`${recipesCount} recipes`} color="secondary" />
              <Chip icon={<LocalMallOutlinedIcon />} label="Kit-ready concepts" color="secondary" />
            </Stack>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ShoppingCartOutlinedIcon />}
              onClick={onOpenCart}
              sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
            >
              Cart ({cartItemCount})
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default HeroSection
