// import React from 'react';

// import { fireEvent } from '@testing-library/react';
// import { renderWithTheme } from 'src/utilities/testHelpers';
// import { Roles } from '@linode/api-v4/lib/iam/types';
// import { IamAccountResource } from '@linode/api-v4/lib/resources/types';
// import { AssignedPermissionsPanel } from './AssignedPermissionsPanel';

// const mockRole: Roles = {
//   name: 'linode_contributor',
//   description: 'Access to update a linode instance',
//   permissions: ['update_linode', 'view_linode'],
// };

// const mockResources: IamAccountResource = {
//   resource_type: 'linode',
//   resources: [
//     {
//       name: 'linode-uk-123',
//       id: 23456789,
//     },
//     {
//       name: 'db-us-southeast1',
//       id: 456728,
//     },
//   ],
// };

// const mockOnClick = vi.fn();

// describe('AssignedPermissionsPanel', () => {
//   it('renders the PanelHeading with the correct role name and description', () => {
//     const { getByText } = renderWithTheme(
//       <AssignedPermissionsPanel
//         selectedRoleType={'resource'}
//         role={mockRole}
//         accountResources={mockResources}
//         onClick={mockOnClick}
//       />
//     );
//     expect(getByText('linode_contributor')).toBeInTheDocument();
//     expect(getByText('Access to update a linode instance')).toBeInTheDocument();
//   });

//   it('renders the Permissions component with correct permissions', () => {
//     const { getByText } = renderWithTheme(
//       <AssignedPermissionsPanel
//         selectedRoleType={'resource'}
//         role={mockRole}
//         accountResources={mockResources}
//         onClick={mockOnClick}
//       />
//     );

//     expect(getByText('update_linode')).toBeInTheDocument();
//     expect(getByText('view_linode')).toBeInTheDocument();
//   });

//   it('renders the Resources component when selectedRole is "resource"', () => {
//     const { getByText, getAllByRole } = renderWithTheme(
//       <AssignedPermissionsPanel
//         selectedRoleType={'resource'}
//         role={mockRole}
//         accountResources={mockResources}
//         onClick={mockOnClick}
//       />
//     );

//     const autocomplete = getAllByRole('combobox')[0];
//     fireEvent.focus(autocomplete);
//     fireEvent.mouseDown(autocomplete);
//     expect(getByText('linode-uk-123')).toBeInTheDocument();
//     expect(getByText('db-us-southeast1')).toBeInTheDocument();
//   });

//   it('renders the Resources component when selectedRole is "account"', () => {
//     const { queryByText, queryByTestId } = renderWithTheme(
//       <AssignedPermissionsPanel
//         selectedRoleType={'account'}
//         role={mockRole}
//         onClick={mockOnClick}
//       />
//     );

//     expect(queryByText('Resources')).not.toBeInTheDocument();
//     expect(queryByText('(required)')).not.toBeInTheDocument();
//     expect(queryByTestId('textfield-input')).not.toBeInTheDocument();
//   });
// });
