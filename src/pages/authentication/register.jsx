import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthRegister from './auth-forms/AuthRegister';

// ================================|| REGISTER ||================================ //

export default function Register() {
  return (
    <AuthWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">회원가입</Typography>
            <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              이미 계정을 가지고 있습니까?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthRegister />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
