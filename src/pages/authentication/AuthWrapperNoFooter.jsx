import './AuthWrapper.css';
import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import AuthCard from './AuthCard';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapperNoFooter({ children }) {
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
    </Box>
  );
}

AuthWrapperNoFooter.propTypes = { children: PropTypes.node };
