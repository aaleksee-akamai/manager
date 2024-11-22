import React from 'react';

import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';
import Grid from '@mui/material/Grid';
import EmptyNotificationIcon from 'src/assets/icons/emptynotification.svg';

interface Props {
  text: string;
}

export const NoAssignedRoles = (props: Props) => {
  const { text } = props;

  return (
    <Paper variant="outlined">
      <Grid
        container
        direction="column"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 6,
          paddingBottom: 6,
        }}
      >
        <EmptyNotificationIcon />
        <Typography sx={{ marginTop: 1 }}>{text}</Typography>
      </Grid>
    </Paper>
  );
};
