import * as React from 'react';

import { Resources } from '../Resources/Resources';
import { Permissions } from '../Permissions/Permissions';
import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';
import {
  IamAccessType,
  ResourceTypePermissions,
  Roles,
} from '@linode/api-v4/lib/iam/types';

interface ExtendedRole extends Roles {
  resource_type: ResourceTypePermissions;
  access: IamAccessType;
}

type Props = {
  role: ExtendedRole;
};

export const AssignedPermissionsPanel = ({ role }: Props) => {
  return (
    <Paper sx={{ backgroundColor: '#F9FAFA', padding: '10px', marginTop: 1 }}>
      <Typography sx={{ marginBottom: 1 }}>{role.description}</Typography>
      <Permissions role={role} />
      <Resources role={role} />
    </Paper>
  );
};
