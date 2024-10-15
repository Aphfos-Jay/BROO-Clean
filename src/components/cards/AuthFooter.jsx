// material-ui
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <Container maxWidth="xl">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        spacing={2}
        textAlign={{ xs: 'center', sm: 'inherit' }}
      >
        <Typography variant="subtitle2" color="secondary">
          2024 Team NYC created this site using the Mantis Free-React Admin Template provided by{' '}
          <Typography
            component={Link}
            variant="subtitle2"
            href="https://mui.com/store/items/mantis-free-react-admin-dashboard-template/"
            target="_blank"
            underline="hover"
          >
            MUI
          </Typography>
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} textAlign={{ xs: 'center', sm: 'inherit' }}>
          <Typography variant="subtitle2" component={Link} href="/privacy" target="_blank" underline="hover">
            개인정보 보호정책
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
