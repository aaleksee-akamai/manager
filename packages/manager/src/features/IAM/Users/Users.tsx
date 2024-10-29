import React from 'react';
import { useHistory } from 'react-router-dom';
import { Action, ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { useProfile } from 'src/queries/profile/profile';
// import { Resources } from '../Resources/Resources';
// import { Permissions } from '../Permissions/Permissions';

// const mockUserResources = {
//   resource_type: 'linode',
//   resources: [
//     {
//       resource_name: 'linode-us-123',
//       resource_id: '12345678',
//     },
//     {
//       resource_name: 'linode-uk-123',
//       resource_id: '23456789',
//     },
//     {
//       resource_name: 'db-us-southeast1',
//       resource_id: '456728',
//     },
//   ],
// };

// const mockUserPermissions = {
//   resourceType: 'account',
//   roles: [
//     {
//       name: 'accountAdmin',
//       description:
//         'Access to perform any supported action on all resources in the account',
//       permissions: [
//         'delete_linode',
//         'initiate_linode_migration',
//         'update_linode',
//         'view_linode',
//         'boot_linode',
//         'clone_linode',
//         'upgrade_linode',
//         'reboot_linode',
//         'list_linode',
//         'rebuild_linode',
//         'rescue_linode',
//         'reside_linode',
//         'shutdown_linode',
//         'password_reset_linode',
//       ],
//     },
//   ],
// };

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
      {/* <Resources userResources={mockUserResources} />
      <Permissions userPermissions={mockUserPermissions} /> */}
    </>
  );
};
