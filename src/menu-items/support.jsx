// assets
import { MonitorOutlined, CompassOutlined, HourglassOutlined, DashboardOutlined, EnvironmentOutlined } from '@ant-design/icons';

// icons
const icons = {
  MonitorOutlined,
  CompassOutlined,
  HourglassOutlined,
  DashboardOutlined,
  EnvironmentOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: '모니터링',
  type: 'group',
  children: [
    {
      id: 'monitoring',
      title: '해양오염 모니터링',
      type: 'item',
      url: '/monitoring',
      icon: icons.MonitorOutlined
    },
    {
      id: 'marineWaste',
      title: '해양오염분포',
      type: 'item',
      url: '/marineWaste',
      icon: icons.EnvironmentOutlined
    },
    {
      id: 'tracking',
      title: '쓰레기 탐지 CCTV',
      type: 'item',
      url: '/tracking',
      icon: icons.CompassOutlined
    },
    {
      id: 'stastics',
      title: '해양사고 통계',
      type: 'item',
      url: '/accident',
      icon: icons.HourglassOutlined
    },
    {
      id: 'dashboard',
      title: '대시보드',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default support;
