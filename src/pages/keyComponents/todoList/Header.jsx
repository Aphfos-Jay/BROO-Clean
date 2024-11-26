import './Header.css';
import Typography from '@mui/material/Typography';
const Header = () => {
  return (
    <div className="Header">
      <Typography variant="h3">오늘은 </Typography>
      <Typography variant="h1">{new Date().toLocaleDateString()} </Typography>
    </div>
  );
};

export default Header;
