import * as React from 'react';

import { LandingHeader } from 'src/components/LandingHeader';

import { useHistory, useLocation, useParams } from 'react-router-dom';

import { Button } from 'src/components/Button/Button';
import { IAM_LABEL } from './constants';

type LocationState = {
  selectedRole: 'account' | 'resource' | 'all_roles';
};

export const AssignNewRole = () => {
  const location = useLocation<LocationState>();
  const { username } = useParams<{ username: string }>();
  const history = useHistory();

  const selectedRole = location.state?.selectedRole;

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
    <div>
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
      <h1>Assign New Role</h1>
      {selectedRole === 'account' && (
        <div>
          <h2>Assigning Account Role</h2>
        </div>
      )}
      {selectedRole === 'resource' && (
        <div>
          <h2>Assigning Resource Role</h2>
        </div>
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
    </div>
  );
};
