import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from "react-router-dom";
import Application from '../pages/Application';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Header from "./Header";
import Footer from "./Footer";
import Home from '../pages/Home';


/**
 * Anyone can access public but when a user tries to access a protected page
 * they should be redirected to login
 * @returns {*}
 * @constructor
 */
function Auth() {
    return (
        <Router>
            <div>
                <Header />
                <Route path="/home" component={Home}/>
                <Route path="/register" component={Register}/>
                <Route path="/login" component={Login}/>
                <PrivateRoute path='/application' component={Application} />
                <Footer/>
            </div>
        </Router>
    )
}

/**
 * Set authenticated to true or false
 *
 * @type {{user: string, isAuthenticated: boolean, authenticate(*=): void, signout(*=): void, getItems(*)}}
 */
export const auth = {
    user: "",
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        cb();
        //setTimeout(cb, 100)

        // this.getItems(cb)
    },
    signout(cb) {
        this.user = ""
        this.isAuthenticated = false
        setTimeout(cb, 100)
    },
    getItems(cb) {

    }
}

/**
 * Create a PrivateRoute with same API as Route
 * Render a Route and pass all props to it
 * Render component prop if user is authenticated, otherwise redirects
 * @param Component
 * @param rest
 * @constructor
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth.isAuthenticated
            ? ( <Component {...props} auth={auth.isAuthenticated}/> ) //TODO should check something else than auth={auth.isAuthenticated} ?
            : ( <Redirect to={{
                pathname: '/login',
                state: { from: props.location } /* save a state key, so that we can redirect the user back to where they were before login */
            }} /> )
    )} />
)

export default Auth;