import * as React from 'react';

import { LandingHeader } from 'src/components/LandingHeader';

import { useHistory, useLocation, useParams } from 'react-router-dom';

import { Button } from 'src/components/Button/Button';
import { IAM_LABEL } from '../../constants';
import { Paper } from '@mui/material';
import { Typography } from 'src/components/Typography';
// import { useAccountPermissions } from 'src/queries/iam/iam';
// import { useAccountResources } from 'src/queries/resources/resources';
// import { AssignedPermissionsPanel } from '../../AssignedPermissionsPanel/AssignedPermissionsPanel';
// import { IamAccountResource } from '@linode/api-v4/lib/resources/types';

type LocationState = {
  selectedRole: 'account' | 'resource' | 'all_roles';
};

export const AssignNewRole = () => {
  const location = useLocation<LocationState>();
  const { username } = useParams<{ username: string }>();
  // const { data } = useAccountPermissions();
  // const { data: resources } = useAccountResources();

  // console.log('data', data?.account_access);
  // console.log('resources', resources);

  const history = useHistory();

  const selectedRole = location.state?.selectedRole;

  // const roleAccount = data?.account_access[0]?.roles[0];
  // console.log('roleAccount', roleAccount);

  // const roleResource = data?.resource_access[0]?.roles[0];
  // console.log('roleResource', roleResource);
  // const roleResourceType = data?.resource_access[0]?.resource_type || '';
  // console.log('roleResourceType', roleResourceType);

  // const accountResources = resources ? getResourcesByType(resources, roleResourceType) : {};
  // console.log(accountResources);

  const handleCancel = () => {
    // mock for cancelling
    if (selectedRole !== 'all_roles') {
      history.push(`/iam/users/${username}/roles`);
    } else {
      history.push(`/iam/roles`);
    }
  };

  const handleSubmit = () => {
    // mock for submitting
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
      {selectedRole === 'account' && (
        <Paper sx={{ padding: 2 }}>
          <Typography>Assigning Account Role</Typography>

          {/* {roleAccount && <AssignedPermissionsPanel selectedRole={selectedRole} role={roleAccount} />} */}
        </Paper>
      )}
      {selectedRole === 'resource' && (
        <Paper sx={{ padding: 2 }}>
          <Typography>Assigning Resource Role</Typography>

          {/* {roleResource && <AssignedPermissionsPanel selectedRole={selectedRole} role={roleResource} accountResources={accountResources} />} */}
        </Paper>
      )}

      {selectedRole === 'all_roles' && (
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

// const getResourcesByType = (resources: IamAccountResource, roleResourceType: string) => {

//   // console.log('resources', resources[0]);

//   // Find the first matching resource by resource_type
//   const resource = Object.values(resources).find(
//     (item: any) => item.resource_type === roleResourceType
//   );

//   console.log('resource', resource);

//   return resource || {};
// };
