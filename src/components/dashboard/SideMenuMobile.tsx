import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useRouter } from 'next/navigation';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import { useUserProfile } from '@/hooks/useUserProfile';
import Skeleton from '@mui/material/Skeleton';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const { profile, isLoading } = useUserProfile();
  const router = useRouter();
  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };
  return (
    <Drawer
      anchor="right"
      open={!!open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}>
            {isLoading ? (
              <Skeleton variant="circular" width={24} height={24} />
            ) : (
              <Avatar
                sizes="small"
                alt={profile ? `${profile.firstname} ${profile.lastname}` : 'User Avatar'}
                src="/logo/logo.svg"
                sx={{ width: 32, height: 32 }}
              />
            )}
            {isLoading ? (
              <Skeleton variant="text" width={80} height={20} />
            ) : profile ? (
              <Typography component="p" variant="h6">
                {`${profile.firstname} ${profile.lastname}`}
              </Typography>
            ) : null}
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <CardAlert />
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
