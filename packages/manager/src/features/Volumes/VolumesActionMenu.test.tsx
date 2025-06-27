import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as React from 'react';

import { volumeFactory } from 'src/factories';
import { renderWithThemeAndRouter } from 'src/utilities/testHelpers';

import { VolumesActionMenu } from './VolumesActionMenu';

import type { Props } from './VolumesActionMenu';

const volume = volumeFactory.build({ linode_id: null, linode_label: null });

const props: Props = {
  handlers: {
    handleAttach: vi.fn(),
    handleClone: vi.fn(),
    handleDelete: vi.fn(),
    handleDetach: vi.fn(),
    handleDetails: vi.fn(),
    handleEdit: vi.fn(),
    handleManageTags: vi.fn(),
    handleResize: vi.fn(),
    handleUpgrade: vi.fn(),
  },
  isVolumesLanding: true,
  volume,
};

const queryMocks = vi.hoisted(() => ({
  userPermissions: vi.fn(() => ({
    permissions: {
      update_volume: false,
      resize_volume: false,
      clone_volume: false,
      detach_volume: false,
      delete_volume: false,
      attach_volume: false,
    },
  })),
}));

vi.mock('src/features/IAM/hooks/usePermissions', () => ({
  usePermissions: queryMocks.userPermissions,
}));

describe('VolumesActionMenu', () => {
  it('should include basic Volume actions', async () => {
    const { getByLabelText, getByText } = await renderWithThemeAndRouter(
      <VolumesActionMenu {...props} />
    );

    const actionMenuButton = getByLabelText(
      `Action menu for Volume ${volume.label}`
    );

    await userEvent.click(actionMenuButton);

    for (const action of ['Show Config', 'Edit']) {
      expect(getByText(action)).toBeVisible();
    }
  });

  it('should include Attach if the Volume is not attached and disable if user does not have attach_volume permission', async () => {
    const { getByLabelText, getByText, queryByText } =
      await renderWithThemeAndRouter(
        <VolumesActionMenu {...props} isVolumesLanding={true} />
      );

    const actionMenuButton = getByLabelText(
      `Action menu for Volume ${volume.label}`
    );

    await userEvent.click(actionMenuButton);

    expect(getByText('Attach')).toBeVisible();
    expect(queryByText('Detach')).toBeNull();

    const attachBtn = screen.getByTestId('Attach');
    expect(attachBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('should include Detach if the Volume is attached and disable if user does not have detach_volume permissions', async () => {
    const attachedVolune = volumeFactory.build({
      linode_id: 2,
      linode_label: 'linode-2',
    });

    const { getByLabelText, getByText, queryByText } =
      await renderWithThemeAndRouter(
        <VolumesActionMenu {...props} volume={attachedVolune} />
      );

    const actionMenuButton = getByLabelText(
      `Action menu for Volume ${attachedVolune.label}`
    );

    await userEvent.click(actionMenuButton);

    expect(getByText('Detach')).toBeVisible();
    expect(queryByText('Attach')).toBeNull();

    const dettachBtn = screen.getByTestId('Detach');
    expect(dettachBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('should include Delete', async () => {
    const { getByLabelText, getByText } = await renderWithThemeAndRouter(
      <VolumesActionMenu {...props} />
    );

    const actionMenuButton = getByLabelText(
      `Action menu for Volume ${volume.label}`
    );

    await userEvent.click(actionMenuButton);

    expect(getByText('Delete')).toBeVisible();
  });

  it('should disable all actions menu if the user does not have permissions', async () => {
    renderWithThemeAndRouter(<VolumesActionMenu {...props} />);

    const actionMenuButton = screen.getByLabelText(
      `Action menu for Volume ${volume.label}`
    );

    await userEvent.click(actionMenuButton);

    const editBtn = screen.getByTestId('Edit');
    expect(editBtn).toHaveAttribute('aria-disabled', 'true');

    const manageTagsBtn = screen.getByTestId('Manage Tags');
    expect(manageTagsBtn).toHaveAttribute('aria-disabled', 'true');

    const resizeBtn = screen.getByTestId('Resize');
    expect(resizeBtn).toHaveAttribute('aria-disabled', 'true');

    const cloneBtn = screen.getByTestId('Clone');
    expect(cloneBtn).toHaveAttribute('aria-disabled', 'true');

    const deleteBtn = screen.getByTestId('Delete');
    expect(deleteBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('should include Attach if the Volume is not attached and enable if user has attach_volume permission', async () => {
    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        ...queryMocks.userPermissions().permissions,
        attach_volume: true,
      },
    });
    const { getByLabelText, getByText, queryByText } =
      await renderWithThemeAndRouter(
        <VolumesActionMenu {...props} isVolumesLanding={true} />
      );

    const actionMenuButton = getByLabelText(
      `Action menu for Volume ${volume.label}`
    );

    await userEvent.click(actionMenuButton);

    expect(getByText('Attach')).toBeVisible();
    expect(queryByText('Detach')).toBeNull();

    const attachBtn = screen.getByTestId('Attach');
    expect(attachBtn).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('should include Detach if the Volume is attached and enable if user has detach_volume permissions', async () => {
    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        ...queryMocks.userPermissions().permissions,
        detach_volume: true,
      },
    });

    const attachedVolune = volumeFactory.build({
      linode_id: 2,
      linode_label: 'linode-2',
    });

    const { getByLabelText, getByText, queryByText } =
      await renderWithThemeAndRouter(
        <VolumesActionMenu {...props} volume={attachedVolune} />
      );

    const actionMenuButton = getByLabelText(
      `Action menu for Volume ${attachedVolune.label}`
    );

    await userEvent.click(actionMenuButton);

    expect(getByText('Detach')).toBeVisible();
    expect(queryByText('Attach')).toBeNull();

    const dettachBtn = screen.getByTestId('Detach');
    expect(dettachBtn).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('should enable all actions menu if the user does not have permissions', async () => {
    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        update_volume: true,
        resize_volume: true,
        clone_volume: true,
        detach_volume: true,
        delete_volume: true,
        attach_volume: true,
      },
    });
    renderWithThemeAndRouter(<VolumesActionMenu {...props} />);

    const actionMenuButton = screen.getByLabelText(
      `Action menu for Volume ${volume.label}`
    );

    await userEvent.click(actionMenuButton);

    const editBtn = screen.getByTestId('Edit');
    expect(editBtn).not.toHaveAttribute('aria-disabled', 'true');

    const manageTagsBtn = screen.getByTestId('Manage Tags');
    expect(manageTagsBtn).not.toHaveAttribute('aria-disabled', 'true');

    const resizeBtn = screen.getByTestId('Resize');
    expect(resizeBtn).not.toHaveAttribute('aria-disabled', 'true');

    const cloneBtn = screen.getByTestId('Clone');
    expect(cloneBtn).not.toHaveAttribute('aria-disabled', 'true');

    const deleteBtn = screen.getByTestId('Delete');
    expect(deleteBtn).not.toHaveAttribute('aria-disabled', 'true');
  });
});
