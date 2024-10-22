import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard/DashboardLayout';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const Dashboard = Loadable(lazy(() => import('pages/dashboard/Dashboard')));

const Tracking = Loadable(lazy(() => import('pages/keyComponents/Tracking')));
const Monitoring = Loadable(lazy(() => import('pages/keyComponents/Monitoring')));
const Accident = Loadable(lazy(() => import('pages/keyComponents/Accident')));
const TodoList = Loadable(lazy(() => import('pages/keyComponents/TodoList')));
const Event = Loadable(lazy(() => import('pages/keyComponents/Event')));
const ServiceRequest = Loadable(lazy(() => import('pages/keyComponents/ServiceRequest')));
const Home = Loadable(lazy(() => import('pages/keyComponents/Home')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: 'home',
      element: <Home />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    },
    {
      path: 'monitoring',
      element: <Monitoring />
    },
    {
      path: 'tracking',
      element: <Tracking />
    },
    {
      path: 'accident',
      element: <Accident />
    },
    {
      path: 'todo',
      element: <TodoList />
    },
    {
      path: 'event',
      element: <Event />
    },
    {
      path: 'sr',
      element: <ServiceRequest />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;
