import { IamAccountResource } from '@linode/api-v4';
import Factory from 'src/factories/factoryProxy';

export const accountResourcesFactory = Factory.Sync.makeFactory<
  IamAccountResource[]
>([
  {
    resource_type: 'linode',
    resources: [
      {
        name: 'debian-us-123',
        id: 12345678,
      },
      {
        name: 'linode-uk-123',
        id: 23456789,
      },
    ],
  },
  {
    resource_type: 'firewall',
    resources: [
      {
        name: 'firewall-us-123',
        id: 45678901,
      },
    ],
  },
  {
    resource_type: 'image',
    resources: [
      {
        name: 'image-us-123',
        id: 65789745,
      },
    ],
  },
  {
    resource_type: 'vpc',
    resources: [
      {
        name: 'vpc-us-123',
        id: 7654321,
      },
    ],
  },
  {
    resource_type: 'volume',
    resources: [
      {
        name: 'volume-us-123',
        id: 890357,
      },
    ],
  },
  {
    resource_type: 'nodebalancer',
    resources: [
      {
        name: 'nodebalancer-us-123',
        id: 4532187,
      },
    ],
  },
  {
    resource_type: 'longview',
    resources: [
      {
        name: 'longview-us-123',
        id: 432178973,
      },
    ],
  },
  {
    resource_type: 'domain',
    resources: [
      {
        name: 'domain-us-123',
        id: 5437894,
      },
    ],
  },
  {
    resource_type: 'stackscript',
    resources: [
      {
        name: 'stackscript-us-123',
        id: 654321789,
      },
    ],
  },
  {
    resource_type: 'database',
    resources: [
      {
        name: 'database-us-123',
        id: 643218965,
      },
    ],
  },
]);
