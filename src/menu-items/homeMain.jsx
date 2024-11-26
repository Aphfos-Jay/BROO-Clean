// assets
import { HomeOutlined } from '@ant-design/icons';

// icons
const icons = {
  HomeOutlined
};

const home = {
  id: 'group-dashboard',
  title: '홈',
  type: 'group',
  children: [
    {
      id: 'Home',
      title: '홈',
      type: 'item',
      url: '/home',
      icon: icons.HomeOutlined,
      breadcrumbs: false
    }
  ]
};

export default home;
