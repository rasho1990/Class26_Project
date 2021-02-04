import React, { Suspense } from "react";
import "semantic-ui-css/semantic.min.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// Global
import MainNavigation from "./shared/components/Navigation/MainNavigation";

import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

// Pages
/* eslint-disable import/first */

const HomePage = React.lazy(() => import("./home/HomePage"));
const UsersPage = React.lazy(() => import("./users/pages/UsersPage"));
const NewsFeed = React.lazy(() => import("./users/pages/NewsFeed"));
const AuthPage = React.lazy(() => import("./users/pages/AuthPage"));
const ForgetPassword = React.lazy(() => import("./users/pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./users/pages/ResetPassword"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const EditPlace = React.lazy(() => import("./places/pages/EditPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const PlacePage = React.lazy(() => import("./places/pages/PlacePage"));
const UserProfile = React.lazy(() => import("./users/pages/UserProfile"));
const UserFriends = React.lazy(() => import("./friends/pages/UserFriends.js"));
const AllPlaces = React.lazy(() => import("./places/pages/AllPlaces"));
const BucketList = React.lazy(() => import("./places/components/BucketList"));

// Context
import AuthContext from "./shared/context/auth-context";

// Hook
import useAuth from "./shared/hooks/auth-hook";

function App() {
  const { token, userId, login, logout } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route exact path="/" component={UsersPage} />
        <Route exact path="/:userId/newsfeed" component={NewsFeed} />
        <Route exact path="/:userId/places" component={UserPlaces} />
        <Route exact path="/:userId/friends" component={UserFriends} />
        <Route exact path="/places/new" component={NewPlace} />
        <Route exact path="/places/:placeId" component={EditPlace} />
        <Route exact path="/account/:userId" component={UserProfile} />
        <Route exact path="/place/all" component={AllPlaces} />
        <Route exact path="/:userId/bucketlist" component={BucketList} />
        <Route exact path="/places/:placeId/details" component={PlacePage} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/" component={UsersPage} />
        <Route exact path="/:userId/places" component={UserPlaces} />
        <Route exact path="/forgot-password" component={ForgetPassword} />
        <Route
          exact
          path="/reset-password/:resetLink"
          component={ResetPassword}
        />
        <Route exact path="/auth" component={AuthPage} />
        <Route exact path="/place/all" component={AllPlaces} />
        <Route exact path="/places/:placeId/details" component={PlacePage} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, userId, login, logout }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={LoadingSpinner}>{routes}</Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
