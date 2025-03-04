import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { accountPermissionsFactory } from 'src/factories/accountPermissions';
import { accountResourcesFactory } from 'src/factories/accountResources';
import { userPermissionsFactory } from 'src/factories/userPermissions';
import { renderWithTheme } from 'src/utilities/testHelpers';

import {
  addResourceNamesToRoles,
  AssignedRolesTable,
} from './AssignedRolesTable';
import { IamAccountResource } from '@linode/api-v4';
import { ExtendedRoleMap } from '../utilities';

const queryMocks = vi.hoisted(() => ({
  useAccountPermissions: vi.fn().mockReturnValue({}),
  useAccountResources: vi.fn().mockReturnValue({}),
  useAccountUserPermissions: vi.fn().mockReturnValue({}),
}));

vi.mock('src/queries/iam/iam', async () => {
  const actual = await vi.importActual<any>('src/queries/iam/iam');
  return {
    ...actual,
    useAccountPermissions: queryMocks.useAccountPermissions,
    useAccountUserPermissions: queryMocks.useAccountUserPermissions,
  };
});

vi.mock('src/queries/resources/resources', async () => {
  const actual = await vi.importActual<any>('src/queries/resources/resources');
  return {
    ...actual,
    useAccountResources: queryMocks.useAccountResources,
  };
});

describe('AssignedRolesTable', () => {
  it('should display no roles text if there are no roles assigned to user', async () => {
    queryMocks.useAccountUserPermissions.mockReturnValue({
      data: {},
    });

    const { getByText } = renderWithTheme(<AssignedRolesTable />);

    getByText('No Roles are assigned.');
  });

  it('should display roles and menu when data is available', async () => {
    queryMocks.useAccountUserPermissions.mockReturnValue({
      data: userPermissionsFactory.build(),
    });

    queryMocks.useAccountPermissions.mockReturnValue({
      data: accountPermissionsFactory.build(),
    });

    queryMocks.useAccountResources.mockReturnValue({
      data: accountResourcesFactory.build(),
    });

    const { getAllByLabelText, getAllByText, getByText } = renderWithTheme(
      <AssignedRolesTable />
    );

    expect(getByText('account_linode_admin')).toBeInTheDocument();
    expect(getAllByText('All linodes')[0]).toBeInTheDocument();

    const actionMenuButton = getAllByLabelText('action menu')[0];
    expect(actionMenuButton).toBeInTheDocument();

    fireEvent.click(actionMenuButton);
    expect(getByText('Change Role')).toBeInTheDocument();
    expect(getByText('Unassign Role')).toBeInTheDocument();
  });

  it('should display empty state when no roles match filters', async () => {
    queryMocks.useAccountUserPermissions.mockReturnValue({
      data: userPermissionsFactory.build(),
    });

    queryMocks.useAccountPermissions.mockReturnValue({
      data: accountPermissionsFactory.build(),
    });

    queryMocks.useAccountResources.mockReturnValue({
      data: accountResourcesFactory.build(),
    });

    const { getByPlaceholderText, getByText } = renderWithTheme(
      <AssignedRolesTable />
    );

    const searchInput = getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'NonExistentRole' } });

    await waitFor(() => {
      expect(getByText('No Roles are assigned.')).toBeInTheDocument();
    });
  });

  it('should filter roles based on search query', async () => {
    queryMocks.useAccountUserPermissions.mockReturnValue({
      data: userPermissionsFactory.build(),
    });

    queryMocks.useAccountPermissions.mockReturnValue({
      data: accountPermissionsFactory.build(),
    });

    queryMocks.useAccountResources.mockReturnValue({
      data: accountResourcesFactory.build(),
    });

    const { getByPlaceholderText, queryByText } = renderWithTheme(
      <AssignedRolesTable />
    );

    const searchInput = getByPlaceholderText('Search');
    fireEvent.change(searchInput, {
      target: { value: 'account_linode_admin' },
    });

    await waitFor(() => {
      expect(queryByText('account_linode_admin')).toBeInTheDocument();
    });
  });

  it('should filter roles based on selected resource type', async () => {
    queryMocks.useAccountUserPermissions.mockReturnValue({
      data: userPermissionsFactory.build(),
    });

    queryMocks.useAccountPermissions.mockReturnValue({
      data: accountPermissionsFactory.build(),
    });

    queryMocks.useAccountResources.mockReturnValue({
      data: accountResourcesFactory.build(),
    });

    const { getByPlaceholderText, queryByText } = renderWithTheme(
      <AssignedRolesTable />
    );

    const autocomplete = getByPlaceholderText('All Assigned Roles');
    fireEvent.change(autocomplete, { target: { value: 'Firewall Roles' } });

    await waitFor(() => {
      expect(queryByText('firewall_creator')).toBeInTheDocument();
    });
  });
});

const accountResources: IamAccountResource[] = [
  {
    resource_type: 'linode',
    resources: [
      {
        id: 12345678,
        name: 'debian-us-123',
      },
    ],
  },
  {
    resource_type: 'firewall',
    resources: [
      {
        id: 45678901,
        name: 'firewall-us-123',
      },
    ],
  },
];

describe('addResourceNamesToRoles', () => {
  it('should return an object of users roles', () => {
    const userRoles: ExtendedRoleMap[] = [
      {
        access: 'account',
        description:
          'Access to perform any supported action on all resources in the account',
        id: 'account_admin',
        name: 'account_admin',
        permissions: ['create_linode', 'update_linode', 'update_firewall'],
        resource_ids: null,
        resource_type: 'account',
      },
      {
        access: 'account',
        description:
          'Access to perform any supported action on all linode instances in the account',
        id: 'account_linode_admin',
        name: 'account_linode_admin',
        permissions: ['create_linode', 'update_linode', 'delete_linode'],
        resource_ids: null,
        resource_type: 'linode',
      },
      {
        access: 'resource',
        description: 'Access to update a linode instance',
        id: 'linode_contributor',
        name: 'linode_contributor',
        permissions: ['update_linode', 'view_linode'],
        resource_ids: [12345678],
        resource_type: 'linode',
      },
    ];

    const expectedRoles = [
      {
        access: 'account',
        description:
          'Access to perform any supported action on all resources in the account',
        id: 'account_admin',
        name: 'account_admin',
        permissions: ['create_linode', 'update_linode', 'update_firewall'],
        resource_ids: null,
        resource_names: [],
        resource_type: 'account',
      },
      {
        access: 'account',
        description:
          'Access to perform any supported action on all linode instances in the account',
        id: 'account_linode_admin',
        name: 'account_linode_admin',
        permissions: ['create_linode', 'update_linode', 'delete_linode'],
        resource_ids: null,
        resource_names: [],
        resource_type: 'linode',
      },
      {
        access: 'resource',
        description: 'Access to update a linode instance',
        id: 'linode_contributor',
        name: 'linode_contributor',
        permissions: ['update_linode', 'view_linode'],
        resource_ids: [12345678],
        resource_names: ['debian-us-123'],
        resource_type: 'linode',
      },
    ];

    expect(addResourceNamesToRoles(userRoles, accountResources)).toEqual(
      expectedRoles
    );
  });
});
