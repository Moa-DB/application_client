import React, {Component} from 'react';
import { Navbar, Nav, NavItem, PageHeader, Button } from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom';
import {auth} from '../components/Auth';
import './Header.css';


class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }
    render() {
        return (
            <PageHeader>
                <h1>APPLICATION PORTAL</h1>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to ='/home' >home</Link>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <Navbar.Brand>
                            <Link to ='/register' >register</Link>
                        </Navbar.Brand>
                    </Nav>
                    <Nav>
                        <Navbar.Brand>
                            <Link to ='/application' >application</Link>
                        </Navbar.Brand>
                    </Nav>
                    <Navbar.Brand>
                    <ul className="nav navbar-nav navbar-right">
                    <AuthButton/>
                    </ul>
                    </Navbar.Brand>
                </Navbar>
                <h2>{this.props.location.pathname.substring(1)}</h2>
            </PageHeader>
        );
    }
}

const AuthButton = withRouter(({ history }) => (
    auth.isAuthenticated ? (
            <button type="button" id="headerButton"
                    onClick={() => {
                auth.signout(() => history.push('/login'))
            }}>sign out {auth.user}</button>
    ) : (
        <button type="button" id="headerButton"
                onClick={() => {
                    history.replace('/login');
                }}>log in</button>
    )
))

export default withRouter(Header);
