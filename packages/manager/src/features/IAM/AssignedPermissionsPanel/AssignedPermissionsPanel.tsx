import * as React from 'react';

import { PanelHeading } from './PanelHeading';
import { Resources } from '../Resources/Resources';
import { Permissions } from '../Permissions/Permissions';
import { Roles } from '@linode/api-v4/lib/iam/types';
import { Accordion } from './Accordion';
import { IamAccountResource } from '@linode/api-v4/lib/resources/types';

type Props = {
  role: Roles;
  selectedRoleType: 'account' | 'resource' | 'all_roles';
  accountResources?: IamAccountResource | undefined;
  onClick: () => void;
};

export const AssignedPermissionsPanel = ({
  role,
  selectedRoleType,
  accountResources,
  onClick,
}: Props) => {
  return (
    <Accordion
      defaultExpanded={true}
      heading={<PanelHeading role={role} />}
      onClose={onClick}
      sx={{ backgroundColor: '#F4F5F6' }}
    >
      <Permissions userPermissions={role} />
      {selectedRoleType === 'resource' && accountResources && (
        <Resources userResources={accountResources} />
      )}
    </Accordion>
  );
};
