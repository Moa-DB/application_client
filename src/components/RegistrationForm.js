import React, {Component} from "react";
import {server} from '../config';

class RegistrationForm extends Component{

    componentDidUpdate(){

    }

    constructor(props) {
        super(props)

        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            dateOfBirth: null,
            username: null,
            password: null,
            firstNameError: null,
            lastNameError: null,
            emailError: null,
            dateOfBirthError: null,
            usernameError: null,
            passwordError: null,
            genericErrorMessage: "*required"

        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.errors = this.errors.bind(this);
    }

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
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    First name:
                    <input
                        name="firstName"
                        type="text"
                        value={this.state.firstName}
                        onChange={this.handleInputChange} />
                    {!!this.state.firstNameError && (<p style={{color: 'red', float: "right"}}>{this.state.firstNameError}</p>)}
                </label>
                <br />
                <label>
                    Last name:
                    <input
                        name="lastName"
                        type="text"
                        value={this.state.lastName}
                        onChange={this.handleInputChange} />
                    {!!this.state.lastNameError && (<p style={{color: 'red', float: "right"}}>{this.state.lastNameError}</p>)}
                </label>
                <br />
                <label>
                    Email:
                    <input
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleInputChange} />
                    {!!this.state.emailError && (<p style={{color: 'red', float: "right"}}>{this.state.emailError}</p>)}
                </label>
                <br/>
                <label>
                    Date of birth:
                    <input
                        name="dateOfBirth"
                        type="date"
                        value={this.state.dateOfBirth}
                        onChange={this.handleInputChange}/>
                    {!!this.state.dateOfBirthError && (<p style={{color: 'red', float: "right"}}>{this.state.dateOfBirthError}</p>)}
                </label>
                <br />
                <label>
                    Username:
                    <input
                        name="username"
                        type="text"
                        value={this.state.username}
                        onChange={this.handleInputChange} />
                    {!!this.state.usernameError && (<p style={{color: 'red', float: "right"}}>{this.state.usernameError}</p>)}
                </label>
                <br />
                <label>
                    Password:
                    <input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleInputChange} />
                    {!!this.state.passwordError && (<p style={{color: 'red', float: "right"}}>{this.state.passwordError}</p>)}
                </label>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        )
    }

    errors(){
        let error = false;
        if (this.state.firstName === null || this.state.firstName === "") {
            this.setState(() => ({ firstNameError: this.state.genericErrorMessage}));
            error = true;
        }
        if (this.state.lastName === null || this.state.lastName === "") {
            this.setState(() => ({ lastNameError: this.state.genericErrorMessage}));
            error = true;
        }
        if (this.state.email === null || this.state.email === "") {
            this.setState(() => ({ emailError: this.state.genericErrorMessage}));
            error = true;
        }
        if (this.state.dateOfBirth === null || this.state.dateOfBirth === "") {
            this.setState(() => ({ dateOfBirthError: this.state.genericErrorMessage}));
            error = true;
        }
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

    handleSubmit(event) {
        event.preventDefault();
        if(this.errors())
            return;

        const data = new FormData(event.target);
        fetch(server + '/registration', {
            credentials: 'include',
            method: 'POST',
            body: data,
        }).
        then((response) => {
            if(!response.ok)
                return response.json();
            else
                return response;
        }).
        then((response) => {
            if(!response.ok) throw new Error(response.message);
            else return response;
        })
            .then((data) => {
                alert("User created");
                this.props.history.replace('/login');
            })
            .catch((error) => {
                alert(error);
            });
    }
}

export default RegistrationForm;