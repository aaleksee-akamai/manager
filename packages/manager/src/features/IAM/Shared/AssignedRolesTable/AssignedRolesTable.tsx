/* eslint-disable no-console */
import { Autocomplete, Button, Chip, Typography } from '@linode/ui';
import { Grid, styled } from '@mui/material';
import React from 'react';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { CollapsibleTable } from 'src/components/CollapsibleTable/CollapsibleTable';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';
import { TableRowEmpty } from 'src/components/TableRowEmpty/TableRowEmpty';
import { useAccountPermissions } from 'src/queries/iam/iam';
import { useAccountResources } from 'src/queries/resources/resources';

import { Permissions } from '../Permissions/Permissions';

import type { IamAccountPermissions, IamAccountResource } from '@linode/api-v4';
import type { Action } from 'src/components/ActionMenu/ActionMenu';

interface Props {
  assignedRoles: any;
}

export const AssignedRolesTable = (assignedRoles: Props) => {
  const { data } = useAccountPermissions();
  // console.log('data', data);
  const { data: resources } = useAccountResources();
  // console.log('resources', resources, typeof(resources));

  // console.log('assignedRoles', assignedRoles)

  // const roles = getAssignRoles(assignedRoles.assignedRoles);
  // console.log('roles', roles);
  const arrrr = combineRoles(assignedRoles.assignedRoles);
  // console.log('arrrr', arrrr);

  // let arr: any;
  let resultArr: any;

  let resourceTypes: any;

  if (data) {
    // arr = getRolesByNames(data, roles);
    // console.log('arr', arr);

    resultArr = mapRolesToPermissions(data, arrrr);
    // console.log('resultArr', resultArr);

    resourceTypes = getResourceTypes(resultArr);
    // console.log('resourceTypes', resourceTypes);

    if (resources) {
      resultArr = addResourceNamesToRoles(resultArr, resources);
      // console.log('resultArr resources', resultArr);
    }
  }

  const [query, setQuery] = React.useState('');

  const [resourceType, setResourceType] = React.useState<any>();

  return (
    <Grid>
      <Grid
        sx={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 3,
        }}
        container
        direction="row"
      >
        <DebouncedSearchTextField
          clearable
          debounceTime={250}
          hideLabel
          label="Filter"
          // isSearching={isSearching}
          onSearch={setQuery}
          placeholder="Search"
          sx={{ marginRight: 2, width: 320 }}
          value={query}
        />
        <Autocomplete
          // getOptionLabel={(option) => option.label || ''}
          textFieldProps={{
            containerProps: { sx: { minWidth: 200 } },
            hideLabel: true,
          }}
          label="Select type"
          onChange={(_, value) => setResourceType(value?.label)}
          options={resourceTypes}
          // value={resourceType}
          placeholder="All Resource Types"
        />
      </Grid>
      <CollapsibleTable
        TableRowEmpty={
          <TableRowEmpty colSpan={5} message={'No Roles are assigned.'} />
        }
        TableItems={getTableItems(resultArr, resourceType, query)}
        TableRowHead={RoleTableRowHead}
      />
    </Grid>
  );
};

const RoleTableRowHead = (
  <TableRow>
    <TableCell sx={{ width: '19%' }}>Role</TableCell>
    <TableCell sx={{ width: '76%' }}>Resources</TableCell>
    <TableCell sx={{ width: '5%' }} />
  </TableRow>
);

