import * as React from 'react';
import Grid from '@mui/material/Grid';
import { TooltipIcon } from 'src/components/TooltipIcon';
import {
  StyledChip,
  StyledGrid,
  StyledTypography,
  sxTooltipIcon,
} from './Permissions.style';
import { Roles } from '@linode/api-v4/lib/iam/types';

type Props = {
  userPermissions: Roles;
};

export const Permissions = ({ userPermissions }: Props) => {
  const permissions = userPermissions.permissions?.map((permission: string) => (
    <StyledChip
      label={permission}
      key={permission}
      data-testid="chip"
      variant="outlined"
    />
  ));

  return (
    <Grid container direction="column">
      <StyledGrid container item md={1}>
        <StyledTypography>Permissions</StyledTypography>
        <TooltipIcon
          status="help"
          text="Link is coming"
          sxTooltipIcon={sxTooltipIcon}
        />
      </StyledGrid>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={3}
        item
        md={11}
        sx={{ margin: 0 }}
      >
        {permissions}
      </Grid>
    </Grid>
  );
};
