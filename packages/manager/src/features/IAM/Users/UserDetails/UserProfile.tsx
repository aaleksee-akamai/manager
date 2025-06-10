/* eslint-disable no-console */
import { useAccountUser } from '@linode/queries';
import { CircleProgress, ErrorState, NotFound, Stack } from '@linode/ui';
import React from 'react';
import { useParams } from 'react-router-dom';

import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { useUserAccountPermissions, useUserEntityPermissions, useUserRoles } from 'src/queries/iam/iam';

import { DeleteUserPanel } from './DeleteUserPanel';
import { UserDetailsPanel } from './UserDetailsPanel';
import { UserEmailPanel } from './UserEmailPanel';
import { UsernamePanel } from './UsernamePanel';

export const UserProfile = () => {
  const { username } = useParams<{ username: string }>();

  const { data: user, error, isLoading } = useAccountUser(username ?? '');
  const { data: assignedRoles } = useUserRoles(username ?? '');

  const { data: perm } = useUserAccountPermissions(username ?? '');
  if (perm?.includes('list_events')) {
    console.log('list_events', 'lslld');
  }

  console.log('perm', perm);


    const { data: entPerm } = useUserEntityPermissions(
    'linode',
    12345,
    username ?? ''
  );

  console.log('entPerm', entPerm);

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
      <Stack
        spacing={2}
        sx={(theme) => ({ marginTop: theme.tokens.spacing.S16 })}
      >
        <UserDetailsPanel assignedRoles={assignedRoles} user={user} />
        <UsernamePanel user={user} />
        <UserEmailPanel user={user} />
        <DeleteUserPanel user={user} />
      </Stack>
    </>
  );
};
