import React from 'react';

import { useParams } from 'react-router-dom';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import Grid from '@mui/material/Grid';
import { IamUserPermissions } from '@linode/api-v4';
import { isObjNotEmpty } from '../Shared/utilities';
import { Paper, Typography } from '@linode/ui';
import { NoAssignedRoles } from '../Shared/NoAssignedRoles/NoAssignedRoles';
import { NO_ASSIGNED_RESOURCES_TEXT } from '../Shared/constants';

interface Props {
  assignedRoles: IamUserPermissions | {};
}

export const UserResources = ({ assignedRoles }: Props) => {
  const { username } = useParams<{ username: string }>();

  const hasAssignedRoles = isObjNotEmpty(assignedRoles);

  return (
    <>
      <DocumentTitleSegment segment={`${username} - User Resources`} />
      <Paper>
        <Grid
          container
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <Typography variant="h2">Assigned Resources</Typography>
        </Grid>
        {!hasAssignedRoles && (
          <NoAssignedRoles text={NO_ASSIGNED_RESOURCES_TEXT} />
        )}
        {hasAssignedRoles && <p>you have some resources</p>}
      </Paper>
    </>
  );
};
