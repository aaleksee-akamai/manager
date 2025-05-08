import { mapAccountPermissionsToRoles } from '../utilities';

import type { ExtendedRoleView, RoleView } from '../types';
import type {
  AccountAccessRole,
  AccountEntity,
  EntityAccess,
  EntityAccessRole,
  EntityType,
  IamAccountPermissions,
  IamUserPermissions,
} from '@linode/api-v4';

export interface CombinedRoles {
  id: null | number[];
  name: AccountAccessRole | EntityAccessRole;
}

export const getSearchableFields = (role: ExtendedRoleView): string[] => {
  const entityNames = role.entity_names || [];
  return [
    String(role.id),
    role.entity_type,
    role.name,
    role.description,
    ...entityNames,
    ...role.permissions,
  ];
};

/**
 * Add assigned entities to role
 */
export const addEntitiesNamesToRoles = (
  roles: ExtendedRoleView[],
  entities: Map<EntityType, Pick<AccountEntity, 'id' | 'label'>[]>
): ExtendedRoleView[] => {
  return roles.map((role) => {
    // Find the resource group by entity_type
    const resourceGroup = entities.get(role.entity_type as EntityType);

    if (resourceGroup && role.entity_ids) {
      // Map entity_ids to their names
      const resourceNames = role.entity_ids
        .map(
          (id) => resourceGroup.find((resource) => resource.id === id)?.label
        )
        .filter((label): label is string => label !== undefined); // Remove undefined values

      return { ...role, entity_names: resourceNames };
    }

    // If no matching entity_type, return the role unchanged
    return { ...role, entity_names: [] };
  });
};

/**
 * Group account_access and entity_access roles of the user
 */
export const combineRoles = (data: IamUserPermissions): CombinedRoles[] => {
  const combinedRoles: CombinedRoles[] = [];
  const roleMap: Map<AccountAccessRole | EntityAccessRole, null | number[]> =
    new Map();

  // Add account access roles with resource_id set to null
  data.account_access.forEach((role: AccountAccessRole) => {
    if (!roleMap.has(role)) {
      roleMap.set(role, null);
    }
  });

  // Add resource access roles with their respective resource_id
  data.entity_access.forEach(
    (resource: { id: number; roles: EntityAccessRole[] }) => {
      resource.roles?.forEach((role: EntityAccessRole) => {
        if (roleMap.has(role)) {
          const existingResourceIds = roleMap.get(role);
          if (existingResourceIds && existingResourceIds !== null) {
            existingResourceIds.push(resource.id);
          }
        } else {
          roleMap.set(role, [resource.id]);
        }
      });
    }
  );

  // Convert the Map into the final combinedRoles array
  roleMap.forEach((id, name) => {
    combinedRoles.push({ id, name });
  });

  return combinedRoles;
};

/**
 * Add descriptions, permissions, type, entities to assigned users roles
 */
export const mapRolesToPermissions = (
  accountPermissions: IamAccountPermissions,
  userRoles: CombinedRoles[]
): RoleView[] => {
  const allRoles = mapAccountPermissionsToRoles(accountPermissions);

  const userRolesLookup = new Map<string, null | number[]>();
  userRoles.forEach(({ id, name }) => {
    userRolesLookup.set(name, id);
  });

  // Filter allRoles to include only the user's roles and add entity_ids
  return allRoles
    .filter((role) => userRolesLookup.has(role.name))
    .map((role) => ({
      ...role,
      entity_ids: userRolesLookup.get(role.name) || null,
    }));
};

/**
 * Changes a user's assigned role to a new role for either account or entity access.
 * Updates the `account_access` or `entity_access` fields in the user's permissions accordingly.
 *
 * @param access - The type of access being updated ('account_access' or 'entity_access').
 * @param assignedRoles - The user's current permissions.
 * @param initialRole - The role to be changed.
 * @param newRole - The new role to assign.
 * @returns Updated user permissions with the changed role.
 */
export const changeUserRole = (
  access: 'account_access' | 'entity_access',
  assignedRoles: IamUserPermissions,
  initialRole: AccountAccessRole | EntityAccessRole,
  newRole: AccountAccessRole | EntityAccessRole
): IamUserPermissions => {
  if (access === 'account_access') {
    return {
      ...assignedRoles,
      account_access: assignedRoles.account_access.map(
        (role: AccountAccessRole) =>
          role === initialRole ? (newRole as AccountAccessRole) : role
      ),
    };
  }

  if (access === 'entity_access') {
    return {
      ...assignedRoles,
      entity_access: assignedRoles.entity_access.map(
        (resource: EntityAccess) => ({
          ...resource,
          roles: resource.roles.map((role: EntityAccessRole) =>
            role === initialRole ? (newRole as EntityAccessRole) : role
          ),
        })
      ),
    };
  }

  return assignedRoles;
};
