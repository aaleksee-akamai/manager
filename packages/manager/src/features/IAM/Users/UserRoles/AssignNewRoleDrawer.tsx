import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

import { Drawer } from 'src/components/Drawer';
import { Typography } from 'src/components/Typography';
import { AssignedPermissionsPanel } from '../../AssignedPermissionsPanel/AssignedPermissionsPanel';
import { useAccountPermissions } from 'src/queries/iam/iam';
import { Link } from 'src/components/Link';
import {
  IamAccess,
  IamAccessType,
  IamAccountPermissions,
  ResourceTypePermissions,
  Roles,
} from '@linode/api-v4/lib/iam';

interface RolesType {
  label: string;
  value: string;
}

interface ExtendedRole extends Roles {
  resource_type: ResourceTypePermissions;
  access: IamAccessType;
}

export const AssignNewRoleDrawer = (props: any) => {
  const { onClose, open } = props;
  const [
    selectedOptions,
    setSelectedOptions,
  ] = React.useState<RolesType | null>(null);

  const { data } = useAccountPermissions();

  // Get all roles only when `data` changes
  const allRoles = React.useMemo(() => {
    if (!data) return [];
    const r = getAllRoles(data);
    // console.log('r', r);
    return r;
  }, [data]);

  // Get the selected role based on the `selectedOptions`
  const selectedRole = React.useMemo(() => {
    if (!selectedOptions || !data) return null;
    const r = getRoleByName(data, selectedOptions.value);
    // console.log('selectedRole', r);
    return r;
  }, [selectedOptions, data]);

  return (
    <Drawer onClose={onClose} open={open} title="Assign New Roles">
      <Typography>
        Select a role you want to assign to a user. Some roles require selecting
        resources they should apply to. Configure the first role and continue
        adding roles or save the assignment.
        <Link to=""> Learn more about roles and permissions.</Link>
      </Typography>

      {allRoles && (
        <Autocomplete
          options={allRoles}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option: RolesType, value: RolesType) =>
            option.value === value.value
          }
          renderOption={(props, option) => (
            <li {...props} key={option.label}>
              {option.label}
            </li>
          )}
          label=""
          placeholder="Select a Role"
          value={selectedOptions}
          onChange={(_, value) => setSelectedOptions(value)}
        />
      )}

      {selectedRole && (
        <AssignedPermissionsPanel role={selectedRole} key={selectedRole.name} />
      )}
    </Drawer>
  );
};

const getRoleByName = (
  accountPermissions: IamAccountPermissions,
  roleName: string
): ExtendedRole | null => {
  const accessTypes: IamAccessType[] = ['account_access', 'resource_access'];

  for (const permissionType of accessTypes) {
    const resources = accountPermissions[permissionType];
    for (const resource of resources) {
      const role = resource.roles.find((role: Roles) => role.name === roleName);
      if (role) {
        const r = {
          ...role,
          resource_type: resource.resource_type,
          access: permissionType, // Include access type (account or resource)
        };
        // console.log('getRoleByName', r);
        return r;
      }
    }
  }
  return null;
};

const getAllRoles = (permissions: IamAccountPermissions): RolesType[] => {
  const accessTypes: IamAccessType[] = ['account_access', 'resource_access'];

  return accessTypes.flatMap((accessType: IamAccessType) =>
    permissions[accessType].flatMap((resource: IamAccess) =>
      resource.roles.map((role: Roles) => ({
        label: role.name,
        value: role.name,
      }))
    )
  );
};

// const getResourcesByType = (
//   roleResourceType: ResourceType | ResourceTypePermissions,
//   resources: IamAccountResource
// ): IamAccountResource | undefined => {
//   const resourceArray: IamAccountResource[] = Object.values(resources);

//   // Find the first matching resource by resource_type
//   const resource = resourceArray.find(
//     (item: IamAccountResource) => item.resource_type === roleResourceType
//   );

//   return resource;
// };

// let roleAccount: Roles | undefined;
// let roleResource: Roles | undefined;
// let roleResourceType: ResourceType | ResourceTypePermissions;
// let accountResources: IamAccountResource | undefined;

// if (data) {
//   roleAccount = data.account_access[0].roles[0];

//   roleResource = data.resource_access[0].roles[0];

//   roleResourceType = data.resource_access[0].resource_type;

//   if (roleResourceType && resources) {
//     accountResources = getResourcesByType(roleResourceType, resources);
//   }
// }

// let roleAccount: any = accountPermissions.account_access[0].roles[0];
// console.log('roleAccount', roleAccount);

// const { data: resources } = useAccountResources();

// console.log('resources', resources);
// console.log('data', data);
