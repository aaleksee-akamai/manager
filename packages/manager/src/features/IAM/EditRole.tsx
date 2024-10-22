import * as React from 'react';

import { LandingHeader } from 'src/components/LandingHeader';

import { useHistory, useLocation, useParams } from 'react-router-dom';

import { Button } from 'src/components/Button/Button';

// type LocationState = {
//   selectedRole: 'account' | 'resource';
// };

export const EditRole = () => {
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const history = useHistory();

  // const selectedRole = location.state?.selectedRole;

  // console.log('selectedRole:', selectedRole);

  const handleCancel = () => {
    history.push(`/iam/users/${username}/roles`);
  };

  const handleSubmit = () => {
    history.push(`/iam/users/${username}/roles`);
  };

  return (
    <div>
      <LandingHeader
        breadcrumbProps={{
          labelOptions: {
            noCap: true,
          },
          pathname: location.pathname,
        }}
        removeCrumbX={4}
        title="Edit assignement"
      />
      <h1>Edit assignement</h1>

      <div>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit} buttonType="primary">
          Submit
        </Button>
      </div>
    </div>
  );
};