const getTableItems = (
  resultArr: any,
  resourceType?: any,
  query?: any
): any[] => {
  // console.log('result', resultArr);
  // console.log('getTableItems resourceType', resourceType);
  // console.log('getTableItems query', query);

  if (resourceType || query) {
    const filteredApps = getFilteredApps({
      query,
      resourceType,
      resultArr,
    });

    // console.log('getTableItems filteredApps ', filteredApps)

    resultArr = [...filteredApps];

    // resultArr = resultArr.filter((r: any) => r.resource_type === resourceType);
    // console.log('resultArr resourceType', resultArr)
  }

  return resultArr.map((role: any) => {
    const resorces = role.resource_names?.map((r: any, idx: any) => {
      return <Chip key={idx} label={r} />;
    });

    const accountMenu: Action[] = [
      {
        onClick: () => {
          // history.push(`/iam/users/${username}/roles`);
        },
        title: 'Change Role',
      },
      {
        onClick: () => {
          // history.push(`/iam/users/${username}/roles`);
        },
        title: 'Remove Role Assignment ',
      },
    ];

    const resourcesMenu: Action[] = [
      {
        onClick: () => {
          // history.push(`/iam/users/${username}/roles`);
        },
        title: 'View Resources Details',
      },
      {
        onClick: () => {
          // history.push(`/iam/users/${username}/roles`);
        },
        title: 'Update Resource Assignment',
      },
      {
        onClick: () => {
          // history.push(`/iam/users/${username}/roles`);
        },
        title: 'Change Role for Resources',
      },
      {
        onClick: () => {
          // history.push(`/iam/users/${username}/roles`);
        },
        title: 'Remove Role Assignment ',
      },
    ];

    const actions = role.access === 'account' ? accountMenu : resourcesMenu;

    const OuterTableCells = (
      <>
        {role.access === 'account' ? (
          <TableCell>
            <Typography>All {role.resource_type} resources</Typography>
          </TableCell>
        ) : (
          <TableCell>{resorces}</TableCell>
        )}
        <TableCell>
          <ActionMenu actionsList={actions} ariaLabel={`action menu`} />
        </TableCell>
      </>
    );

    const InnerTable = (
      <Grid
        sx={{
          background: '#F9FAFA',
          paddingBottom: 2,
          paddingLeft: 4,
          paddingRight: 3,
          paddingTop: 1,
        }}
      >
        <StyledTypography>Description:</StyledTypography>
        {/* <Typography sx={{ marginBottom: 1 }}>{role.description}</Typography> */}
        <RoleDescription description={role.description} />

        <Permissions permissions={role.permissions} />
      </Grid>
    );

    return {
      InnerTable,
      OuterTableCells,
      id: role.id,
      label: role.name,
    };
  });
};

const getFilteredApps = (options: any) => {
  const { query, resourceType, resultArr } = options;
  // resultArr,
  // resourceType,
  // query,

  return resultArr.filter((app: any) => {
    if (query && resourceType) {
      return (
        getDoesMarketplaceAppMatchQuery(query, app) &&
        getDoesMarketplaceAppMatchCategory(resourceType, app)
      );
    }

    if (query) {
      return getDoesMarketplaceAppMatchQuery(query, app);
    }

    if (resourceType) {
      return getDoesMarketplaceAppMatchCategory(resourceType, app);
    }

    return true;
  });
};

export const StyledButton = styled(Button, { label: 'StyledButton' })(
  ({ theme }) => ({
    fontFamily: theme.font.normal,
    fontSize: '14px',
    minHeight: '20px',
    minWidth: '60px',
    padding: 0,
  })
);

interface RoleDescriptionProps {
  description: string;
}

