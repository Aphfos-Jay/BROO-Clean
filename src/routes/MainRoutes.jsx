import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard/DashboardLayout';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/DashboardDefault')));

// render - sample page
const Tracking = Loadable(lazy(() => import('pages/keyComponents/Tracking')));
const Monitoring = Loadable(lazy(() => import('pages/keyComponents/Monitoring')));
const Accident = Loadable(lazy(() => import('pages/keyComponents/Accident')));
const TodoList = Loadable(lazy(() => import('pages/keyComponents/TodoList')));
const Event = Loadable(lazy(() => import('pages/keyComponents/Event')));
const Sr = Loadable(lazy(() => import('pages/keyComponents/Sr')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
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
      element: <Sr />
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
