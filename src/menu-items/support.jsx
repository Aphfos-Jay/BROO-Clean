// assets
import { MonitorOutlined, CompassOutlined, HourglassOutlined } from '@ant-design/icons';

// icons
const icons = {
  MonitorOutlined,
  CompassOutlined,
  HourglassOutlined
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
      url: '/sample-page',
      icon: icons.MonitorOutlined
    },
    {
      id: 'tracking',
      title: '연안쓰레기 추적탐지',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.CompassOutlined,
      external: true,
      target: true
    },
    {
      id: 'stastics',
      title: '해양사고 통계',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.HourglassOutlined,
      external: true,
      target: true
    }
  ]
};

export default support;
