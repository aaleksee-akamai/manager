import React from 'react';
import { useParams } from 'react-router-dom';

import { CircleProgress } from 'src/components/CircleProgress';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { NotFound } from 'src/components/NotFound';
import { Stack } from 'src/components/Stack';
import { useAccountUser } from 'src/queries/account/users';

import { DeleteUserPanel } from './DeleteUserPanel';
import { UserDetailsPanel } from './UserDetailsPanel';
import { UserEmailPanel } from './UserEmailPanel';
import { UsernamePanel } from './UsernamePanel';
import type { IamUserPermissions } from '@linode/api-v4';

interface Props {
  assignedRoles: IamUserPermissions | {};
}

export const UserProfile = ({ assignedRoles }: Props) => {
  const { username } = useParams<{ username: string }>();

  const { data: user, error, isLoading } = useAccountUser(username ?? '');

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
        <UserDetailsPanel user={user} assignedRoles={assignedRoles ?? {}} />
        <UsernamePanel user={user} />
        <UserEmailPanel user={user} />
        <DeleteUserPanel user={user} />
      </Stack>
    </>
  );
};
