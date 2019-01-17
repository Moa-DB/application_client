import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';

/**
 * The Home page. Also point of authentication.
 */
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }
    render() {
        return (
            <div>
                <p>Home</p>

                <LoginForm />

            </div>
        );
    }
}

export default Home;
