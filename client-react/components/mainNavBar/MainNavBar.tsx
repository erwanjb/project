import React from 'react';
import { Link } from "react-router-dom";
class MainNavBar extends React.Component {
    render() {
      return (
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>);
    }
}

export default MainNavBar;