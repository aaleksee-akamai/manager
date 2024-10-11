import { APIError, UserPermissions } from '@linode/api-v4';
import { iamQueries } from './queries';
import { useQuery } from '@tanstack/react-query';

export const useAccountUserPermissions = (username: string) => {
  return useQuery<UserPermissions, APIError[]>(
    iamQueries.user(username)._ctx.permissions
  );
};