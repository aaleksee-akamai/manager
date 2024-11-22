import React from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';
import Grid from '@mui/material/Grid';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { NoAssignedRoles } from '../../NoAssignedRoles/NoAssignedRoles';
import { Button } from 'src/components/Button/Button';
import { NO_ASSIGNED_ROLES_TEXT } from '../../constants';
import { IamUserPermissions } from '@linode/api-v4';
import { isObjNotEmpty } from '../../utilities';

interface Props {
  assignedRoles: IamUserPermissions | {};
}

export const UserRoles = ({ assignedRoles }: Props) => {
  const { username } = useParams<{ username: string }>();
  const history = useHistory();

  const handleClick = () => {
    history.push(`/iam/users/${username}/roles/assign`);
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
    </>
  );
};
