import React from 'react';
import {
  useHistory,
  useLocation,
  useParams,
  matchPath,
} from 'react-router-dom';

import { LandingHeader } from 'src/components/LandingHeader';
import { SafeTabPanel } from 'src/components/Tabs/SafeTabPanel';
import { TabLinkList } from 'src/components/Tabs/TabLinkList';
import { TabPanels } from 'src/components/Tabs/TabPanels';
import { Tabs } from 'src/components/Tabs/Tabs';
import { UserProfile } from './UserProfile/UserProfile';

export const UserDetailsLanding = () => {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const history = useHistory();

  const tabs = [
    {
      routeName: `/identity-access-management/users/${username}/details`,
      title: 'User Details',
    },
    {
      routeName: `/identity-access-management/users/${username}/roles`,
      title: 'User Roles',
    },
  ];

  const navToURL = (index: number) => {
    history.push(tabs[index].routeName);
  };

  const getDefaultTabIndex = () => {
    const tabChoice = tabs.findIndex((tab) =>
      Boolean(matchPath(tab.routeName, { path: location.pathname }))
    );

    return tabChoice;
  };

  let idx = 0;

  return (
    <>
      <LandingHeader
        breadcrumbProps={{
          labelOptions: {
            noCap: true,
          },
          pathname: location.pathname,
        }}
        removeCrumbX={4}
        title={username}
      />
      <Tabs index={getDefaultTabIndex()} onChange={navToURL}>
        <TabLinkList tabs={tabs} />
        <TabPanels>
          <SafeTabPanel index={idx}>
            <UserProfile />
          </SafeTabPanel>
          <SafeTabPanel index={++idx}>
            <p>UIE-8138 - User Roles - Assigned Roles Table</p>
            <p>UIE-8139 - User Roles - Assign New Role</p>
            <p>UIE-8140 - User Roles - Assign New Role</p>
            <p>UIE-8141 - User Roles - Edit Assignment</p>
          </SafeTabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
