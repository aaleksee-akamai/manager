import React from 'react';
import { useHistory } from 'react-router-dom';
import { Action, ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { useProfile } from 'src/queries/profile/profile';
import { Resources } from '../Shared/Resources/Resources';

// just for showing the Resources componnet, it will be gone wuth the AssignedPermissions component
const mockResourcesAcceessRole: any = {
  access: 'resource_access',
  description: 'Access to administer a image instance',
  name: 'image_admin',
  permissions: [
    'create_image',
    'upload_image',
    'list_images',
    'view_image',
    'update_image',
    'delete_image',
  ],
  resource_type: 'image',
};

export const UsersLanding = () => {
  const history = useHistory();
  const { data: profile } = useProfile();

  const username = profile?.username;

  const actions: Action[] = [
    {
      onClick: () => {
        history.push(`/iam/users/${username}/details`);
      },
      title: 'View User Details',
    },
    {
      onClick: () => {
        history.push(`/iam/users/${username}/roles`);
      },
      title: 'View User Roles',
    },
  ];

  return (
    <>
      <p>Users Table - UIE-8136 </p>

      <ActionMenu actionsList={actions} ariaLabel={`Action menu for user`} />
      <Resources role={mockResourcesAcceessRole} />
    </>
  );
};
