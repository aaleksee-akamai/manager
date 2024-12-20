/* eslint-disable no-console */
import { Button, Typography } from '@linode/ui';
import { styled } from '@mui/material';
import * as React from 'react';

interface Props {
  description: string;
}

export const RoleDescription = ({ description }: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [visibleChips, setVisibleChips] = React.useState<string[]>([]);
  const [hiddenChips, setHiddenChips] = React.useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const truncateText = React.useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const lineHeight = parseFloat(
        getComputedStyle(container).lineHeight || '1.5'
      );
      const maxHeight = lineHeight * 2 + 10; // Height of 2 lines
      console.log('maxHeight', maxHeight);
      const containerWidth = containerRef.current.offsetWidth - 50; // Leave space for "Expand"

      let accumulatedWidth = 0;
      const visibleItems: string[] = [];
      const hiddenItems: string[] = [];

      const arr = description.split(' ');
      console.log('arr', arr);

      if (container.offsetHeight > maxHeight) {
        for (const item of arr) {
          const itemWidth = item.length;

          if (accumulatedWidth + itemWidth + 13 <= containerWidth) {
            accumulatedWidth += itemWidth + 13;
            visibleItems.push(item);
          } else {
            const lastIdx = arr.indexOf(item);
            hiddenItems.push(...arr.slice(lastIdx));
            break;
          }
        }
      }

      if (container.offsetHeight > maxHeight && hiddenItems.length) {
        visibleItems[visibleItems.length - 1] += '...';
      }

      setVisibleChips(visibleItems);
      setHiddenChips(hiddenItems);

      console.log('visibleItems', visibleItems);
      console.log('hiddenItems', hiddenItems);
    }
  }, [description]);

  React.useEffect(() => {
    truncateText();
  }, [truncateText]);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      style={{
        display: 'inline-block',
        marginBottom: 12,
      }}
      ref={containerRef}
    >
      <Typography
        sx={{
          color: '#32363C',
          display: 'inline',
          lineHeight: '1.5',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {isExpanded || !visibleChips.join(' ').length
          ? description
          : visibleChips.join(' ')}
      </Typography>
      {!!hiddenChips.length && (
        <span>
          <StyledButton onClick={toggleDescription}>
            {isExpanded ? 'Hide' : 'Expand'}
          </StyledButton>
        </span>
      )}
    </div>
  );
};

export const StyledButton = styled(Button, { label: 'StyledButton' })(
  ({ theme }) => ({
    alignItems: 'baseline',
    fontFamily: theme.font.normal,
    fontSize: '14px',
    minHeight: '20px',
    minWidth: '60px',
    padding: 0,
  })
);
