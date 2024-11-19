import React from 'react';
import { renderWithTheme } from 'src/utilities/testHelpers';
import { PanelHeading } from './PanelHeading';
import { Roles } from '@linode/api-v4/lib/iam/types';

const mockRole: Roles = {
  name: 'linode_contributor',
  description: 'Access to update a linode instance',
  permissions: ['update_linode', 'view_linode'],
};

describe('PanelHeading', () => {
  it('renders with correct text', () => {
    const { getByText } = renderWithTheme(<PanelHeading role={mockRole} />);
    expect(getByText('linode_contributor')).toBeInTheDocument();
    expect(getByText('Access to update a linode instance')).toBeInTheDocument();
  });
});
