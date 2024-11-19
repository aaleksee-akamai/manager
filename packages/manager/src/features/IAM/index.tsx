import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ProductInformationBanner } from 'src/components/ProductInformationBanner/ProductInformationBanner';
import { SuspenseLoader } from 'src/components/SuspenseLoader';

import type { RouteComponentProps } from 'react-router-dom';

const IAMLanding = React.lazy(() => import('./IAMLanding'));

const UserDetails = React.lazy(() =>
  import('./Users/UserDetailsLanding').then((module) => ({
    default: module.UserDetailsLanding,
  }))
);

const AssignNewRole = React.lazy(() =>
  import('./Users/UserRoles/AssignNewRole').then((module) => ({
    default: module.AssignNewRole,
  }))
);

const EditRole = React.lazy(() =>
  import('./EditRole').then((module) => ({
    default: module.EditRole,
  }))
);

type CombinedProps = RouteComponentProps;

export const IdentityAccessManagement: React.FC<CombinedProps> = (props) => {
  const path = props.match.path;

  return (
    <React.Suspense fallback={<SuspenseLoader />}>
      <ProductInformationBanner bannerLocation="Identity and Access Management" />
      <Switch>
        <Route
          component={AssignNewRole}
          path={`${path}/users/:username/roles/assign`}
        />
        <Route
          component={EditRole}
          path={`${path}/users/:username/roles/edit`}
        />
        <Route component={UserDetails} path={`${path}/users/:username/`} />
        <Route component={AssignNewRole} path={`${path}/roles/assign`} />

        <Redirect exact from={path} to={`${path}/users`} />

        <Route component={IAMLanding} path={`${path}`} />
      </Switch>
    </React.Suspense>
  );
};

export default IdentityAccessManagement;
