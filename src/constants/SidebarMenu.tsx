import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import InventoryIcon from '@mui/icons-material/Inventory';

export const sidebarMenu = [

    {
        title: 'Dashboard',
        icon: <DashboardIcon />,
        link: '/dashboard'
    },
    {
        title: 'Users',
        icon: <PeopleIcon />,
        link: '/users'
    },
    {
        title: 'Employees',
        icon: <WorkIcon />,
        link: '/employees'
    },
    {
        title: 'Products',
        icon: <InventoryIcon />,
        link: '/products'
    }
]