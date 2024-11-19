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
import { AssignNewRoleMenu } from './UserRoles/AssignNewRoleMenu';
import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { IAM_LABEL } from '../constants';
import { UserProfile } from './UserDetails/UserProfile';

export const UserDetailsLanding = () => {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const history = useHistory();

  const tabs = [
    {
      routeName: `/iam/users/${username}/details`,
      title: 'User Details',
    },
    {
      routeName: `/iam/users/${username}/roles`,
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

  const actions: any[] = [
    {
      onClick: () => {
        history.push(`/iam/users/${username}/roles/edit`);
      },
      title: 'Edit assignement',
    },
    {
      onClick: () => {
        history.push(`/iam/users/${username}/roles`);
      },
      title: 'Delete assignement',
    },
  ];

  let idx = 0;

  return (
    <>
      <LandingHeader
        breadcrumbProps={{
          crumbOverrides: [
            {
              label: IAM_LABEL,
              position: 1,
            },
          ],
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

            <AssignNewRoleMenu username={username} />

            <ActionMenu
              actionsList={actions}
              ariaLabel={`Action menu for user`}
            />
          </SafeTabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
