import React, { useState } from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

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

export const Resources = ({ userResources }: Props) => {
  const { resource_type, resources } = userResources;
  const [selectedLinodes, setSelectedLinodes] = useState<any>([]);

  return (
    <Autocomplete
      multiple
      label="Resources (required)"
      onChange={(_, value) => setSelectedLinodes(value)}
      // isOptionEqualToValue={(option, value) => option.value === value.value}
      options={transformedResources(resources)}
      ListboxProps={{ sx: { overflowX: 'hidden' } }}
      sx={{
        maxWidth: 514,
        '&& .MuiInput-root': {
          maxWidth: 514,
        },
      }}
      value={selectedLinodes}
      placeholder={
        selectedLinodes.length > 0 ? ' ' : getPlaceholder(resource_type)
      }
    />
  );
};

const getPlaceholder = (type: string) =>
  ({
    linode: 'Select Linodes',
    firewall: 'Select Firewalls',
  }[type] || 'Select');

const transformedResources = (resources: Resource[]) => {
  return resources.map((resource) => ({
    label: resource.resource_name,
    // key: resource.resource_id
    // value: resource.resource_id
  }));
};
