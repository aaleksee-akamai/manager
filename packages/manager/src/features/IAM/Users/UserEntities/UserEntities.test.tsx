import { fireEvent } from '@testing-library/react';
import React from 'react';

import { accountResourcesFactory } from 'src/factories/accountResources';
import { userPermissionsFactory } from 'src/factories/userPermissions';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { NO_ASSIGNED_ENTITIES_TEXT } from '../../Shared/constants';
import { UserEntities } from './UserEntities';

const queryMocks = vi.hoisted(() => ({
  useAccountResources: vi.fn().mockReturnValue({}),
  useAccountUserPermissions: vi.fn().mockReturnValue({}),
}));

vi.mock('src/queries/iam/iam', async () => {
  const actual = await vi.importActual<any>('src/queries/iam/iam');
  return {
    ...actual,
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

describe('UserEntities', () => {
  it('should display no entities text if there are no roles assigned to user', async () => {
    queryMocks.useAccountUserPermissions.mockReturnValue({
      data: {},
    });

    const { getByText } = renderWithTheme(<UserEntities />);

    expect(getByText('Assigned Entities')).toBeInTheDocument();

    expect(getByText(NO_ASSIGNED_ENTITIES_TEXT)).toBeInTheDocument();
  });

  it('should display entities and menu when data is available', async () => {
    queryMocks.useAccountUserPermissions.mockReturnValue({
      data: userPermissionsFactory.build(),
    });

    queryMocks.useAccountResources.mockReturnValue({
      data: accountResourcesFactory.build(),
    });

    const { getAllByLabelText, getAllByText, getByText } = renderWithTheme(
      <UserEntities />
    );

    expect(getByText('debian-us-123')).toBeInTheDocument();
    expect(getAllByText('Linode')[0]).toBeInTheDocument();
    expect(getAllByText('linode_contributor')[0]).toBeInTheDocument();

    const actionMenuButton = getAllByLabelText('action menu')[0];
    expect(actionMenuButton).toBeInTheDocument();

    fireEvent.click(actionMenuButton);
    expect(getByText('Change Role')).toBeInTheDocument();
    expect(getByText('Remove Assignment')).toBeInTheDocument();
  });
});
