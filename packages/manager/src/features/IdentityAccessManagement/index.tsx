import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ProductInformationBanner } from 'src/components/ProductInformationBanner/ProductInformationBanner';
import { SuspenseLoader } from 'src/components/SuspenseLoader';

import type { RouteComponentProps } from 'react-router-dom';

const IdentityAccessManagementLanding = React.lazy(
  () => import('./IdentityAccessManagementLanding')
);

const UserDetails = React.lazy(() =>
  import('./UserDetailsLanding').then((module) => ({
    default: module.UserDetailsLanding,
  }))
);

type CombinedProps = RouteComponentProps;

export const IdentityAccessManagement: React.FC<CombinedProps> = (props) => {
  const path = props.match.path;

  return (
    <React.Suspense fallback={<SuspenseLoader />}>
      <ProductInformationBanner bannerLocation="Identity and Access Management" />
      <Switch>
        <Route component={UserDetails} path={`${path}/users/:username`} />

        <Redirect exact from={path} to={`${path}/users`} />

        <Route component={IdentityAccessManagementLanding} path={`${path}`} />
      </Switch>
    </React.Suspense>
  );
};

export default IdentityAccessManagement;
