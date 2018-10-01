import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import withSession from './withSession'

// pages
import App from './App';
import SingIn from './auth/SingIn';
import SingUp from './auth/SingUp';
import Profile from './pages/Profile';
import AddRecipe from './pages/AddRecipe';
import RecipePage from './pages/RecipePage';
// components

import Header from './components/Header/index';
import Search from './components/Search/index';

const Routes = ({ refetch, session }) => [
    <Header key="nav" {...session} />,
    <Switch key="Routes">
        <Route path="/singin" render={() => <SingIn refetch={refetch}/>} />
        <Route path="/singup" component={SingUp} />
        <Route path="/search" component={Search} />
        <Route path="/profile" render={() => <Profile {...session} />} />
        <Route path="/recipe/add" render={() => <AddRecipe {...session} />}  />
        <Route path="/recipe/:_id" component={RecipePage} />
        <Route path="/" component={App} />

    </Switch>
];

export default withSession(Routes);
