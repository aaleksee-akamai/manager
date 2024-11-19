import React from 'react';

import { accountUserFactory } from 'src/factories';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { UserDetailsPanel } from './UserDetailsPanel';

describe('UserDetailsPanel', () => {
  it("renders the user's username and email", async () => {
    const user = accountUserFactory.build();
    const assign_roles = {};

    const { getByText } = renderWithTheme(
      <UserDetailsPanel user={user} assignRoles={assign_roles} />
    );

    expect(getByText('Username')).toBeVisible();
    expect(getByText(user.username)).toBeVisible();

    expect(getByText('Email')).toBeVisible();
    expect(getByText(user.email)).toBeVisible();
  });

  it("renders 'no roles assigned' if the user doesn't have the assigned roles", async () => {
    const user = accountUserFactory.build({ restricted: true });
    const assign_roles = {};

    const { getByText } = renderWithTheme(
      <UserDetailsPanel user={user} assignRoles={assign_roles} />
    );

    expect(getByText('Access')).toBeVisible();
    expect(getByText('no roles assigned')).toBeVisible();
  });

  it("renders '5 roles assigned' if the user has 5 different roles", async () => {
    const user = accountUserFactory.build({ restricted: false });
    const assign_roles = {
      account_access: [
        'account_linode_admin',
        'linode_creator',
        'firewall_creator',
      ],
      resource_access: [
        {
          resource_id: 12345678,
          resource_type: 'linode',
          roles: ['linode_contributor', 'linode_creator'],
        },
        {
          resource_id: 45678901,
          resource_type: 'firewall',
          roles: ['firewall_admin', 'firewall_creator'],
        },
      ],
    };

    const { getByText } = renderWithTheme(
      <UserDetailsPanel user={user} assignRoles={assign_roles} />
    );

    expect(getByText('Access')).toBeVisible();
    expect(getByText('5 roles assigned')).toBeVisible();
  });

  it("renders '3 roles assigned' if the user has 3 different roles", async () => {
    const user = accountUserFactory.build({ restricted: false });
    const assign_roles = {
      account_access: [
        'account_linode_admin',
        'linode_creator',
        'linode_contributor',
      ],
      resource_access: [
        {
          resource_id: 12345678,
          resource_type: 'linode',
          roles: ['linode_contributor', 'linode_creator'],
        },
      ],
    };

    const { getByText } = renderWithTheme(
      <UserDetailsPanel user={user} assignRoles={assign_roles} />
    );

    expect(getByText('Access')).toBeVisible();
    expect(getByText('3 roles assigned')).toBeVisible();
  });

  it("renders the user's phone number", async () => {
    const user = accountUserFactory.build({
      verified_phone_number: '+17040000000',
    });
    const assign_roles = {};

    const { getByText } = renderWithTheme(
      <UserDetailsPanel user={user} assignRoles={assign_roles} />
    );

    expect(getByText('Verified Phone Number')).toBeVisible();
    expect(getByText(user.verified_phone_number!)).toBeVisible();
  });

  it("renders the user's 2FA status", async () => {
    const user = accountUserFactory.build({ tfa_enabled: true });
    const assign_roles = {};

    const { getByText } = renderWithTheme(
      <UserDetailsPanel user={user} assignRoles={assign_roles} />
    );

    expect(getByText('2FA')).toBeVisible();
    expect(getByText('Enabled')).toBeVisible();
  });
});
