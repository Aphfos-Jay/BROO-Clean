// assets
import { CalendarOutlined, CheckSquareOutlined, EyeOutlined } from '@ant-design/icons';

// icons
const icons = {
  CalendarOutlined,
  CheckSquareOutlined,
  EyeOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const personal = {
  id: 'personal',
  title: '개인업무',
  type: 'group',
  children: [
    {
      id: 'Tsk',
      title: '작업',
      type: 'item',
      url: '/shadow',
      icon: icons.CheckSquareOutlined
    },
    {
      id: 'calendar',
      title: '일정관리',
      type: 'item',
      url: '/typography',
      icon: icons.CalendarOutlined
    },
    {
      id: 'SR',
      title: 'SR 확인',
      type: 'item',
      url: '/color',
      icon: icons.EyeOutlined
    }
  ]
};

export default personal;
