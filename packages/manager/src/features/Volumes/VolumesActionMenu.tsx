import * as React from 'react';
import { useState } from 'react';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { getRestrictedResourceText } from 'src/features/Account/utils';
import { useIsResourceRestricted } from 'src/hooks/useIsResourceRestricted';

import { usePermissions } from '../IAM/hooks/usePermissions';

import type { Volume } from '@linode/api-v4';
import type { Action } from 'src/components/ActionMenu/ActionMenu';

export interface ActionHandlers {
  handleAttach: () => void;
  handleClone: () => void;
  handleDelete: () => void;
  handleDetach: () => void;
  handleDetails: () => void;
  handleEdit: () => void;
  handleManageTags: () => void;
  handleResize: () => void;
  handleUpgrade: () => void;
}

export interface Props {
  handlers: ActionHandlers;
  isVolumesLanding: boolean;
  volume: Volume;
}

export const VolumesActionMenu = (props: Props) => {
  const { handlers, isVolumesLanding, volume } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const attached = volume.linode_id !== null;

  const isVolumeReadOnly = useIsResourceRestricted({
    grantLevel: 'read_only',
    grantType: 'volume',
    id: volume.id,
  });

  const { permissions } = usePermissions(
    'volume',
    [
      'update_volume',
      'resize_volume',
      'clone_volume',
      'detach_volume',
      'delete_volume',
      'attach_volume',
    ],
    volume.id,
    isOpen
  );

  const actions: Action[] = [
    {
      onClick: handlers.handleDetails,
      title: 'Show Config',
    },
    {
      // disabled: isVolumeReadOnly,
      disabled: !permissions.update_volume,
      onClick: handlers.handleEdit,
      title: 'Edit',
      tooltip: isVolumeReadOnly
        ? getRestrictedResourceText({
            action: 'edit',
            isSingular: true,
            resourceType: 'Volumes',
          })
        : undefined,
    },
    {
      // disabled: isVolumeReadOnly,
      disabled: !permissions.update_volume,
      onClick: handlers.handleManageTags,
      title: 'Manage Tags',
    },
    {
      // disabled: isVolumeReadOnly,
      disabled: !permissions.resize_volume,
      onClick: handlers.handleResize,
      title: 'Resize',
      tooltip: isVolumeReadOnly
        ? getRestrictedResourceText({
            action: 'resize',
            isSingular: true,
            resourceType: 'Volumes',
          })
        : undefined,
    },
    {
      // disabled: isVolumeReadOnly,
      disabled: !permissions.clone_volume,
      onClick: handlers.handleClone,
      title: 'Clone',
      tooltip: isVolumeReadOnly
        ? getRestrictedResourceText({
            action: 'clone',
            isSingular: true,
            resourceType: 'Volumes',
          })
        : undefined,
    },
  ];

  if (!attached && isVolumesLanding) {
    actions.push({
      // disabled: isVolumeReadOnly,
      disabled: !permissions.attach_volume,
      onClick: handlers.handleAttach,
      title: 'Attach',
      tooltip: isVolumeReadOnly
        ? getRestrictedResourceText({
            action: 'attach',
            isSingular: true,
            resourceType: 'Volumes',
          })
        : undefined,
    });
  } else {
    actions.push({
      // disabled: isVolumeReadOnly,
      disabled: !permissions.detach_volume,
      onClick: handlers.handleDetach,
      title: 'Detach',
      tooltip: isVolumeReadOnly
        ? getRestrictedResourceText({
            action: 'detach',
            isSingular: true,
            resourceType: 'Volumes',
          })
        : undefined,
    });
  }

  actions.push({
    // disabled: isVolumeReadOnly || attached,
    disabled: !permissions.delete_volume || attached,
    onClick: handlers.handleDelete,
    title: 'Delete',
    tooltip: isVolumeReadOnly
      ? getRestrictedResourceText({
          action: 'delete',
          isSingular: true,
          resourceType: 'Volumes',
        })
      : attached
        ? 'Your volume must be detached before it can be deleted.'
        : undefined,
  });

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <ActionMenu
      actionsList={actions}
      ariaLabel={`Action menu for Volume ${volume.label}`}
      onOpen={handleOpen}
    />
  );
};
