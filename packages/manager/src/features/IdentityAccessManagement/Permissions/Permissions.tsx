import * as React from 'react';
import Grid from '@mui/material/Grid';
import { TooltipIcon } from 'src/components/TooltipIcon';
import {
  StyledChip,
  StyledGrid,
  StyledTypography,
  sxTooltipIcon,
} from './Permissions.style';

interface UserPermissionsProps {
  resourceType: string;
  roles: RoleProps[];
}

interface RoleProps {
  name: string;
  description: string;
  permissions: string[];
}

type PermissionsProps = {
  userPermissions: UserPermissionsProps;
};

export const Permissions = ({
  userPermissions: { roles },
}: PermissionsProps) => {
  const permissions = roles.flatMap((role: RoleProps) =>
    role.permissions.map((permission: string) => (
      <StyledChip
        label={permission}
        key={permission}
        data-testid="chip"
        variant="outlined"
      />
    ))
  );

  return (
    <Grid container direction="column">
      <StyledGrid container item md={1}>
        <StyledTypography>Permissions</StyledTypography>
        <TooltipIcon
          status="help"
          text="Hello World"
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
