// import { Factory } from '@linode/utilities';

import { PermissionType } from "@linode/api-v4";

// import type { PermissionType } from '@linode/api-v4';

// export const userEntityPermissionsFactory = Factory.Sync.makeFactory<
//   PermissionType[]
// >(['reboot_linode', 'view_linode']);
export const userEntityPermissionsFactory: PermissionType[] = ['reboot_linode', 'view_linode'];