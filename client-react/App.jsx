import React from 'react';
import Home from './components/pages/Home';
import About from './components/pages/About';
import MainNavBar from './components/mainNavBar/MainNavBar'
import 'antd/dist/antd.css';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import axios from 'axios'

class App extends React.Component{
  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      axios.defaults.baseURL = 'http://localhost:' + process.env.PORT;
    }
  }
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <MainNavBar></MainNavBar>

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
