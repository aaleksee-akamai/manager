import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';

import { DateTimeDisplay } from 'src/components/DateTimeDisplay';
// import { Paper } from 'src/components/Paper';
// import { Stack } from 'src/components/Stack';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { TextTooltip } from 'src/components/TextTooltip';
// import { Typography } from 'src/components/Typography';
import { Link } from 'src/components/Link';

import type { User, IamUserPermissions } from '@linode/api-v4';
import { Typography, Stack, Paper } from '@linode/ui';

interface Props {
  user: User;
  assignedRoles: IamUserPermissions | {};
}

export const UserDetailsPanel = ({ user, assignedRoles }: Props) => {
  const assignRolesCount = getAssignRoles(assignedRoles);

  const items = [
    {
      label: 'Username',
      value: <Typography>{user.username}</Typography>,
    },
    {
      label: 'Email',
      value: <Typography>{user.email}</Typography>,
    },
    {
      label: 'Access',
      value: assignRolesCount ? (
        <Typography>
          <Link to={`/iam/users/${user.username}/roles`}>
            {`${assignRolesCount} role${
              assignRolesCount !== 1 ? 's' : ''
            } assigned`}
          </Link>
        </Typography>
      ) : (
        <span>no roles assigned</span>
      ),
    },
    {
      label: 'Last Login Status',
      value: (
        <Stack direction="row" spacing={1}>
          <Typography textTransform="capitalize">
            {user.last_login?.status ?? 'N/A'}
          </Typography>
          {user.last_login && (
            <StatusIcon
              status={
                user.last_login?.status === 'successful' ? 'active' : 'error'
              }
            />
          )}
        </Stack>
      ),
    },
    {
      label: 'Last Login',
      value: user.last_login ? (
        <DateTimeDisplay value={user.last_login.login_datetime} />
      ) : (
        <Typography>N/A</Typography>
      ),
    },
    {
      label: 'Password Created',
      value: user.password_created ? (
        <DateTimeDisplay value={user.password_created} />
      ) : (
        <Typography>N/A</Typography>
      ),
    },
    {
      label: '2FA',
      value: (
        <Typography>{user.tfa_enabled ? 'Enabled' : 'Disabled'}</Typography>
      ),
    },
    {
      label: 'Verified Phone Number',
      value: <Typography>{user.verified_phone_number ?? 'None'}</Typography>,
    },
    {
      label: 'SSH Keys',
      value:
        user.ssh_keys.length > 0 ? (
          <TextTooltip
            displayText={String(user.ssh_keys.length)}
            minWidth={1}
            tooltipText={user.ssh_keys.join(', ')}
          />
        ) : (
          <Typography>0</Typography>
        ),
    },
  ];

  return (
    <Paper>
      <Grid columns={{ md: 6, sm: 4, xs: 2 }} container spacing={2}>
        {items.map((item, index) => (
          <Grid key={index} md={2} sm={2} xs={2}>
            <Stack direction="row" spacing={1}>
              <Typography fontFamily={(theme) => theme.font.bold}>
                {item.label}
              </Typography>
              {item.value}
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const getAssignRoles = (assign_roles: any): number => {
  const accountAccessRoles = assign_roles.account_access || [];

  const resourceAccessRoles = assign_roles.resource_access
    ? assign_roles.resource_access.map((resource: any) => resource.roles).flat()
    : [];

  const combinedRoles = Array.from(
    new Set(accountAccessRoles.concat(resourceAccessRoles))
  );

  return combinedRoles.length;
};
