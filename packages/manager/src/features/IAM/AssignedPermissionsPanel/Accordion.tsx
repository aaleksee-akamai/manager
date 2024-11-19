import React from 'react';
import {
  Accordion as _Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography } from 'src/components/Typography';
import { styled } from '@mui/system';

export interface AccordionProps {
  defaultExpanded?: boolean;
  heading: React.ReactNode | string;
  onClose?: () => void;
  children?: React.ReactNode;
  sx?: object;
}

const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: 'auto',
  backgroundColor: 'transparent',
  padding: 0,
  minWidth: 0,
  color: '#4B4B51',
  '&:hover, &:focus, &:active': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  '& .MuiSvgIcon-root': {
    fill: '#4B4B51',
    stroke: '#4B4B51',
    fontSize: theme.spacing(2),
  },
}));

export const Accordion = ({
  defaultExpanded,
  heading,
  onClose,
  children,
  sx,
}: AccordionProps) => {
  const [open, setOpen] = React.useState<boolean | undefined>(defaultExpanded);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose?.();
  };

  return (
    <_Accordion
      defaultExpanded={defaultExpanded}
      data-qa-panel={heading}
      sx={sx}
    >
      <AccordionSummary
        expandIcon={
          <KeyboardArrowDown
            style={{ fill: '#4B4B51', stroke: '#4B4B51', fontSize: '20px' }}
          />
        }
        onClick={handleToggle}
        data-qa-panel-summary={heading}
      >
        <Typography variant="h3" data-qa-panel-subheading>
          {heading}
        </Typography>
        <StyledButton
          onClick={handleClose}
          size="small"
          disableRipple
          aria-label="Close"
        >
          <CloseIcon />
        </StyledButton>
      </AccordionSummary>
      <AccordionDetails data-qa-panel-details>
        <Grid container>
          <Grid xs={12}>{children}</Grid>
        </Grid>
      </AccordionDetails>
    </_Accordion>
  );
};
