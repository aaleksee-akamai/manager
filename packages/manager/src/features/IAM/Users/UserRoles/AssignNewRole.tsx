import * as React from 'react';

import { LandingHeader } from 'src/components/LandingHeader';

import { useHistory, useLocation, useParams } from 'react-router-dom';

import { Button } from 'src/components/Button/Button';
import { IAM_LABEL } from '../../constants';
import { Paper } from '@mui/material';
import { Typography } from 'src/components/Typography';
import { useAccountPermissions } from 'src/queries/iam/iam';
import { useAccountResources } from 'src/queries/resources/resources';
import { AssignedPermissionsPanel } from '../../AssignedPermissionsPanel/AssignedPermissionsPanel';
import {
  IamAccountResource,
  ResourceType,
} from '@linode/api-v4/lib/resources/types';
import { ResourceTypePermissions, Roles } from '@linode/api-v4/lib/iam/types';

type LocationState = {
  selectedRole: 'account' | 'resource' | 'all_roles';
};

export const AssignNewRole = () => {
  const location = useLocation<LocationState>();
  const { username } = useParams<{ username: string }>();
  const { data } = useAccountPermissions();
  const { data: resources } = useAccountResources();

  const history = useHistory();

  const selectedRoleType = location.state?.selectedRole;

  let roleAccount: Roles | undefined;
  let roleResource: Roles | undefined;
  let roleResourceType: ResourceType | ResourceTypePermissions;
  let accountResources: IamAccountResource | undefined;

  if (data) {
    roleAccount = data.account_access[0].roles[0];

    roleResource = data.resource_access[0].roles[0];

    roleResourceType = data.resource_access[0].resource_type;

    if (roleResourceType && resources) {
      accountResources = getResourcesByType(roleResourceType, resources);
    }
  }

  const handleCancel = () => {
    // mock for cancelling
    if (selectedRoleType !== 'all_roles') {
      history.push(`/iam/users/${username}/roles`);
    } else {
      history.push(`/iam/roles`);
    }
  };

  const handleSubmit = () => {
    // mock for submitting
  };

  const handleRemove = () => {
    // console.log('click on remove ');
  };

  return (
    <>
      <LandingHeader
        breadcrumbProps={{
          crumbOverrides: [
            {
              label: IAM_LABEL,
              position: 1,
            },
          ],
          labelOptions: {
            noCap: true,
          },
          pathname: location.pathname,
        }}
        removeCrumbX={4}
        title="Assign New Roles"
      />
      {selectedRoleType === 'account' && (
        <Paper sx={{ padding: 2 }}>
          <Typography>Assigning Account Role</Typography>

          {roleAccount && (
            <AssignedPermissionsPanel
              selectedRoleType={selectedRoleType}
              role={roleAccount}
              onClick={handleRemove}
            />
          )}
        </Paper>
      )}
      {selectedRoleType === 'resource' && (
        <Paper sx={{ padding: 2 }}>
          <Typography>Assigning Resource Role</Typography>

          {roleResource && (
            <AssignedPermissionsPanel
              selectedRoleType={selectedRoleType}
              role={roleResource}
              accountResources={accountResources!}
              onClick={handleRemove}
            />
          )}
        </Paper>
      )}

      {selectedRoleType === 'all_roles' && (
        <div>
          <h2>Choose User</h2>
        </div>
      )}

      <div>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit} buttonType="primary">
          Submit
        </Button>
      </div>
    </>
  );
};

const getResourcesByType = (
  roleResourceType: ResourceType | ResourceTypePermissions,
  resources: IamAccountResource
): IamAccountResource | undefined => {
  const resourceArray: IamAccountResource[] = Object.values(resources);

  // Find the first matching resource by resource_type
  const resource = resourceArray.find(
    (item: IamAccountResource) => item.resource_type === roleResourceType
  );

  return resource;
};
