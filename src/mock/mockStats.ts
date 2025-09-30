import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { ComponentType } from 'react';

export interface Stat {
  label: string;
  value: string | number;
  icon: ComponentType<{ fontSize?: "small" | "inherit" | "large" | "medium" }>;
  color: string;
}

const mockStats: Stat[] = [
  {
    label: 'Users',
    value: 1240,
    icon: PeopleIcon,
    color: '#4FC3F7',
  },
  {
    label: 'Sales',
    value: 312,
    icon: ShoppingCartIcon,
    color: '#1976d2',
  },
  {
    label: 'Revenue',
    value: '$9,200',
    icon: AttachMoneyIcon,
    color: '#00bfae',
  },
  {
    label: 'Growth',
    value: '12.5%',
    icon: TrendingUpIcon,
    color: '#ffb300',
  },
];

export default mockStats;

