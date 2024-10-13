// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: -1,
        bottom: 150,
        transform: 'inherit'
      }}
    >
      <img src={'/public/Brooclean.PNG'} width="700" />
    </Box>
  );
}
