import React from 'react';
import { useHistory } from 'react-router-dom';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';

const user = {
  username: 'aaleksee-akamai',
};

export const UsersLanding = () => {
  const history = useHistory();

  const actions: any[] = [
    {
      onClick: () => {
        history.push(
          `/identity-access-management/users/${user.username}/details`
        );
      },
      title: 'View User Details',
    },
    {
      onClick: () => {
        history.push(
          `/identity-access-management/users/${user.username}/roles`
        );
      },
      title: 'View User Roles',
    },
  ];

  return (
    <>
      <p>Users Table - UIE-8136 </p>

      <ActionMenu actionsList={actions} ariaLabel={`Action menu for user`} />
    </>
  );
};
