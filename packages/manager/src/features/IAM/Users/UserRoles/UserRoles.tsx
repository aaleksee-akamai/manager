import { Button, Paper, Typography } from '@linode/ui';
import Grid from '@mui/material/Grid';
import React from 'react';
import { useParams } from 'react-router-dom';

import { DocumentTitleSegment } from 'src/components/DocumentTitle';

import { AssignedRolesTable } from '../../Shared/AssignedRolesTable/AssignedRolesTable';
import { NO_ASSIGNED_ROLES_TEXT } from '../../Shared/constants';
import { NoAssignedRoles } from '../../Shared/NoAssignedRoles/NoAssignedRoles';
import { isObjNotEmpty } from '../../Shared/utilities';
import { AssignNewRoleDrawer } from './AssignNewRoleDrawer';

import type { IamUserPermissions } from '@linode/api-v4';

interface Props {
  assignedRoles: {} | IamUserPermissions;
}

export const UserRoles = ({ assignedRoles }: Props) => {
  const { username } = useParams<{ username: string }>();

  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

  const handleClick = () => {
    setIsDrawerOpen(true);
  };

  const hasAssignedRoles = isObjNotEmpty(assignedRoles);

  return (
    <>
      <DocumentTitleSegment segment={`${username} - User Roles`} />
      <Paper sx={(theme) => ({ marginTop: theme.spacing(2) })}>
        <Grid
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
          container
        >
          <Grid>
            <Typography variant="h2">Assigned Roles</Typography>
          </Grid>
          <Button buttonType="primary" onClick={handleClick}>
            Assign New Role
          </Button>
        </Grid>
        {hasAssignedRoles ? (
          <AssignedRolesTable />
        ) : (
          <NoAssignedRoles text={NO_ASSIGNED_ROLES_TEXT} />
        )}
      </Paper>
      <AssignNewRoleDrawer
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        sx={{ with: '580px' }}
      />
    </>
  );
};
