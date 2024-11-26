// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Home() {
  return (
    <MainCard title="Home">
      <Typography variant="body2">Home화면</Typography>
    </MainCard>
  );
}
