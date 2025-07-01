import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../utils/AuthContext';
import { listingService, appointmentService, clientService } from '../../services/api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCalendarAlt, 
  faUsers, 
  faPlus, 
  faChartLine, 
  faDollarSign, 
  faClock 
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [listings, setListings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.id) {
          const [listingsRes, appointmentsRes, clientsRes] = await Promise.all([
            listingService.getListingsByAgentId(currentUser.id),
            appointmentService.getAppointmentsByAgentId(currentUser.id),
            clientService.getClientsByAgentId(currentUser.id)
          ]);
          
          setListings(listingsRes.data);
          setAppointments(appointmentsRes.data);

          // Filter upcoming appointments (today or in the future)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const upcoming = appointmentsRes.data.filter(appointment => {
            const appDate = new Date(appointment.appointment_date);
            appDate.setHours(0, 0, 0, 0);
            return appDate >= today;
          }).sort((a, b) => {
            return new Date(a.appointment_date) - new Date(b.appointment_date);
          });

          setUpcomingAppointments(upcoming);
          setClients(clientsRes.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">!</div>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="btn-kw">Retry</button>
    </div>
  );

  // Calculate recent clients with most recent first
  const recentClients = [...clients].sort((a, b) => b.client_id - a.client_id).slice(0, 3);
  
  // Calculate recent listings with most recent first
  const recentListings = [...listings].sort((a, b) => b.listing_id - a.listing_id).slice(0, 3);

  return (
    <div className="dashboard-wrapper">
      <Container fluid className="dashboard-container">
        <div className="dashboard-header">
          <h1>
            <FontAwesomeIcon icon={faChartLine} className="icon-accent" />
            Welcome, {currentUser.firstName}
          </h1>
          <p className="header-subtitle">Your Real Estate Dashboard</p>
        </div>
        
        <Row className="stats-row mb-4">
          <Col lg={4} md={4} sm={12} className="mb-4 mb-md-0">
            <Card className="dashboard-card stat-card">
              <Card.Body>
                <div className="stat-icon-container listing-icon">
                  <FontAwesomeIcon icon={faHome} />
                </div>
                <div className="stat-content">
                  <h3>{listings.length}</h3>
                  <p>Active Listings</p>
                  <Link to="/listings" className="stat-link">View All</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={4} sm={12} className="mb-4 mb-md-0">
            <Card className="dashboard-card stat-card">
              <Card.Body>
                <div className="stat-icon-container appointment-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className="stat-content">
                  <h3>{upcomingAppointments.length}</h3>
                  <p>Upcoming Appointments</p>
                  <Link to="/appointments" className="stat-link">View All</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={4} sm={12} className="mb-4 mb-md-0">
            <Card className="dashboard-card stat-card">
              <Card.Body>
                <div className="stat-icon-container client-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="stat-content">
                  <h3>{clients.length}</h3>
                  <p>Total Clients</p>
                  <Link to="/clients" className="stat-link">View All</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col lg={8} md={12}>
            <Card className="dashboard-card listing-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h2><FontAwesomeIcon icon={faHome} className="me-2" /> Recent Listings</h2>
                <Link to="/listings/new" className="btn-add">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Listing</span>
                </Link>
              </Card.Header>
              <Card.Body className="p-0">
                {recentListings.length > 0 ? (
                  <div className="listing-list">
                    {recentListings.map((listing, index) => (
                      <Link 
                        key={listing.listing_id} 
                        to={`/listings/${listing.listing_id}`} 
                        className="listing-item"
                      >
                        <div className="listing-info">
                          <h3>Property #{listing.property_id}</h3>
                          <p className="listing-description">{listing.description || 'No description available'}</p>
                          <div className="listing-meta">
                            <span className={`status-badge status-${listing.status?.toLowerCase() || 'active'}`}>
                              {listing.status || 'Active'}
                            </span>
                          </div>
                        </div>
                        <div className="listing-price">
                          <FontAwesomeIcon icon={faDollarSign} />
                          <span>{listing.listing_price || 'N/A'}</span>
                        </div>
                      </Link>
                    ))}
                    {recentListings.length < listings.length && (
                      <Link to="/listings" className="view-all-link">
                        View all {listings.length} listings
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <FontAwesomeIcon icon={faHome} />
                    </div>
                    <p>No listings found</p>
                    <Link to="/listings/new" className="btn-kw">
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Add New Listing
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={12} className="mt-4 mt-lg-0">
            <Card className="dashboard-card appointment-card">
              <Card.Header>
                <h2><FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> Today's Schedule</h2>
              </Card.Header>
              <Card.Body className="p-0">
                {upcomingAppointments.length > 0 ? (
                  <div className="appointment-list">
                    {upcomingAppointments.slice(0, 3).map(appointment => {
                      // Find client info if available
                      const client = clients.find(c => c.client_id === appointment.client_id);
                      
                      return (
                        <div key={appointment.appointment_id} className="appointment-item">
                          <div className="appointment-time">
                            <FontAwesomeIcon icon={faClock} />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="appointment-info">
                            <h3>{appointment.purpose || 'Appointment'}</h3>
                            <p className="appointment-date">{appointment.appointment_date}</p>
                            <p className="appointment-client">
                              {client ? `${client.first_name} ${client.last_name}` : `Client #${appointment.client_id}`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {upcomingAppointments.length > 3 && (
                      <Link to="/appointments" className="view-all-link">
                        View all {upcomingAppointments.length} upcoming appointments
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <p>No upcoming appointments</p>
                    <Link to="/appointments" className="btn-kw-outline">
                      View Appointments
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>
            
            <Card className="dashboard-card client-card mt-4">
              <Card.Header>
                <h2><FontAwesomeIcon icon={faUsers} className="me-2" /> Recent Clients</h2>
              </Card.Header>
              <Card.Body className="p-0">
                {recentClients.length > 0 ? (
                  <div className="client-list">
                    {recentClients.map(client => (
                      <div key={client.client_id} className="client-item">
                        <div className="client-avatar">
                          {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                        </div>
                        <div className="client-info">
                          <h3>{client.first_name} {client.last_name}</h3>
                          <p className="client-email">{client.email}</p>
                          <p className="client-phone">{client.phone_no}</p>
                        </div>
                      </div>
                    ))}
                    {recentClients.length < clients.length && (
                      <Link to="/clients" className="view-all-link">
                        View all {clients.length} clients
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <p>No clients found</p>
                    <Link to="/clients" className="btn-kw-outline">
                      Add Clients
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard; 