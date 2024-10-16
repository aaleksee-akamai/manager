import React from 'react';

import {
  IamAccessType,
  IamAccountResource,
  Resource,
  ResourceType,
  ResourceTypePermissions,
  Roles,
} from '@linode/api-v4';
import { useAccountResources } from 'src/queries/resources/resources';
import { styled } from '@mui/material/styles';
import { Autocomplete, Typography } from '@linode/ui';

interface ExtendedRole extends Roles {
  resource_type: ResourceTypePermissions | ResourceType;
  access: IamAccessType;
}

type Props = {
  role: ExtendedRole;
};

type ResourceOption = {
  label: string;
  value: number;
};

export const Resources = ({ role }: Props) => {
  const { data: resources } = useAccountResources();

  const { resource_type, access } = role;

  const [selectedResources, setSelectedResources] = React.useState<
    ResourceOption[]
  >([]);

  // Update transformed resources and selected resources when resources or role change
  React.useEffect(() => {
    // Filter and transform resources based on role
    if (access === 'resource_access' && resources) {
      const resourcesByType = getResourcesByType(resource_type, resources);
      const transformedResourcesList = resourcesByType
        ? transformedResources(resourcesByType.resources)
        : [];

      // Initialize selected resources to transformed list
      setSelectedResources(transformedResourcesList);
    } else {
      setSelectedResources([]);
    }
  }, [resources, access, resource_type]);

  const placeholder = !!selectedResources.length
    ? ' '
    : getPlaceholder(resource_type);

  return (
    <>
      <StyledTypography>Resources</StyledTypography>
      {access === 'account_access' ? (
        <Typography sx={{ marginTop: 2 }}>
          All {resource_type} resources
        </Typography>
      ) : selectedResources.length ? (
        <Autocomplete
          multiple
          label=""
          value={selectedResources}
          onChange={(_, value) => setSelectedResources(value)}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          options={selectedResources}
          ListboxProps={{ sx: { overflowX: 'hidden' } }}
          placeholder={placeholder}
          renderOption={(props, option) => (
            <li {...props} key={option.label}>
              {option.label}
            </li>
          )}
        />
      ) : (
        <Typography sx={{ marginTop: 2 }}>
          there are no resorces for this role
        </Typography>
      )}
    </>
  );
};

const getPlaceholder = (type: ResourceTypePermissions | ResourceType) =>
  ({
    linode: 'Select Linodes',
    firewall: 'Select Firewalls',
    nodebalancer: 'Select Nodebalancer',
    longview: 'Select Longview',
    domain: 'Select Domain',
    stackscript: 'Select Stackscript',
    image: 'Select Image',
    volume: 'Select Volume',
    database: 'Select Database',
    vpc: 'Select Vpc',
    account: 'Select Account',
  }[type] || 'Select');

const transformedResources = (resources: Resource[]): ResourceOption[] => {
  const r = resources.map((resource) => ({
    label: resource.name,
    value: resource.id,
  }));

  return r;
};

const getResourcesByType = (
  roleResourceType: ResourceType | ResourceTypePermissions,
  resources: IamAccountResource
): IamAccountResource | undefined => {
  const resourceArray: IamAccountResource[] = Object.values(resources);

  // Find the first matching resource by resource_type
  const resource = resourceArray.find(
    (item: IamAccountResource) => item.resource_type === roleResourceType
  );

  return resource;
};

const StyledTypography = styled(Typography, {
  label: 'StyledTypography',
})(({ theme }) => ({
  color: '#32363C',
  fontSize: '14px',
  fontFamily: theme.font.bold,
  marginBottom: `-${theme.spacing(2)}`,
}));
