import React, {Component} from "react";
import {
    Redirect,
} from "react-router-dom";
import {auth} from '../components/Auth';
import {server} from '../config';


class Login extends Component{

    state = {
        redirectToReferrer: false,
        username: "",
        password: "",
        usernameError: "",
        passwordError: "",
        genericErrorMessage: "*required"
    }

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
        this.errors = this.errors.bind(this);
    }

    errors(){
        let error = false;
        if (this.state.username === null || this.state.username === "") {
            this.setState(() => ({ usernameError: this.state.genericErrorMessage}));
            error = true;
        }
        if (this.state.password === null || this.state.password === "") {
            this.setState(() => ({ passwordError: this.state.genericErrorMessage}));
            error = true;
        }
        return error;

    }

    login(event){
        event.preventDefault();
        if(this.errors())
            return;

        const data = new FormData(event.target);
        const url = server;

        fetch(url + '/perform_login', {
            credentials: 'include',
            method: 'POST',
            body: data,
        })
            .then((response) => {
                if(!response.ok && response.status === 401) throw new Error("Wrong username or password");
                else if(!response.ok && response.status === 500) throw new Error("Internal Server Error");
                else return response;
            })
            .then((data) => {
                auth.authenticate(() => {
                    this.setState({ redirectToReferrer: true }, ()=>{auth.user = this.state.username; this.props.history.replace('/application')});
                });
            })
            .catch((error) => {
                alert(error)
            });
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value,
            [name + "Error"]: null,

        });
    }

    render(){

        const { from } = this.props.location.state || { from: { pathname: '/' } } /* save the route the user came from to be able to redirect after login */
        const { redirectToReferrer } = this.state

        if (redirectToReferrer === true) {
            return <Redirect to={from} />
        }

        return(
            <div>
                <form onSubmit={this.login}>
                    <label>
                        Username:
                        <input
                            name="username"
                            type="text"
                            value={this.state.username}
                            onChange={this.handleInputChange}/>
                        {!!this.state.usernameError && (<p style={{color: 'red', float: "right"}}>{this.state.usernameError}</p>)}
                    </label>
                    <br />
                    <label>
                        Password:
                        <input
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleInputChange}/>
                        {!!this.state.passwordError && (<p style={{color: 'red', float: "right"}}>{this.state.passwordError}</p>)}
                    </label>
                    <br/>
                    <input type="submit" value="Submit" />
                </form>
                <br/>
                <button onClick={()=>this.props.history.replace('/register')}>Register</button>
            </div>
        )
    }
}

export default Login;