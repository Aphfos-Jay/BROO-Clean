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
      id: 'task',
      title: '작업',
      type: 'item',
      url: '/todo',
      icon: icons.CheckSquareOutlined
    },
    {
      id: 'calendar',
      title: '일정관리',
      type: 'item',
      url: '/event',
      icon: icons.CalendarOutlined
    },
    {
      id: 'servicerequest',
      title: '쓰레기 신고 목록',
      type: 'item',
      url: '/sr',
      icon: icons.EyeOutlined
    }
  ]
};

export default personal;
