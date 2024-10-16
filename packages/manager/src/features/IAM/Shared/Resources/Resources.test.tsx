import React from 'react';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { Resources } from './Resources';
import { IamAccountResource } from '@linode/api-v4/lib/resources/types';

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

const mockAccountAcceessRole: any = {
  access: 'account_access',
  description:
    'Access to perform any supported action on all linode instances in the account',
  name: 'account_retail_owner',
  permissions: ['cancel_account'],
  resource_type: 'account',
};

const mockResourcesAcceessRole: any = {
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

describe('Resources', () => {
  it('renders correct data when it is an account access', () => {
    const { getByText, queryAllByRole } = renderWithTheme(
      <Resources role={mockAccountAcceessRole} />
    );

    const autocomplete = queryAllByRole('combobox');

    expect(getByText('Resources')).toBeInTheDocument();
    expect(getByText('All account resources')).toBeInTheDocument();

    // check that the autocomplete doesn't exist
    expect(autocomplete.length).toBe(0);
    expect(autocomplete[0]).toBeUndefined();
  });

  it('renders correct data when it is a resources access', () => {
    queryMocks.useAccountResources.mockReturnValue({ data: mockResources });

    const { getByText, getAllByRole } = renderWithTheme(
      <Resources role={mockResourcesAcceessRole} />
    );

    expect(getByText('Resources')).toBeInTheDocument();

    // Verify comboboxes exist
    const autocomplete = getAllByRole('combobox');
    expect(autocomplete).toHaveLength(1);
    expect(autocomplete[0]).toBeInTheDocument();

    expect(getByText('image-1')).toBeInTheDocument();
    expect(getByText('image-2')).toBeInTheDocument();
  });
});
