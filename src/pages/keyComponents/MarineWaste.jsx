// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Home() {
  return (
    <MainCard>
      <iframe
        src="http://localhost:8501/" // Streamlit 서버 URL
        style={{
          width: '100%',
          height: '1000px',
          border: 'none',
          marginTop: '20px'
        }}
        title="Marine Pollution Map"
      ></iframe>
    </MainCard>
  );
}
