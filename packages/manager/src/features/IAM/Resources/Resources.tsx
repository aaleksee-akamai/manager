import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Typography } from 'src/components/Typography';
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';

type Props = {
  userResources: AccountResource;
};

type AccountResource = {
  resource_type: string;
  resources: Resource[];
};

interface Resource {
  resource_name: string;
  resource_id: string;
}

type ResourceOption = {
  label: string;
  value: string;
};

const useStyles = makeStyles()((theme: Theme) => ({
  typeHeader: {
    color: '#32363C',
    fontSize: '14px',
    fontFamily: theme.font.bold,
    marginBottom: `-${theme.spacing()}`,
  },
  typeSpan: {
    fontFamily: theme.font.normal,
  },
  select: {
    maxWidth: 514,
    '&& .MuiInput-root': {
      maxWidth: 514,
    },
  },
}));

export const Resources = ({ userResources }: Props) => {
  const { classes } = useStyles();

  const { resource_type, resources } = userResources;
  const [selectedResources, setSelectedResources] = React.useState<
    ResourceOption[]
  >([]);

  const memoizedResources = React.useMemo(
    () => transformedResources(resources),
    [resources]
  );
  const placeholder =
    selectedResources.length > 0 ? ' ' : getPlaceholder(resource_type);

  return (
    <>
      <Typography className={classes.typeHeader}>
        Resources <span className={classes.typeSpan}>(required)</span>
      </Typography>
      <Autocomplete
        multiple
        label=""
        onChange={(_, value) => setSelectedResources(value)}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        options={memoizedResources}
        ListboxProps={{ sx: { overflowX: 'hidden' } }}
        className={classes.select}
        placeholder={placeholder}
        renderOption={(props, option) => (
          <li {...props} key={option.label}>
            {option.label}
          </li>
        )}
      />
    </>
  );
};

const getPlaceholder = (type: string) =>
  ({
    linode: 'Select Linodes',
    firewall: 'Select Firewalls',
  }[type] || 'Select');

const transformedResources = (resources: Resource[]): ResourceOption[] => {
  const r = resources.map((resource) => ({
    label: resource.resource_name,
    value: resource.resource_id,
  }));

  return r;
};
