import React from 'react';

import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { Typography } from 'src/components/Typography';
import { PARENT_USER } from 'src/features/Account/constants';
import { UsersLandingProxyTableHead } from '../Users/UsersLandingProxyTableHead';
import { UsersLandingTableBody } from '../Users/UsersLandingTableBody';
import { useAccountUsers } from 'src/queries/account/users';
import { Order } from './UsersLandingTableHead';

interface Props {
  order: Order;
  handleDelete: (username: string) => void;
  isRestrictedUser: boolean | undefined;
  isProxyUser: boolean;
}

export const ProxyUserTable = ({
  order,
  handleDelete,
  isRestrictedUser,
  isProxyUser,
}: Props) => {
  const {
    data: proxyUser,
    error: proxyUserError,
    isLoading: isLoadingProxyUser,
  } = useAccountUsers({
    enabled: isProxyUser && !isRestrictedUser,
    filters: { user_type: 'proxy' },
  });

  const proxyNumCols = 3;

  return (
    <>
      <Typography
        sx={(theme) => ({
          marginBottom: theme.spacing(2),
          marginTop: theme.spacing(3),
          textTransform: 'capitalize',
          [theme.breakpoints.down('md')]: {
            marginLeft: theme.spacing(1),
          },
        })}
        variant="h3"
      >
        {PARENT_USER} Settings
      </Typography>

      <Table aria-label="List of Parent Users">
        <UsersLandingProxyTableHead order={order} />
        <TableBody>
          <UsersLandingTableBody
            error={proxyUserError}
            isLoading={isLoadingProxyUser}
            numCols={proxyNumCols}
            onDelete={handleDelete}
            users={proxyUser?.data}
          />
        </TableBody>
      </Table>
    </>
  );
};
