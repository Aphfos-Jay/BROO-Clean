import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes/router';
import ThemeCustomization from 'themes/ThemeCustomization';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
