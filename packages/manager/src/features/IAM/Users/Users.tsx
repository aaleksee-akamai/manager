// import React from 'react';
// import { useHistory } from 'react-router-dom';
// import { Action, ActionMenu } from 'src/components/ActionMenu/ActionMenu';
// import { useProfile } from 'src/queries/profile/profile';
// // import { Resources } from '../Resources/Resources';
// // import { Permissions } from '../Permissions/Permissions';

// // const mockUserResources = {
// //   resource_type: 'linode',
// //   resources: [
// //     {
// //       resource_name: 'linode-us-123',
// //       resource_id: '12345678',
// //     },
// //     {
// //       resource_name: 'linode-uk-123',
// //       resource_id: '23456789',
// //     },
// //     {
// //       resource_name: 'db-us-southeast1',
// //       resource_id: '456728',
// //     },
// //   ],
// // };

// // const mockUserPermissions = {
// //   resourceType: 'account',
// //   roles: [
// //     {
// //       name: 'accountAdmin',
// //       description:
// //         'Access to perform any supported action on all resources in the account',
// //       permissions: [
// //         'delete_linode',
// //         'initiate_linode_migration',
// //         'update_linode',
// //         'view_linode',
// //         'boot_linode',
// //         'clone_linode',
// //         'upgrade_linode',
// //         'reboot_linode',
// //         'list_linode',
// //         'rebuild_linode',
// //         'rescue_linode',
// //         'reside_linode',
// //         'shutdown_linode',
// //         'password_reset_linode',
// //       ],
// //     },
// //   ],
// // };

// export const UsersLanding = () => {
//   const history = useHistory();
//   const { data: profile } = useProfile();

//   const username = profile?.username;

//   const actions: Action[] = [
//     {
//       onClick: () => {
//         history.push(`/iam/users/${username}/details`);
//       },
//       title: 'View User Details',
//     },
//     {
//       onClick: () => {
//         history.push(`/iam/users/${username}/roles`);
//       },
//       title: 'View User Roles',
//     },
//   ];

//   return (
//     <>
//       <p>Users Table - UIE-8136 </p>

//       <ActionMenu actionsList={actions} ariaLabel={`Action menu for user`} />
//       {/* <Resources userResources={mockUserResources} />
//       <Permissions userPermissions={mockUserPermissions} /> */}
//     </>
//   );
// };

import React from 'react';

import { Box } from 'src/components/Box';
import { Button } from 'src/components/Button/Button';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { useOrder } from 'src/hooks/useOrder';
import { usePagination } from 'src/hooks/usePagination';
import { useAccountUsers } from 'src/queries/account/users';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';

import { UsersLandingTableBody } from '../Users/UsersLandingTableBody';
import { UsersLandingTableHead } from '../Users/UsersLandingTableHead';

import type { Filter } from '@linode/api-v4';
import { Paper } from 'src/components/Paper';

export const UsersLanding = () => {
  const pagination = usePagination(1, 'account-users');
  const order = useOrder();

  const usersFilter: Filter = {
    ['+order']: order.order,
    ['+order_by']: order.orderBy,
  };

  // Since this query is disabled for restricted users, use isLoading.
  const { data: users, error, isLoading } = useAccountUsers({
    filters: usersFilter,
    params: {
      page: pagination.page,
      page_size: pagination.pageSize,
    },
  });

  const numCols = 4;

  const handleDelete = (username: string) => {
    // mock
  };

  const handleSearch = async (value: string) => {
    // mock
  };

  return (
    <React.Fragment>
      <DocumentTitleSegment segment="Users & Grants" />
      <Paper sx={(theme) => ({ marginTop: theme.spacing(2) })}>
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(2),
          })}
        >
          <DebouncedSearchTextField
            clearable
            debounceTime={250}
            hideLabel
            label="Filter"
            onSearch={handleSearch}
            placeholder="Filter"
            value=""
            sx={{ width: 320 }}
          />
          <Button buttonType="primary">Add a User</Button>
        </Box>
        <Table aria-label="List of Users">
          <UsersLandingTableHead order={order} />
          <TableBody>
            <UsersLandingTableBody
              error={error}
              isLoading={isLoading}
              numCols={numCols}
              onDelete={handleDelete}
              users={users?.data}
            />
          </TableBody>
        </Table>
        <PaginationFooter
          count={users?.results || 0}
          eventCategory="users landing"
          handlePageChange={pagination.handlePageChange}
          handleSizeChange={pagination.handlePageSizeChange}
          page={pagination.page}
          pageSize={pagination.pageSize}
        />
      </Paper>
    </React.Fragment>
  );
};
