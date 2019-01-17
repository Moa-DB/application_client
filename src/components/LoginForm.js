import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { server, api } from '../config.json';
import Auth from '../auth.js';

/**
 * A log-in form and its related logic. If user is logged in, the form is hidden. If not, the form is shown.
 */
class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);

        this.state = {
            loading: false,
            loggedin: false,
            username: '',
            password: '',
        };
    }
    handleChangeUsername(e) {
        this.setState({ username: e.target.value });
    }
    handleChangePassword(e) {
        this.setState({ password: e.target.value });
    }
    login = () => {
        this.setState({loading:true});
        const url = server + api.login;

        let formdata = new FormData();
        formdata.append('username', this.state.username);
        formdata.append('password', this.state.password);
        const fetchOptions = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formdata,
        };
        fetch(url, fetchOptions)
            .then(resp => console.log(resp))
            .then(() => {
                Auth.setCredentials(this.state.username, this.state.password);
                this.setState({loading:false,loggedin:true});
            })
    }
    render() {
        if (this.state.loading) {
            return <p>LOADING..</p>;
        } else if (!Auth.isLoggedIn()) {
            return (
                <form>
                    <FormGroup
                        controlId="loginForm"
                    >
                        <FormControl
                            type="text"
                            value={this.state.username}
                            placeholder="Username"
                            onChange={this.handleChangeUsername}
                        />
                        <FormControl
                            type="password"
                            value={this.state.password}
                            placeholder="Password"
                            onChange={this.handleChangePassword}
                        />
                        <Button onClick={ this.login }>Login</Button>
                    </FormGroup>
                </form>
            );
        } else {
            return <p>Welcome</p>;
        }
    }
}
export default LoginForm;
