import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { usePermissions } from 'src/features/IAM/hooks/usePermissions';

import type { Disk, Linode } from '@linode/api-v4';
import type { Action } from 'src/components/ActionMenu/ActionMenu';

interface Props {
  disk: Disk;
  linodeId: number;
  linodeStatus: Linode['status'];
  onDelete: () => void;
  onRename: () => void;
  onResize: () => void;
  // readOnly?: boolean;
}

export const LinodeDiskActionMenu = (props: Props) => {
  const history = useHistory();

  const {
    disk,
    linodeId,
    linodeStatus,
    onDelete,
    onRename,
    onResize,
    // readOnly,
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const poweredOnTooltip =
    linodeStatus !== 'offline'
      ? 'Your Linode must be fully powered down in order to perform this action'
      : undefined;

  const swapTooltip =
    disk.filesystem == 'swap'
      ? 'You cannot create images from Swap images.'
      : undefined;

  const { permissions: accountPermissions } = usePermissions('account', [
    'create_image',
  ]);

  const { permissions } = usePermissions(
    'linode',
    [
      'update_linode_disk',
      'resize_linode_disk',
      'delete_linode_disk',
      'clone_linode',
    ],
    linodeId,
    isOpen
  );

  const actions: Action[] = [
    {
      // disabled: readOnly,
      disabled: !permissions.update_linode_disk,
      onClick: onRename,
      title: 'Rename',
    },
    {
      // disabled: linodeStatus !== 'offline' || readOnly,
      disabled: !permissions.resize_linode_disk || linodeStatus !== 'offline',
      onClick: onResize,
      title: 'Resize',
      tooltip: poweredOnTooltip,
    },
    {
      // disabled: readOnly || !!swapTooltip,
      disabled: !accountPermissions.create_image || !!swapTooltip,
      onClick: () =>
        history.push(
          `/images/create/disk?selectedLinode=${linodeId}&selectedDisk=${disk.id}`
        ),
      title: 'Create Disk Image', // - create_image account access
      tooltip: swapTooltip,
    },
    {
      // disabled: readOnly,
      disabled: !permissions.clone_linode,
      onClick: () => {
        history.push(
          `/linodes/${linodeId}/clone/disks?selectedDisk=${disk.id}`
        );
      },
      title: 'Clone', // - clone_linode
    },
    {
      // disabled: linodeStatus !== 'offline' || readOnly,
      disabled: !permissions.delete_linode_disk || linodeStatus !== 'offline',
      onClick: onDelete,
      title: 'Delete',
      tooltip: poweredOnTooltip,
    },
  ];

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <ActionMenu
      actionsList={actions}
      ariaLabel={`Action menu for Disk ${disk.label}`}
      onOpen={handleOpen}
    />
  );
};
