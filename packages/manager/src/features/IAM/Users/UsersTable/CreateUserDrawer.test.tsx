import React from 'react';
import { renderWithTheme } from 'src/utilities/testHelpers';
import { fireEvent } from '@testing-library/react';
import { HttpResponse, http, server } from 'src/mocks/testServer';
import CreateUserDrawer from './CreateUserDrawer';

const props = {
  onClose: vi.fn(),
  open: true,
  refetch: vi.fn(),
};

describe('CreateUserDrawer', () => {
  it('should render the drawer when open is true', () => {
    const { getByRole } = renderWithTheme(<CreateUserDrawer {...props} />);

    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should allow the user to fill out the form', () => {
    const { getByRole, getByLabelText } = renderWithTheme(
      <CreateUserDrawer {...props} />
    );

    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    fireEvent.change(getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'testuser@example.com' },
    });

    expect(getByLabelText(/username/i)).toHaveValue('testuser');
    expect(getByLabelText(/email/i)).toHaveValue('testuser@example.com');
  });

  it('should display an error message when submission fails', async () => {
    server.use(
      http.post('*/account/users', () => {
        return HttpResponse.json(
          { error: [{ reason: 'An error occurred.' }] },
          { status: 500 }
        );
      })
    );

    const {
      getByRole,
      getByLabelText,
      getByTestId,
      findByText,
    } = renderWithTheme(<CreateUserDrawer {...props} />);

    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    fireEvent.change(getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.click(getByTestId('submit'));

    const errorMessage = await findByText(/error creating user./i);
    expect(errorMessage).toBeInTheDocument();
  });
});
