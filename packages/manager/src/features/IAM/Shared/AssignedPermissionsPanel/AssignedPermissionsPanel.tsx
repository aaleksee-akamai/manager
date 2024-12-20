import { Paper } from '@linode/ui';
import * as React from 'react';

import { Entities } from '../Entities/Entities';
import { Permissions } from '../Permissions/Permissions';
import { RoleDescription } from '../RoleDescription/RoleDescription';

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
      {/* <Typography sx={{ marginBottom: 1 }}>{role.description}</Typography> */}
      <RoleDescription description={role.description} />

      <Permissions permissions={role.permissions} />
      <Entities access={role.access} type={role.resource_type} />
    </Paper>
  );
};
