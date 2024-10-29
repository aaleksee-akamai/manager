import React from 'react';
import { useParams } from 'react-router-dom';

import { CircleProgress } from 'src/components/CircleProgress';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { NotFound } from 'src/components/NotFound';
import { Stack } from 'src/components/Stack';
import { useAccountUser } from 'src/queries/account/users';
import { useAccountUserPermissions } from 'src/queries/iam/iam';

import { DeleteUserPanel } from './DeleteUserPanel';
import { UserDetailsPanel } from './UserDetailsPanel';
import { UserEmailPanel } from './UserEmailPanel';
import { UsernamePanel } from './UsernamePanel';

// const assignRoles = {
//   account_access: [
//     'account_linode_admin',
//     'linode_creator',
//     'firewall_creator',
//   ],
//   resource_access: [
//     {
//       resource_id: 12345678,
//       resource_type: 'linode',
//       roles: ['linode_contributor', 'linode_creator'],
//     },
//     {
//       resource_id: 45678901,
//       resource_type: 'firewall',
//       roles: ['firewall_admin', 'firewall_creator'],
//     },
//   ],
// };

export const UserProfile = () => {
  const { username } = useParams<{ username: string }>();

  const { data: user, error, isLoading } = useAccountUser(username ?? '');
  const { data: assignRoles } = useAccountUserPermissions(username ?? '');

  if (isLoading) {
    return <CircleProgress />;
  }

  if (error) {
    return <ErrorState errorText={error[0].reason} />;
  }

  if (!user) {
    return <NotFound />;
  }

  return (
    <>
      <DocumentTitleSegment segment={`${username} - Profile`} />
      <Stack spacing={2}>
        <UserDetailsPanel user={user} assignRoles={assignRoles ?? {}} />
        <UsernamePanel user={user} />
        <UserEmailPanel user={user} />
        <DeleteUserPanel user={user} />
      </Stack>
    </>
  );
};
