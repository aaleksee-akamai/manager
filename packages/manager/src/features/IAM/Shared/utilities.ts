import { useFlags } from 'src/hooks/useFlags';
import { capitalize } from 'src/utilities/capitalize';

import type {
  AccountAccessType,
  PermissionType,
  ResourceType,
  ResourceTypePermissions,
  RoleType,
} from '@linode/api-v4';

/**
 * Hook to determine if the IAM feature should be visible to the user.
 * Based on the user's account capability and the feature flag.
 *
 * @returns {boolean} - Whether the IAM feature is enabled for the current user.
 */
export const useIsIAMEnabled = () => {
  const flags = useFlags();

  const isIAMEnabled = flags.iam?.enabled;

  return {
    isIAMBeta: flags.iam?.beta,
    isIAMEnabled,
  };
};

export const placeholderMap: Record<string, string> = {
  account: 'Select Account',
  database: 'Select Databases',
  domain: 'Select Domains',
  firewall: 'Select Firewalls',
  image: 'Select Images',
  linode: 'Select Linodes',
  longview: 'Select Longviews',
  nodebalancer: 'Select Nodebalancers',
  stackscript: 'Select Stackscripts',
  volume: 'Select Volumes',
  vpc: 'Select VPCs',
};

export interface RoleMap {
  access: 'account' | 'resource';
  description: string;
  id: AccountAccessType | RoleType;
  name: AccountAccessType | RoleType;
  permissions: PermissionType[];
  resource_ids: null | number[];
  resource_type: ResourceTypePermissions;
}
export interface ExtendedRoleMap extends RoleMap {
  resource_names?: string[];
}

interface FilteredRolesOptions {
  entityType?: ResourceType | ResourceTypePermissions;
  query: string;
  roles: EntitiesRole[] | RoleMap[];
}

export const getFilteredRoles = (
  options: FilteredRolesOptions,
  getSearchableFields: (role: EntitiesRole | ExtendedRoleMap) => string[]
) => {
  const { entityType, query, roles } = options;

  return roles.filter((role: ExtendedRoleMap) => {
    if (query && entityType) {
      return (
        getDoesRolesMatchQuery(query, role, getSearchableFields) &&
        getDoesRolesMatchType(entityType, role)
      );
    }

    if (query) {
      return getDoesRolesMatchQuery(query, role, getSearchableFields);
    }

    if (entityType) {
      return getDoesRolesMatchType(entityType, role);
    }

    return true;
  });
};

/**
 * Checks if the given Role has a type
 *
 * @param resourceType The type to check for
 * @param role The role to compare against
 * @returns true if the given role has the given type
 */
const getDoesRolesMatchType = (
  resourceType: ResourceType | ResourceTypePermissions,
  role: ExtendedRoleMap
) => {
  return role.resource_type === resourceType;
};

/**
 * Compares a Role details to a given text search query
 *
 * @param query the current search query
 * @param role the Role to compare aginst
 * @returns true if the Role matches the given query
 */
const getDoesRolesMatchQuery = (
  query: string,
  role: ExtendedRoleMap,
  getSearchableFields: (role: EntitiesRole | ExtendedRoleMap) => string[]
) => {
  const queryWords = query.trim().toLocaleLowerCase().split(' ');

  const searchableFields = getSearchableFields(role);

  return searchableFields.some((field) =>
    queryWords.some((queryWord) => field.toLowerCase().includes(queryWord))
  );
};

interface EntitiesRole {
  id: string;
  resource_id: number;
  resource_name: string;
  resource_type: ResourceType | ResourceTypePermissions;
  role_name: RoleType;
}

export interface EntitiesType {
  label: string;
  rawValue: ResourceType | ResourceTypePermissions;
  value?: string;
}

export const getResourceOrEntityTypes = (
  data: EntitiesRole[] | RoleMap[],
  suffix: string
): EntitiesType[] => {
  const resourceTypes = Array.from(new Set(data.map((el) => el.resource_type)));

  return resourceTypes.map((resource) => ({
    label: capitalize(resource) + suffix,
    rawValue: resource,
    value: capitalize(resource) + suffix,
  }));
};
