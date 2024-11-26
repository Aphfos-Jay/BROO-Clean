// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import './AuthBackground.css';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: -1,
        bottom: 50,
        transform: 'inherit'
      }}
    >
      <div className="bgMainDiv">
        <div className="nycLogo">
          <img src={'/NYC.PNG'} width="400" />
        </div>
        <div className="broocleanLogo">
          <img src={'/Brooclean.PNG'} width="700" />
        </div>
      </div>
    </Box>
  );
}
