import './AuthWrapper.css';
import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// project import
import AuthFooter from 'components/cards/AuthFooter';
import AuthCard from './AuthCard';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <div className="authWrapper">
        <div className="login">
          <Grid item xs={12}>
            <Grid
              item
              xs={12}
              container
              justifyContent="center"
              alignItems="center"
              sx={{ minHeight: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
            >
              <Grid item>
                <AuthCard>{children}</AuthCard>
              </Grid>
            </Grid>
          </Grid>
        </div>

        <div>
          <AuthBackground />
        </div>
      </div>
      <div className="authFooter">
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </div>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