const RoleDescription = ({ description }: RoleDescriptionProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [visibleChips, setVisibleChips] = React.useState<string[]>([]);
  const [hiddenChips, setHiddenChips] = React.useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const truncateText = React.useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const lineHeight = parseFloat(
        getComputedStyle(container).lineHeight || '1.5'
      );
      const maxHeight = lineHeight * 2 + 10; // Height of 2 lines
      console.log('maxHeight', maxHeight);
      const containerWidth = containerRef.current.offsetWidth - 50; // Leave space for "Show All"

      let accumulatedWidth = 0;
      const visibleItems: string[] = [];
      const hiddenItems: string[] = [];

      const arr = description.split(' ');
      console.log('arr', arr);

      if (container.offsetHeight > maxHeight) {
        for (const item of arr) {
          const itemWidth = item.length;

          if (accumulatedWidth + itemWidth + 13 <= containerWidth) {
            accumulatedWidth += itemWidth + 13;
            visibleItems.push(item);
          } else {
            const lastIdx = arr.indexOf(item);
            hiddenItems.push(
              ...arr.slice(lastIdx)
              // .map()
            );
            break;
          }
        }
      }

      if (container.offsetHeight > maxHeight && hiddenItems.length) {
        visibleItems[visibleItems.length - 1] += '...';
      }

      setVisibleChips(visibleItems);
      setHiddenChips(hiddenItems);

      console.log('visibleItems', visibleItems);
      console.log('hiddenItems', hiddenItems);
    }
  }, [description]);

  React.useEffect(() => {
    truncateText();
  }, [truncateText]);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <Typography
        sx={{
          display: 'block',
          lineHeight: '1.5',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {isExpanded || !visibleChips.join(' ').length
          ? description
          : visibleChips.join(' ')}
      </Typography>
      {!!hiddenChips.length && (
        <Button
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            bottom: '1px',
            fontSize: '14px',
            marginTop: '0',
            minHeight: '20px',
            padding: '0',
            position: 'absolute',
          }}
          onClick={toggleDescription}
        >
          {isExpanded ? 'Hide' : 'Expand'}
        </Button>
      )}
    </div>
  );
};

/**
 * Checks if the given StackScript has a category
 *
 * @param resourceType The category to check for
 * @param app The Marketplace app to compare against
 * @returns true if the given app has the given category
 */
const getDoesMarketplaceAppMatchCategory = (resourceType: any, app: any) => {
  return app.resource_type === resourceType;
};

/**
 * Compares a StackScript's details to a given text search query
 *
 * @param query the current search query
 * @param stackscript the StackScript to compare aginst
 * @returns true if the StackScript matches the given query
 */
const getDoesMarketplaceAppMatchQuery = (query: string, app: any) => {
  const queryWords = query
    .replace(/[,.-]/g, '')
    .trim()
    .toLocaleLowerCase()
    .split(' ');

  const searchableAppFields = [
    String(app.id),
    app.resource_type,
    app.name,
    app.access,
    app.description,
    // app.resource_names,
    ...app.permissions,
  ];

  return searchableAppFields.some((field) =>
    queryWords.some((queryWord) => field.toLowerCase().includes(queryWord))
  );
};

// const getAssignRoles = (assign_roles: any): any => {
//   const accountAccessRoles = assign_roles.account_access || [];
//   console.log('table', assign_roles.account_access)

//   const resourceAccessRoles = assign_roles.resource_access
//     ? assign_roles.resource_access.map((resource: any) => resource.roles).flat()
//     : [];

//   const combinedRoles = Array.from(
//     new Set(accountAccessRoles.concat(resourceAccessRoles))
//   );

//   return combinedRoles;
// };

const combineRoles = (data: {
  account_access: any[];
  resource_access: any[];
}) => {
  const combinedRoles: { name: any; resource_id: any }[] = [];

  // Add account access roles with resource_id set to null
  data.account_access.forEach((role: any) => {
    combinedRoles.push({
      name: role,
      resource_id: null,
    });
  });

  // Add resource access roles with their respective resource_id
  data.resource_access.forEach(
    (resource: { resource_id: any; roles: any[] }) => {
      resource.roles.forEach((role: any) => {
        combinedRoles.push({
          name: role,
          resource_id: resource.resource_id,
        });
      });
    }
  );

  return combinedRoles;
};

// const getRolesByNames = (
//   accountPermissions: IamAccountPermissions,
//   roles: string[] // Array of role names
// ): Array<{ name: string; description: string; permissions: string[]; resource_type: string; access: string }> => {
//   const accessTypes: IamAccessType[] = ['account_access', 'resource_access'];
//   const result: Array<{ id: string; name: string; description: string; permissions: string[]; resource_type: string; access: string }> = [];

