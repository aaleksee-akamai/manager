import React from 'react';

import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from 'src/utilities/testHelpers';
import { Accordion } from './Accordion';

const mockOnClose = vi.fn();

describe('Accordion', () => {
  it('renders the accordion heading and content when is expanded', () => {
    const { getByText } = renderWithTheme(
      <Accordion defaultExpanded={true} heading={'title'} onClose={mockOnClose}>
        <div>Accordion Content</div>
      </Accordion>
    );
    expect(getByText('title')).toBeInTheDocument();
    expect(getByText('Accordion Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const { getByTestId } = renderWithTheme(
      <Accordion
        defaultExpanded={false}
        heading={'title'}
        onClose={mockOnClose}
      >
        <div>Accordion Content</div>
      </Accordion>
    );

    const closeIconBtn = getByTestId('CloseIcon');
    fireEvent.click(closeIconBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
