import React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';

import { Permissions } from './Permissions';
import { fireEvent } from '@testing-library/react';
import {
  IamAccessType,
  ResourceTypePermissions,
  Roles,
} from '@linode/api-v4/lib/iam/types';
interface ExtendedRole extends Roles {
  resource_type: ResourceTypePermissions;
  access: IamAccessType;
}

const mockAccountAcceessRole: ExtendedRole = {
  access: 'account_access',
  description:
    'Access to perform any supported action on all linode instances in the account',
  name: 'account_retail_owner',
  permissions: ['cancel_account'],
  resource_type: 'account',
};

const mockAccountAcceessRoleLong: ExtendedRole = {
  access: 'account_access',
  description:
    'Access to perform any supported action on all linode instances in the account',
  name: 'account_retail_owner',
  permissions: [
    'list_payments',
    'list_invoices',
    'list_payment_methods',
    'view_invoice',
    'list_invoice_items',
    'view_payment_method',
    'view_payment',
  ],
  resource_type: 'account',
};

describe('Permissions', () => {
  it('renders the correct number of permission chips', () => {
    const { getAllByTestId, getByText } = renderWithTheme(
      <Permissions role={mockAccountAcceessRole} />
    );

    const chips = getAllByTestId('chip');
    expect(chips).toHaveLength(1);

    expect(getByText('cancel_account')).toBeInTheDocument();
  });

  it('renders only visible chips based on available space', () => {
    const { getAllByTestId, getByText, queryByText } = renderWithTheme(
      <Permissions role={mockAccountAcceessRoleLong} />
    );

    // Mock the container's width to 390px
    const container = getByText('Permissions').parentElement;
    if (container) {
      Object.defineProperty(container, 'offsetWidth', {
        value: 390,
        writable: true,
      });
    }

    const visibleChips = getAllByTestId('chip');
    expect(visibleChips.length).toBeLessThanOrEqual(
      mockAccountAcceessRoleLong.permissions.length
    );
    expect(getByText('Show All')).toBeInTheDocument();
    // Verify the "+X |" indicator is rendered
    expect(queryByText(/\+\d+\s\|/)).toBeInTheDocument(); // Matches "+X |"
  });

  it('shows all permissions when "Show All" is clicked', () => {
    const { getAllByTestId, getByText, queryByText } = renderWithTheme(
      <Permissions role={mockAccountAcceessRoleLong} />
    );
    // Click the "Show All" button
    const showAllButton = getByText('Show All');
    fireEvent.click(showAllButton);

    // All chips should now be visible
    const visibleChips = getAllByTestId('chip');
    expect(visibleChips.length).toBe(
      mockAccountAcceessRoleLong.permissions.length
    );
    expect(queryByText('Hide')).toBeInTheDocument();
  });

  it('renders all chips when it is outside the drawer', () => {
    const { getAllByTestId, getByText } = renderWithTheme(
      <Permissions role={mockAccountAcceessRoleLong} />
    );

    // Mock the container's width to 800px
    const container = getByText('Permissions').parentElement;
    if (container) {
      Object.defineProperty(container, 'offsetWidth', {
        value: 800,
        writable: true,
      });
    }

    const allChips = getAllByTestId('chip');
    expect(allChips.length).toBe(mockAccountAcceessRoleLong.permissions.length);
  });
});