//   for (const roleName of roles) {
//     for (const permissionType of accessTypes) {
//       const resources = accountPermissions[permissionType];
//       for (const resource of resources) {
//         const role = resource.roles.find((role: Roles) => role.name === roleName);
//         if (role && !result.find(item => item.name === roleName)) { // Ensure no duplicates
//           // console.log('item', item)

//           result.push({
//             id: role.name,
//             name: role.name,
//             description: role.description,
//             permissions: role.permissions,
//             resource_type: resource.resource_type,
//             access: permissionType, // Include access type (account or resource),
//             // resource_id:
//           });
//         }
//       }
//     }
//   }

//   return result; // Return an array of objects
// };

const getResourceTypes = (data: any) => {
  // console.log('data', data);
  const resourceTypes = Array.from(
    new Set(data.map((el: any) => el.resource_type))
  );
  // console.log('getResourceTypes', resourceTypes);

  return resourceTypes.map((resource) => ({
    label: resource,
    value: resource,
  }));
};

export const StyledTypography = styled(Typography, {
  label: 'StyledTypography',
})(({ theme }) => ({
  color: '#32363C',
  fontFamily: theme.font.bold,
  fontSize: '14px',
  marginBottom: 0,
}));

const mapRolesToPermissions = (
  accountPermissions: IamAccountPermissions,
  roles: any[]
) => {
  const getAccessType = (accessType: string) =>
    accessType === 'account_access' ? 'account' : 'resource';

  const roleMap = new Map<
    string,
    {
      access: string;
      description: any;
      id: any;
      name: any;
      permissions: any;
      resource_ids: any[];
      resource_type: any;
    }
  >();

  roles.forEach((role: { name: any; resource_id: any }) => {
    const allResources = [
      {
        resources: accountPermissions.account_access || [],
        type: 'account_access',
      },
      {
        resources: accountPermissions.resource_access || [],
        type: 'resource_access',
      },
    ];

    allResources.forEach(({ resources, type }) => {
      resources.forEach((resource: { resource_type: any; roles: any[] }) => {
        resource.roles.forEach(
          (permissionRole: {
            description: any;
            name: any;
            permissions: any;
          }) => {
            if (role.name === permissionRole.name) {
              const existingEntry = roleMap.get(role.name);

              if (existingEntry) {
                if (!existingEntry.resource_ids.includes(role.resource_id)) {
                  existingEntry.resource_ids.push(role.resource_id);
                }
              } else {
                roleMap.set(role.name, {
                  access: getAccessType(type),
                  description: permissionRole.description,
                  id: role.name,
                  name: role.name,
                  permissions: permissionRole.permissions,
                  resource_ids: [role.resource_id],
                  resource_type: resource.resource_type,
                });
              }
            }
          }
        );
      });
    });
  });

  return Array.from(roleMap.values());
};

const addResourceNamesToRoles = (
  roles: Array<{
    access: string;
    description: any;
    id: any;
    name: any;
    permissions: any;
    resource_ids: any[];
    resource_names?: string[];
    resource_type: any;
  }>,
  resources: IamAccountResource | undefined
) => {
  // Safely convert resources to an array
  const resourcesArray: IamAccountResource[] = resources
    ? Object.values(resources)
    : [];

  return roles.map((role) => {
    // Find the resource group by resource_type
    const resourceGroup = resourcesArray.find(
      (res) => res.resource_type === role.resource_type
    );

    if (resourceGroup) {
      // Map resource_ids to their names
      const resourceNames = role.resource_ids
        .map(
          (id) =>
            resourceGroup.resources.find((resource) => resource.id === id)?.name
        )
        .filter((name): name is string => name !== undefined);

      return { ...role, resource_names: resourceNames };
    }

    // If no matching resource_type, return the role unchanged
    return { ...role, resource_names: [] };
  });
};
