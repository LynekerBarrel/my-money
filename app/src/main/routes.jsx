import React from 'react'

import { Switch, Route, Redirect } from 'react-router'
// import { Router, Route, Redirect, hashHistory } from 'react-router'

import Dashboard from '../dashboardreduxless/dashbaordReduxless'
import BillingCycle from '../billingCycle/billingCycle'


export default props => (
    <div className="content-wrapper">
        <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route path='/billingCycles' component={BillingCycle} />
            <Redirect from='*' to='/' />
        </Switch>
    </div>
    // <Router history={hashHistory}>
    //     <Route path='/' component={Dashboard} />
    //     <Route path='/billingCycles' component={BillingCycle} />
    //     <Redirect from='*' to='/' />
    // </Router>
)