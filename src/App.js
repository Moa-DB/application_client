import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import Auth from './components/Auth';

/**
 * Wrapper class that adds Header and Footer to each page.
 */
class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Auth/>
                <Footer />
            </div>
        );
    }
}
export default App;
