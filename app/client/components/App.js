import React from 'react';
import { Switch } from 'react-router-dom';

import routing from '../utils/routing';
import customLoadable from './customLoadable';
import SignInRoute from './Wrappers/SignInRoute';
import WrappedRoute from './Wrappers/WrappedRoute';
import AuthRoute from './Wrappers/AuthRoute';
import RolesRoute from './Wrappers/RolesRoute';
import ShareOpinionRoute from './Wrappers/ShareOpinionRoute';

const Login = customLoadable({
  loader: () => import('../pages/auth/Login')
});
const Register = customLoadable({
  loader: () => import('../pages/auth/SignUp')
});
const ChooseRole = customLoadable({
  loader: () => import('../pages/auth/ChooseRole')
});
const Account = customLoadable({
  loader: () => import('../pages/account/Account')
});
const ProfileForAdmin = customLoadable({
  loader: () => import('../pages/profile/ProfileForAdmin')
});
const ProfileForAnalyst = customLoadable({
  loader: () => import('../pages/profile/ProfileForAnalyst')
});
const ProfileForManager = customLoadable({
  loader: () => import('../pages/profile/ProfileForManager')
});
const ProfileForCustomer = customLoadable({
  loader: () => import('../pages/profile/ProfileForCustomer')
});

const Dashboard = customLoadable({ loader: () => import('../pages/dashboard/Dashboard') });
const ShareOpinion = customLoadable({
  loader: () => import('../pages/shareOpinion/Subjects')
});
const ShareOpinionChart = customLoadable({
  loader: () => import('../pages/shareOpinion/Chart')
});
const ShareOpinionMessage = customLoadable({
  loader: () => import('../pages/shareOpinion/Reviews')
});

const ForgotPassword = customLoadable({
  loader: () => import('../pages/auth/ForgotPassword')
});
const ResetPassword = customLoadable({
  loader: () => import('../pages/auth/ResetPassword')
});

const Staff = customLoadable({
  loader: () => import('../pages/staff/Staff')
});
const PageNotFound = customLoadable({
  loader: () => import('../pages/notFound/NotFound')
});

// additional subroutes
// Overview, CompanyAbout

// TODO: Add stylelint before commits.
// TODO: Add favicon.
// TODO: Clean webpack configs, it seems that there is some redundant code.
// TODO: Add local environment.
// TODO: Choose better default avatar.

export default function App() {
  return (
    <Switch>
      <SignInRoute exact path={routing().login} component={Login} />
      <SignInRoute exact path={routing().registration} component={Register} />
      <SignInRoute exact path={routing().chooseRole} component={ChooseRole} />
      <SignInRoute exact path={routing().forgotPassword} component={ForgotPassword} />
      <SignInRoute exact path={routing().resetPassword} component={ResetPassword} />
      <AuthRoute exact path={routing().account} component={Account} />
      <AuthRoute exact path={routing().dashboard} component={Dashboard} />
      {/*<AuthRoute exact path={routing().profile} component={Profile} />*/}
      <RolesRoute
        exact
        path={routing().profile}
        forAdmin={ProfileForAdmin}
        forAnalyst={ProfileForAnalyst}
        forManager={ProfileForManager}
        forCustomer={ProfileForCustomer}
      />
      <RolesRoute exact path={routing().staff} forAdmin={Staff} />

      {/* Share your opinion */}
      <AuthRoute exact path={routing().shareOpinion} component={ShareOpinion} />
      <ShareOpinionRoute
        exact
        path={routing().shareOpinionChart}
        step={2}
        component={ShareOpinionChart}
      />
      <ShareOpinionRoute
        exact
        path={routing().shareOpinionMessage}
        step={3}
        component={ShareOpinionMessage}
      />
      {/*<AuthRoute exact path={routing().shareOpinionChart} component={ShareOpinionChart} />*/}
      {/* TODO: Change to actual root */}
      <AuthRoute exact path={routing().root} component={Account} />
      <WrappedRoute exact path={routing().notFound} component={PageNotFound} />
      <WrappedRoute component={PageNotFound} />
    </Switch>
  );
}
