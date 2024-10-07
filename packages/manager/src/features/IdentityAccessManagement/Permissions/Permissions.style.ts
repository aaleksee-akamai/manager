import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Chip } from 'src/components/Chip';
import { Typography } from 'src/components/Typography';

export const StyledChip = styled(Chip, { label: 'StyledChip' })(
  ({ theme }) => ({
    borderColor: '#C5C5CA',
    borderRadius: 4,
    marginRight: theme.spacing(),
    marginTop: 0,
    marginBottom: theme.spacing(),
    color: '#32363C',
    fontSize: '14px',
    height: theme.spacing(3),
  })
);

export const sxTooltipIcon = {
  padding: 0,
  width: '16px',
  height: '16px',
  marginLeft: '10px',
};

export const StyledTypography = styled(Typography, {
  label: 'StyledTypography',
})(({ theme }) => ({
  color: '#32363C',
  fontSize: '14px',
  fontFamily: theme.font.bold,
}));

export const StyledGrid = styled(Grid, { label: 'StyledGrid' })(
  ({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    alignItems: 'center',
  })
);
