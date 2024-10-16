import React from 'react';
import { matchPath, RouteComponentProps } from 'react-router-dom';
import { SuspenseLoader } from 'src/components/SuspenseLoader';
import { SafeTabPanel } from 'src/components/Tabs/SafeTabPanel';
import { TabLinkList } from 'src/components/Tabs/TabLinkList';
import { TabPanels } from 'src/components/Tabs/TabPanels';
import { Tabs } from 'src/components/Tabs/Tabs';
import { Resources } from '../Resources/Resources';

type Props = RouteComponentProps<{}>;

const mockUserResources = {
  resource_type: 'linode',
  resources: [
    {
      resource_name: 'linode-us-123',
      resource_id: '12345678',
    },
    {
      resource_name: 'linode-uk-123',
      resource_id: '23456789',
    },
    {
      resource_name: 'db-us-southeast1',
      resource_id: '456728',
    },
  ],
};

const UsersLanding = React.memo((props: Props) => {
  const tabs = [
    {
      routeName: `${props.match.url}/users/:username`,
      title: 'User Details',
    },
    {
      routeName: `${props.match.url}/users/:username/roles`,
      title: 'User Roles',
    },
  ];

  const matches = (p: string) => {
    return Boolean(matchPath(p, { path: props.location.pathname }));
  };

  const navToURL = (index: number) => {
    props.history.push(tabs[index].routeName);
  };

  return (
    <>
      {/* Contionally show tabs or Assign New Roles form */}
      <Tabs
        index={Math.max(
          tabs.findIndex((tab) => matches(tab.routeName)),
          0
        )}
        onChange={(value) => navToURL(value)}
      >
        <TabLinkList tabs={tabs} />

        <React.Suspense fallback={<SuspenseLoader />}>
          <TabPanels>
            <SafeTabPanel index={0}>
              <h3>User Avatar</h3>
              <p>Username</p>
              <p>Email</p>
              <Resources userResources={mockUserResources} />
            </SafeTabPanel>
            <SafeTabPanel index={1}>
              <h3>Assigned Roles</h3>
              <p>Table</p>
              <h3>Look Up Role By Reference</h3>
              <p>Table</p>
            </SafeTabPanel>
          </TabPanels>
        </React.Suspense>
      </Tabs>
      {/* Assign New Roles */}
    </>
  );
});

export default UsersLanding;
