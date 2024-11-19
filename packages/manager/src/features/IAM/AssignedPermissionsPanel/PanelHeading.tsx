import React from 'react';

import { Stack } from 'src/components/Stack';
import { Typography } from 'src/components/Typography';
import { Roles } from '@linode/api-v4/lib/iam/types';

type Props = {
  role: Roles;
};

export const PanelHeading = ({ role }: Props) => {
  const { name, description } = role;

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Typography variant="h2">{name}</Typography>
      </Stack>
      <Typography>{description}</Typography>
    </Stack>
  );
};
