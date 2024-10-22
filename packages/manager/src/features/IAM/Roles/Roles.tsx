import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from 'src/components/Button/Button';

export const RolesLanding = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/iam/roles/assign`, {
      selectedRole: 'all_roles',
    });
  };

  return (
    <>
      <p>Roles Table - UIE-8142 </p>

      <Button onClick={handleClick} buttonType="primary">
        Assign Selected Roles
      </Button>
    </>
  );
};
