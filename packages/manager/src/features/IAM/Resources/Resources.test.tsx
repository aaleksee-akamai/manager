import React from 'react';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { Resources } from './Resources';
import { fireEvent } from '@testing-library/react';
import { IamAccountResource } from '@linode/api-v4/lib/resources/types';

const mockUserResources: IamAccountResource = {
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
};

describe('Resources', () => {
  it('renders header with correct text', () => {
    const { getByText } = renderWithTheme(
      <Resources userResources={mockUserResources} />
    );
    expect(getByText('Resources')).toBeInTheDocument();
    expect(getByText('(required)')).toBeInTheDocument();
  });

  it('renders Autocomplete component with correct placeholder', () => {
    const { getAllByRole } = renderWithTheme(
      <Resources userResources={mockUserResources} />
    );

    const autocomplete = getAllByRole('combobox')[0];
    expect(autocomplete).toHaveAttribute('placeholder', 'Select Linodes');
  });

  it('updates selected options when Autocomplete value changes', () => {
    const { getByText, getAllByRole } = renderWithTheme(
      <Resources userResources={mockUserResources} />
    );
    const autocomplete = getAllByRole('combobox')[0];
    fireEvent.change(autocomplete, { target: { value: 'linode-uk-123' } });
    fireEvent.keyDown(autocomplete, { key: 'Enter' });
    expect(getByText('linode-uk-123')).toBeInTheDocument();
  });

  it('renders correct options in Autocomplete dropdown', () => {
    const { getByText, getAllByRole } = renderWithTheme(
      <Resources userResources={mockUserResources} />
    );
    const autocomplete = getAllByRole('combobox')[0];
    fireEvent.focus(autocomplete);
    fireEvent.mouseDown(autocomplete);
    expect(getByText('linode-uk-123')).toBeInTheDocument();
    expect(getByText('db-us-southeast1')).toBeInTheDocument();
  });
});
