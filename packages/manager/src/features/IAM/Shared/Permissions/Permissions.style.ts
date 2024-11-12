import { Button, Chip, Typography } from '@linode/ui';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledChip = styled(Chip, { label: 'StyledChip' })(({}) => ({
  margin: 0,
  color: '#32363C',
  fontSize: '14px',
  padding: 0,
  border: 0,
}));

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
  marginBottom: 0,
}));

export const StyledGrid = styled(Grid, { label: 'StyledGrid' })(({}) => ({
  marginBottom: 0,
  alignItems: 'center',
}));

export const StyledButton = styled(Button, { label: 'StyledButton' })(
  ({ theme }) => ({
    padding: 0,
    minWidth: '60px',
    fontSize: '14px',
    fontFamily: theme.font.normal,
    minHeight: '20px',
  })
);
