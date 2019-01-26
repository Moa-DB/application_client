import React, { Component } from 'react';
import './App.css';
import Auth from './components/Auth';

/**
 * Wrapper class that adds Header and Footer to each page.
 */
class App extends Component {
    render() {
        return (
            <div className="App">
                 <Auth/>
            </div>
        );
    }
}
export default App;
//export default withRouter(App); //TODO test to see if build works (change back if not???)
