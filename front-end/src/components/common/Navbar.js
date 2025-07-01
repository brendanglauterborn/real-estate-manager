import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faUserCircle, 
  faHome, 
  faCalendarAlt, 
  faUsers, 
  faTachometerAlt
} from '@fortawesome/free-solid-svg-icons';
import KWLogo from './KWLogo';
import './Navbar.css';

const AppNavbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scrolling effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if the path is active
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Navbar 
      expand="lg" 
      className={`main-navbar ${scrolled ? 'navbar-scrolled' : ''}`} 
      fixed="top"
    >
      <Container fluid className="navbar-container">
        <Navbar.Brand as={Link} to={currentUser ? "/dashboard" : "/"}>
          <div className="brand-container">
            <KWLogo size="large" style={{ zIndex: 30 }} />
            <div className="brand-text">Keller Williams Realty</div>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav">
          <span className="navbar-toggler-icon custom-toggler"></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="navbar-nav">
          {currentUser && (
            <Nav className="main-nav me-auto">
              <Nav.Link 
                as={Link} 
                to="/dashboard" 
                className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                <span className="nav-text">Dashboard</span>
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/listings" 
                className={`nav-item ${isActive('/listings') ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                <span className="nav-text">Listings</span>
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/appointments" 
                className={`nav-item ${isActive('/appointments') ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />
                <span className="nav-text">Appointments</span>
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/clients" 
                className={`nav-item ${isActive('/clients') ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faUsers} className="nav-icon" />
                <span className="nav-text">Clients</span>
              </Nav.Link>
            </Nav>
          )}
          
          <Nav className="ms-auto user-nav">
            {currentUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle as="div" className="user-dropdown">
                  <div className="user-avatar">
                    {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                  </div>
                  <div className="user-info d-none d-lg-flex">
                    <div className="user-name">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div className="user-role">Agent</div>
                  </div>
                </Dropdown.Toggle>
                
                <Dropdown.Menu className="user-dropdown-menu">
                  <div className="dropdown-user-details d-lg-none">
                    <div className="dropdown-user-name">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div className="dropdown-user-email">{currentUser.email}</div>
                  </div>
                  <Dropdown.Divider className="d-lg-none" />
                  <Dropdown.Item as={Link} to="/dashboard" className="dropdown-item">
                    <FontAwesomeIcon icon={faTachometerAlt} className="dropdown-icon" />
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profile" className="dropdown-item">
                    <FontAwesomeIcon icon={faUserCircle} className="dropdown-icon" />
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="dropdown-item logout-item">
                    <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="auth-buttons">
                <Button as={Link} to="/login" variant="outline-light" className="btn-auth btn-login">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary" className="btn-auth btn-register">
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar; 