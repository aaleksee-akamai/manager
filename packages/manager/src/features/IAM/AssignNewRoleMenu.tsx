import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from 'src/components/Button/Button';

type RoleType = 'account' | 'resource';

interface LinkProps {
  description: string;
  entity: string;
  roleType: RoleType;
}

export const AssignNewRoleMenu = ({ username }: any) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (roleType: RoleType) => {
    history.push(`/iam/users/${username}/roles/assign`, {
      selectedRole: roleType,
    });
    handleClose();
  };

  const links: LinkProps[] = [
    {
      description: 'Apply across the entire account',
      entity: 'Account Roles',
      roleType: 'account',
    },
    {
      description: 'Apply on specific resources',
      entity: 'Resource Roles',
      roleType: 'resource',
    },
  ];

  return (
    <Box
      sx={{
        [theme.breakpoints.down('md')]: {
          flex: 1,
        },
      }}
    >
      <Button
        aria-controls={open ? 'basic-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        buttonType="primary"
        data-qa-add-new-menu-button
        endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        id="create-menu"
        onClick={handleClick}
      >
        Assign New Role
      </Button>
      <Menu
        MenuListProps={{
          'aria-labelledby': 'create-menu',
        }}
        slotProps={{
          paper: {
            // UX requested a drop shadow that didn't affect the button.
            // If we revise our theme's shadows, we could consider removing
            sx: { boxShadow: '0 2px 3px 3px rgba(0, 0, 0, 0.1)' },
          },
        }}
        sx={{
          '& hr': {
            marginBottom: '0 !important',
            marginTop: '0 !important',
          },
        }}
        anchorEl={anchorEl}
        id="basic-menu"
        onClose={handleClose}
        open={open}
      >
        {links.map((link, i) => (
          <MenuItem
            key={link.entity}
            onClick={() => handleMenuItemClick(link.roleType)}
            style={{
              // We have to do this because in packages/manager/src/index.css we force underline links
              textDecoration: 'none',
            }}
          >
            <Stack>
              <Typography variant="h3">{link.entity}</Typography>
              <Typography>{link.description}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
