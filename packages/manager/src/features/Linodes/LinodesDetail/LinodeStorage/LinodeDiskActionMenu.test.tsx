import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { linodeDiskFactory } from 'src/factories';
import { mockMatchMedia, renderWithTheme } from 'src/utilities/testHelpers';

import { LinodeDiskActionMenu } from './LinodeDiskActionMenu';

const mockHistory = {
  push: vi.fn(),
};

// Mock useHistory
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useHistory: vi.fn(() => mockHistory),
  };
});

const queryMocks = vi.hoisted(() => ({
  userPermissions: vi.fn(() => ({
    permissions: {
      update_linode_disk: false,
      resize_linode_disk: false,
      delete_linode_disk: false,
      clone_linode: false,
      create_image: false,
    },
  })),
}));

vi.mock('src/features/IAM/hooks/usePermissions', () => ({
  usePermissions: queryMocks.userPermissions,
}));

const defaultProps = {
  disk: linodeDiskFactory.build(),
  linodeId: 0,
  linodeStatus: 'running' as const,
  onDelete: vi.fn(),
  onRename: vi.fn(),
  onResize: vi.fn(),
};

describe('LinodeDiskActionMenu', () => {
  beforeEach(() => mockMatchMedia());

  it('should contain all basic actions when the Linode is running', async () => {
    const { getByLabelText, getByText } = renderWithTheme(
      <LinodeDiskActionMenu {...defaultProps} />
    );

    const actionMenuButton = getByLabelText(
      `Action menu for Disk ${defaultProps.disk.label}`
    );

    await userEvent.click(actionMenuButton);

    const actions = [
      'Rename',
      'Resize',
      'Create Disk Image',
      'Clone',
      'Delete',
    ];

    for (const action of actions) {
      expect(getByText(action)).toBeVisible();
    }
  });

  it('should allow performing actions', async () => {
    const { getByText } = renderWithTheme(
      <LinodeDiskActionMenu {...defaultProps} linodeStatus="offline" />
    );

    const actionBtn = screen.getByRole('button');
    expect(actionBtn).toBeInTheDocument();
    await userEvent.click(actionBtn);

    expect(getByText('Rename')).toBeVisible();
    expect(getByText('Resize')).toBeVisible();
    expect(getByText('Delete')).toBeVisible();
    expect(getByText('Create Disk Image')).toBeVisible();
    expect(getByText('Clone')).toBeVisible();
  });

  it('Create Disk Image should redirect to image create tab', async () => {
    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        ...queryMocks.userPermissions().permissions,
        create_image: true,
      },
    });

    const { getByLabelText, getByText } = renderWithTheme(
      <LinodeDiskActionMenu {...defaultProps} />
    );

    const actionMenuButton = getByLabelText(
      `Action menu for Disk ${defaultProps.disk.label}`
    );

    await userEvent.click(actionMenuButton);

    await userEvent.click(getByText('Create Disk Image'));

    expect(mockHistory.push).toHaveBeenCalledWith(
      `/images/create/disk?selectedLinode=${defaultProps.linodeId}&selectedDisk=${defaultProps.disk.id}`
    );
  });

  it('Clone should redirect to clone page', async () => {
    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        ...queryMocks.userPermissions().permissions,
        clone_linode: true,
      },
    });

    const { getByLabelText, getByText } = renderWithTheme(
      <LinodeDiskActionMenu {...defaultProps} />
    );

    const actionMenuButton = getByLabelText(
      `Action menu for Disk ${defaultProps.disk.label}`
    );

    await userEvent.click(actionMenuButton);

    await userEvent.click(getByText('Clone'));

    expect(mockHistory.push).toHaveBeenCalledWith(
      `/linodes/${defaultProps.linodeId}/clone/disks?selectedDisk=${defaultProps.disk.id}`
    );
  });

  it('should disable Resize and Delete when the Linode is running', async () => {
    const { getAllByLabelText, getByLabelText } = renderWithTheme(
      <LinodeDiskActionMenu {...defaultProps} />
    );

    const actionMenuButton = getByLabelText(
      `Action menu for Disk ${defaultProps.disk.label}`
    );

    await userEvent.click(actionMenuButton);

    expect(
      getAllByLabelText(
        'Your Linode must be fully powered down in order to perform this action'
      )
    ).toHaveLength(2);
  });

  it('should disable Create Disk Image when the disk is a swap image', async () => {
    const disk = linodeDiskFactory.build({ filesystem: 'swap' });
    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        ...queryMocks.userPermissions().permissions,
        create_image: true,
      },
    });

    const { getByLabelText } = renderWithTheme(
      <LinodeDiskActionMenu {...defaultProps} disk={disk} />
    );

    const actionMenuButton = getByLabelText(
      `Action menu for Disk ${disk.label}`
    );

    await userEvent.click(actionMenuButton);

    const tooltip = getByLabelText(
      'You cannot create images from Swap images.'
    );
    expect(tooltip).toBeInTheDocument();
    fireEvent.click(tooltip);
    expect(tooltip).toBeVisible();
  });

  it('should disable all actions menu if the user does not have permissions', async () => {
    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        update_linode_disk: false,
        resize_linode_disk: false,
        delete_linode_disk: false,
        clone_linode: false,
        create_image: false,
      },
    });
    const { getByLabelText } = renderWithTheme(
      <LinodeDiskActionMenu {...defaultProps} />
    );

    const actionMenuButton = getByLabelText(
      `Action menu for Disk ${defaultProps.disk.label}`
    );

    await userEvent.click(actionMenuButton);

    const renameBtn = screen.getByTestId('Rename');
    expect(renameBtn).toHaveAttribute('aria-disabled', 'true');

    const resizeBtn = screen.getByTestId('Resize');
    expect(resizeBtn).toHaveAttribute('aria-disabled', 'true');

    const createDiskImgeBtn = screen.getByTestId('Create Disk Image');
    expect(createDiskImgeBtn).toHaveAttribute('aria-disabled', 'true');

    const cloneBtn = screen.getByTestId('Clone');
    expect(cloneBtn).toHaveAttribute('aria-disabled', 'true');

    const deleteBtn = screen.getByTestId('Delete');
    expect(deleteBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('should enable all actions menu if the user has permissions', async () => {
    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        update_linode_disk: true,
        resize_linode_disk: true,
        delete_linode_disk: true,
        clone_linode: true,
        create_image: true,
      },
    });

    const { getByLabelText } = renderWithTheme(
      <LinodeDiskActionMenu {...defaultProps} linodeStatus="offline" />
    );

    const actionMenuButton = getByLabelText(
      `Action menu for Disk ${defaultProps.disk.label}`
    );

    await userEvent.click(actionMenuButton);

    const renameBtn = screen.getByTestId('Rename');
    expect(renameBtn).not.toHaveAttribute('aria-disabled', 'true');

    const resizeBtn = screen.getByTestId('Resize');
    expect(resizeBtn).not.toHaveAttribute('aria-disabled', 'true');

    const createDiskImgeBtn = screen.getByTestId('Create Disk Image');
    expect(createDiskImgeBtn).not.toHaveAttribute('aria-disabled', 'true');

    const cloneBtn = screen.getByTestId('Clone');
    expect(cloneBtn).not.toHaveAttribute('aria-disabled', 'true');

    const deleteBtn = screen.getByTestId('Delete');
    expect(deleteBtn).not.toHaveAttribute('aria-disabled', 'true');
  });
});
