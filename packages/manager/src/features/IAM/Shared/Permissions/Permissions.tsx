import * as React from 'react';

import Grid from '@mui/material/Grid';
import {
  StyledButton,
  StyledChip,
  StyledGrid,
  StyledTypography,
  sxTooltipIcon,
} from './Permissions.style';
import {
  IamAccessType,
  ResourceTypePermissions,
  Roles,
} from '@linode/api-v4/lib/iam/types';
import { TooltipIcon } from '@linode/ui';

interface ExtendedRole extends Roles {
  resource_type: ResourceTypePermissions;
  access: IamAccessType;
}

type Props = {
  role: ExtendedRole;
};

export const Permissions = ({ role }: Props) => {
  const permissions = role.permissions ?? [];

  const [showAllBtn, setShowAllBtn] = React.useState(false);
  const [visibleChips, setVisibleChips] = React.useState<string[]>([]);
  const [hiddenChips, setHiddenChips] = React.useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const calculateVisibleChips = React.useCallback(() => {
    if (!containerRef.current) return;

    const chipElements = containerRef.current.querySelectorAll(
      '[data-testid="chip"]'
    );
    const containerWidth = containerRef.current.offsetWidth - 90; // Leave space for "+X | Show All"
    const isSmallContainer = containerWidth < 400; // Check if it's inside the drawer

    if (!isSmallContainer) {
      // If container is not located nside the drawer, show all permissions
      setVisibleChips(permissions);
      setHiddenChips([]);
      return;
    }

    let accumulatedWidth = 0;
    const visibleItems: string[] = [];
    const hiddenItems: string[] = [];

    for (const item of Array.from(chipElements)) {
      const chipWidth = (item as HTMLElement).offsetWidth;
      if (accumulatedWidth + chipWidth <= containerWidth) {
        accumulatedWidth += chipWidth;
        visibleItems.push(item.textContent || '');
      } else {
        const lastIdx = Array.from(chipElements).indexOf(item);
        hiddenItems.push(
          ...Array.from(chipElements)
            .slice(lastIdx)
            .map((chip) => chip.textContent || '')
        );

        break;
      }
    }

    setVisibleChips(visibleItems);
    setHiddenChips(hiddenItems);
  }, [permissions]);

  React.useEffect(() => {
    calculateVisibleChips();
    const handleResize = () => calculateVisibleChips();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [calculateVisibleChips]);

  const handleToggle = () => {
    setShowAllBtn((prev) => !prev);
  };

  return (
    <Grid
      container
      direction="column"
      ref={containerRef}
      data-testid="parent"
      sx={{ marginBottom: 1 }}
    >
      <StyledGrid container item md={1}>
        <StyledTypography>Permissions</StyledTypography>
        <TooltipIcon
          status="help"
          text="Link is coming..."
          sxTooltipIcon={sxTooltipIcon}
        />
      </StyledGrid>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={3}
        item
        md={11}
        sx={{
          margin: 0,
          alignItems: 'center',
          maxWidth: 'fit-content !important',
        }}
      >
        {(showAllBtn || !visibleChips.length ? permissions : visibleChips).map(
          (permission: string) => (
            <React.Fragment key={permission}>
              <StyledChip
                label={permission}
                key={permission}
                data-testid="chip"
                variant="outlined"
              />
              <span> | </span>
            </React.Fragment>
          )
        )}

        {!showAllBtn && !!hiddenChips.length && (
          <span style={{ paddingLeft: '3px' }}> +{hiddenChips.length} |</span>
        )}

        {!!hiddenChips.length && (
          <StyledButton onClick={handleToggle} variant="text">
            {showAllBtn ? 'Hide' : `Show All`}
          </StyledButton>
        )}
      </Grid>
    </Grid>
  );
};
