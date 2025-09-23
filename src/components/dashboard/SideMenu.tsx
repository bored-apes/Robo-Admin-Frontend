import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import { useUserProfile } from '@/hooks/useUserProfile';
import Skeleton from '@mui/material/Skeleton';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const { profile, isLoading } = useUserProfile();
  // SSR hydration fix: only show loaded content after client mount
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
        <CardAlert />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Hydration fix: always render Skeleton until client mount */}
        {!hasMounted || isLoading ? (
          <Skeleton variant="circular" width={36} height={36} />
        ) : (
          <Avatar
            sizes="small"
            alt={profile ? `${profile.firstname} ${profile.lastname}` : 'User Avatar'}
            src="/logo/logo.svg"
            sx={{ width: 36, height: 36 }}
          />
        )}
        <Box sx={{ mr: 'auto' }}>
          {/* Only render profile info after mount and loading is false, else always Skeletons */}
          {!hasMounted || isLoading ? (
            <>
              <Skeleton variant="text" width={100} height={16} />
              <Skeleton variant="text" width={120} height={12} />
            </>
          ) : profile ? (
            <>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                {`${profile.firstname} ${profile.lastname}`}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {profile.email && profile.email.length > 20
                  ? `${profile.email.slice(0, 17)}...`
                  : profile.email}
              </Typography>
            </>
          ) : null}
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
