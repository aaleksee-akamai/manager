import React from 'react';

import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { IamUserPermissions } from '@linode/api-v4';
import { AssignNewRoleDrawer } from './AssignNewRoleDrawer';
import { Button, Paper, Typography } from '@linode/ui';
import { isObjNotEmpty } from '../../Shared/utilities';
import { NoAssignedRoles } from '../../Shared/NoAssignedRoles/NoAssignedRoles';
import { NO_ASSIGNED_ROLES_TEXT } from '../../Shared/constants';

interface Props {
  assignedRoles: IamUserPermissions | {};
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
      <Paper>
        <Grid
          container
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <Grid>
            <Typography variant="h2">Assigned Roles</Typography>
          </Grid>
          <Button onClick={handleClick} buttonType="primary">
            Assign New Role
          </Button>
        </Grid>
        {!hasAssignedRoles && <NoAssignedRoles text={NO_ASSIGNED_ROLES_TEXT} />}
        {hasAssignedRoles && <p>you have some roles</p>}
      </Paper>
      <AssignNewRoleDrawer
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        sx={{ with: '580px' }}
      />
    </>
  );
};
