import React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';

import { Permissions } from './Permissions';

const mockUserPermissions = {
  resourceType: 'account',
  roles: [
    {
      name: 'accountAdmin',
      description:
        'Access to perform any supported action on all resources in the account',
      permissions: [
        'delete_linode',
        'initiate_linode_migration',
        'update_linode',
      ],
    },
  ],
};

describe('Permissions', () => {
  it('renders the correct number of permission chips', () => {
    const { getAllByTestId } = renderWithTheme(
      <Permissions userPermissions={mockUserPermissions} />
    );

    const chips = getAllByTestId('chip');
    expect(chips).toHaveLength(3);
  });

  it('displays the correct permission labels', () => {
    const { getByText } = renderWithTheme(
      <Permissions userPermissions={mockUserPermissions} />
    );

    expect(getByText('delete_linode')).toBeInTheDocument();
    expect(getByText('initiate_linode_migration')).toBeInTheDocument();
    expect(getByText('update_linode')).toBeInTheDocument();
  });
});
