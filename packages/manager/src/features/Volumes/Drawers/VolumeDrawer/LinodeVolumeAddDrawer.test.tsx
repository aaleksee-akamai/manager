import { linodeFactory } from '@linode/utilities';
import { waitFor } from '@testing-library/react';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as React from 'react';

import { accountFactory } from 'src/factories';
import { http, HttpResponse, server } from 'src/mocks/testServer';
import { renderWithThemeAndRouter } from 'src/utilities/testHelpers';

import { LinodeVolumeAddDrawer } from './LinodeVolumeAddDrawer';

const accountEndpoint = '*/v4/account';
const encryptionLabelText = 'Encrypt Volume';

const queryMocks = vi.hoisted(() => ({
  userPermissions: vi.fn(() => ({
    permissions: {
      attach_volume: false,
      create_volume: false,
    },
  })),
}));

vi.mock('src/features/IAM/hooks/usePermissions', () => ({
  usePermissions: queryMocks.userPermissions,
}));

describe('LinodeVolumeAddDrawer', () => {
  /* @TODO BSE: Remove feature flagging/conditionality once BSE is fully rolled out */

  it('should display a "Volume Encryption" section if the user has the account capability and the feature flag is on', async () => {
    const linode = linodeFactory.build();

    server.use(
      http.get(accountEndpoint, () => {
        return HttpResponse.json(
          accountFactory.build({ capabilities: ['Block Storage Encryption'] })
        );
      })
    );

    const { getByLabelText } = await renderWithThemeAndRouter(
      <LinodeVolumeAddDrawer
        linode={linode}
        onClose={vi.fn}
        open
        openDetails={() => vi.fn}
      />,
      {
        flags: { blockStorageEncryption: true },
      }
    );

    await waitFor(() => {
      expect(getByLabelText(encryptionLabelText)).not.toBeNull();
    });
  });

  it('should disable "Attach Volume" if user does not have attach_volume permission', async () => {
    const linode = linodeFactory.build();

    renderWithThemeAndRouter(
      <LinodeVolumeAddDrawer
        linode={linode}
        onClose={vi.fn}
        open
        openDetails={() => vi.fn}
      />
    );

    const attachModeButton = screen.getByText('Attach Existing Volume');
    await userEvent.click(attachModeButton);

    const btn = screen.getByText('Attach Volume');
    expect(btn).toBeVisible();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('should enable "Attach Volume" if user has attach_volume permission', async () => {
    const linode = linodeFactory.build();

    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        attach_volume: true,
        create_volume: false,
      },
    });

    renderWithThemeAndRouter(
      <LinodeVolumeAddDrawer
        linode={linode}
        onClose={vi.fn}
        open
        openDetails={() => vi.fn}
      />
    );

    const attachModeButton = screen.getByText('Attach Existing Volume');
    await userEvent.click(attachModeButton);

    const btn = screen.getByText('Attach Volume');
    expect(btn).toBeVisible();
    expect(btn).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable "Create Volume" if user does not have create_volume permission', async () => {
    const linode = linodeFactory.build();

    renderWithThemeAndRouter(
      <LinodeVolumeAddDrawer
        linode={linode}
        onClose={vi.fn}
        open
        openDetails={() => vi.fn}
      />
    );

    const attachModeButton = screen.getByText('Create and Attach Volume');
    await userEvent.click(attachModeButton);

    const btn = screen.getByText('Create Volume');
    expect(btn).toBeVisible();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('should enable "Create Volume" if user has create_volume permission', async () => {
    const linode = linodeFactory.build();

    queryMocks.userPermissions.mockReturnValue({
      permissions: {
        attach_volume: true,
        create_volume: true,
      },
    });

    renderWithThemeAndRouter(
      <LinodeVolumeAddDrawer
        linode={linode}
        onClose={vi.fn}
        open
        openDetails={() => vi.fn}
      />
    );

    const attachModeButton = screen.getByText('Create and Attach Volume');
    await userEvent.click(attachModeButton);

    const btn = screen.getByText('Create Volume');
    expect(btn).toBeVisible();
    expect(btn).not.toHaveAttribute('aria-disabled', 'true');
  });
});
