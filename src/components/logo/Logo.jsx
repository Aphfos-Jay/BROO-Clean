// material-ui
import { useTheme } from '@mui/material/styles';
import './Logo.css';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */

    <div className="divLogo">
      <img src={'/public/Brooclean_logo_word.PNG'} width="210" />
    </div>
  );
};

export default Logo;
