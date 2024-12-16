import { Paper, Typography } from '@linode/ui';
import * as React from 'react';

import { Permissions } from '../Permissions/Permissions';
import { Resources } from '../Resources/Resources';

import type {
  IamAccessType,
  ResourceTypePermissions,
  Roles,
} from '@linode/api-v4/lib/iam/types';

interface ExtendedRole extends Roles {
  access: IamAccessType;
  resource_type: ResourceTypePermissions;
}

type Props = {
  role: ExtendedRole;
};

export const AssignedPermissionsPanel = ({ role }: Props) => {
  return (
    <Paper sx={{ backgroundColor: '#F9FAFA', marginTop: 1, padding: '10px' }}>
      <Typography sx={{ marginBottom: 1 }}>{role.description}</Typography>
      <Permissions permissions={role.permissions} />
      <Resources role={role} />
    </Paper>
  );
};
