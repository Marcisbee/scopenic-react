import React from 'react';
import { Link } from 'react-router-dom';

import Logout from '../logout';

const Header: React.FC = () => {
  return (
    <header>
      <div className="pure-menu pure-menu-horizontal">
        <ul className="pure-menu-list">
          <li className="pure-menu-item">
            <Link className="pure-menu-link" to="/projects">Projects</Link>
          </li>
          <li className="pure-menu-item">
            <Link className="pure-menu-link" to="/settings">Settings</Link>
          </li>
        </ul>
        <Logout className="pure-button">Log out</Logout>
      </div>
    </header>
  );
}

export default Header;
