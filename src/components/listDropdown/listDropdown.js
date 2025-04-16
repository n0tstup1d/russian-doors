import { NavLink } from 'react-router-dom';
import './listDrop.css'

export default function ListDropdown({ to, children }) { 
    return (
      <li className="nav-item">
        <NavLink
          to={to}
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          {children}
        </NavLink>
    </li>
    );
  }