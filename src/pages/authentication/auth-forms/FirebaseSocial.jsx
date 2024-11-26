import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// assets
import Google from 'assets/images/icons/google.svg';
import Github from 'assets/images/icons/github.svg';
import Linkedin from 'assets/images/icons/LinkedIn.svg';

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

export default function FirebaseSocial() {
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // @ts-ignore
  const googleHandler = async () => {
    // login || singup
  };

  const githubHandler = async () => {
    // login || singup
  };

  const linkedinHandler = async () => {
    // login || singup
  };

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 2 }}
      justifyContent={{ xs: 'space-around', sm: 'space-between' }}
      sx={{ '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 }, ml: { xs: 0, sm: -0.5 } } }}
    >
      <Button variant="outlined" color="secondary" fullWidth={!downSM} startIcon={<img src={Google} />} onClick={googleHandler}>
        {!downSM && 'Google'}
      </Button>
      <Button variant="outlined" color="secondary" fullWidth={!downSM} startIcon={<img src={Github} />} onClick={githubHandler}>
        {!downSM && 'Github'}
      </Button>
      <Button variant="outlined" color="secondary" fullWidth={!downSM} startIcon={<img src={Linkedin} />} onClick={linkedinHandler}>
        {!downSM && 'LinkedIn'}
      </Button>
    </Stack>
  );
}
