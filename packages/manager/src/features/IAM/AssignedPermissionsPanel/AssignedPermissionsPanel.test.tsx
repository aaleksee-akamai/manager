import React from 'react';

import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from 'src/utilities/testHelpers';
import {
  IamAccessType,
  ResourceTypePermissions,
  Roles,
} from '@linode/api-v4/lib/iam/types';
import { IamAccountResource } from '@linode/api-v4/lib/resources/types';
import { AssignedPermissionsPanel } from './AssignedPermissionsPanel';

interface ExtendedRole extends Roles {
  resource_type: ResourceTypePermissions;
  access: IamAccessType;
}

const queryMocks = vi.hoisted(() => ({
  useAccountResources: vi.fn().mockReturnValue({}),
}));

vi.mock('src/queries/resources/resources', async () => {
  const actual = await vi.importActual('src/queries/resources/resources');
  return {
    ...actual,
    useAccountResources: queryMocks.useAccountResources,
  };
});

const mockAccountAcceessRole: ExtendedRole = {
  access: 'account_access',
  description:
    'Access to perform any supported action on all linode instances in the account',
  name: 'account_retail_owner',
  permissions: ['cancel_account'],
  resource_type: 'account',
};

const mockResourcesAcceessRole: ExtendedRole = {
  access: 'resource_access',
  description: 'Access to administer a image instance',
  name: 'image_admin',
  permissions: [
    'create_image',
    'upload_image',
    'list_images',
    'view_image',
    'update_image',
    'delete_image',
  ],
  resource_type: 'image',
};

const mockResources: IamAccountResource[] = [
  {
    resource_type: 'linode',
    resources: [
      {
        name: 'linode-uk-123',
        id: 23456789,
      },
      {
        name: 'db-us-southeast1',
        id: 456728,
      },
    ],
  },
  {
    resource_type: 'image',
    resources: [
      { id: 3, name: 'image-1' },
      { id: 4, name: 'image-2' },
    ],
  },
];

describe('AssignedPermissionsPanel', () => {
  it('renders with the correct context when the access is an account', () => {
    const { getByText } = renderWithTheme(
      <AssignedPermissionsPanel role={mockAccountAcceessRole} />
    );
    expect(
      getByText(
        'Access to perform any supported action on all linode instances in the account'
      )
    ).toBeInTheDocument();
    expect(getByText('cancel_account')).toBeInTheDocument();
    expect(getByText('All account resources')).toBeInTheDocument();
  });

  it('does not render Autocomplete when the access is an account', () => {
    const { getByText, queryAllByRole } = renderWithTheme(
      <AssignedPermissionsPanel role={mockAccountAcceessRole} />
    );
    const autocomplete = queryAllByRole('combobox');

    expect(getByText('Resources')).toBeInTheDocument();
    expect(getByText('All account resources')).toBeInTheDocument();

    // check that the autocomplete doesn't exist
    expect(autocomplete.length).toBe(0);
    expect(autocomplete[0]).toBeUndefined();
  });

  it('renders with the correct context when the access is a resource', () => {
    queryMocks.useAccountResources.mockReturnValue({ data: mockResources });

    const { getByText, getAllByTestId } = renderWithTheme(
      <AssignedPermissionsPanel role={mockResourcesAcceessRole} />
    );

    const chips = getAllByTestId('chip');
    expect(chips).toHaveLength(6);

    expect(
      getByText('Access to administer a image instance')
    ).toBeInTheDocument();
    expect(getByText('create_image')).toBeInTheDocument();
    expect(getByText('Resources')).toBeInTheDocument();
    expect(getByText('image-1')).toBeInTheDocument();
    expect(getByText('image-2')).toBeInTheDocument();
  });

  it('renders the Autocomplete when the access is a resource', () => {
    queryMocks.useAccountResources.mockReturnValue({ data: mockResources });

    const { getAllByRole } = renderWithTheme(
      <AssignedPermissionsPanel role={mockResourcesAcceessRole} />
    );

    // Verify comboboxes exist
    const autocomplete = getAllByRole('combobox');
    expect(autocomplete).toHaveLength(1);
    expect(autocomplete[0]).toBeInTheDocument();
  });

  it('shows all permissions when "Show All" is clicked', () => {
    const { getAllByTestId, getByText, queryByText } = renderWithTheme(
      <AssignedPermissionsPanel role={mockResourcesAcceessRole} />
    );
    // Click the "Show All" button
    const showAllButton = getByText('Show All');
    fireEvent.click(showAllButton);

    // All chips should now be visible
    const visibleChips = getAllByTestId('chip');
    expect(visibleChips.length).toBe(
      mockResourcesAcceessRole.permissions.length
    );
    expect(queryByText('Hide')).toBeInTheDocument();
  });
});
