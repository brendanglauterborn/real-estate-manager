import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Table, Tabs, Tab, Modal, Form } from 'react-bootstrap';
import { listingService, propertyService, appointmentService, clientService } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowLeft, faCalendarAlt, faUsers, faHome, faDollarSign, faCalendar, faInfoCircle, faTag } from '@fortawesome/free-solid-svg-icons';
import './ListingDetail.css';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [property, setProperty] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for appointment scheduling modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentFormData, setAppointmentFormData] = useState({
    appointment_date: new Date().toISOString().split('T')[0],
    time: '12:00',
    purpose: '',
    client_id: '',
    listing_price: '',
  });
  const [availableClients, setAvailableClients] = useState([]);
  const [appointmentError, setAppointmentError] = useState('');
  const [appointmentSuccess, setAppointmentSuccess] = useState('');

  // State for client creation modal
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientFormData, setClientFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_no: '',
  });
  const [clientError, setClientError] = useState('');
  const [clientSuccess, setClientSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get listings by agent ID
        const listingsRes = await listingService.getListingsByAgentId(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : 0);
        const foundListing = listingsRes.data.find(l => l.listing_id === parseInt(id));
        
        if (!foundListing) {
          setError('Listing not found');
          setLoading(false);
          return;
        }
        
        setListing(foundListing);
        
        // Get property details
        const propertyRes = await propertyService.getPropertyById(foundListing.property_id);
        setProperty(propertyRes.data);
        
        // Get appointments for this listing
        const appointmentsRes = await appointmentService.getAppointmentsByListingId(foundListing.listing_id);
        setAppointments(appointmentsRes.data);
        
        // Get client details for each appointment
        const clientsMap = {};
        const clientPromises = appointmentsRes.data.map(appointment => 
          clientService.getClientsByAgentId(foundListing.agent_id)
            .then(res => {
              const client = res.data.find(c => c.client_id === appointment.client_id);
              if (client) {
                clientsMap[client.client_id] = client;
              }
            })
        );
        
        await Promise.all(clientPromises);
        setClients(clientsMap);
        
      } catch (err) {
        setError('Failed to load listing details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Load available clients when modal opens
  useEffect(() => {
    if (showAppointmentModal && listing) {
      const fetchClients = async () => {
        try {
          const response = await clientService.getClientsByAgentId(listing.agent_id);
          setAvailableClients(response.data);
        } catch (err) {
          console.error('Failed to load clients:', err);
          setAppointmentError('Failed to load clients');
        }
      };
      
      fetchClients();
      
      // Set the listing price from the current listing
      setAppointmentFormData(prev => ({
        ...prev,
        listing_price: listing.listing_price
      }));
    }
  }, [showAppointmentModal, listing]);

  // Refresh client list whenever client modal is closed after successful creation
  useEffect(() => {
    if (!showClientModal && clientSuccess && listing) {
      const fetchClients = async () => {
        try {
          const response = await clientService.getClientsByAgentId(listing.agent_id);
          setAvailableClients(response.data);
        } catch (err) {
          console.error('Failed to refresh clients:', err);
        }
      };
      
      fetchClients();
    }
  }, [showClientModal, clientSuccess, listing]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await listingService.deleteListing(id);
        navigate('/listings');
      } catch (err) {
        setError('Failed to delete listing');
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
        return <Badge bg="success" className="badge-active listing-badge">Active</Badge>;
      case 'pending':
        return <Badge bg="warning" className="badge-pending listing-badge">Pending</Badge>;
      case 'sold':
        return <Badge bg="primary" className="badge-sold listing-badge">Sold</Badge>;
      default:
        return <Badge bg="secondary" className="listing-badge">{status}</Badge>;
    }
  };

  // Handle appointment form input changes
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentFormData({
      ...appointmentFormData,
      [name]: value
    });
  };

  // Handle client form input changes
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientFormData({
      ...clientFormData,
      [name]: value
    });
  };

  // Handle appointment form submission
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setAppointmentError('');
    setAppointmentSuccess('');
    
    try {
      if (!appointmentFormData.client_id) {
        setAppointmentError('Please select a client');
        return;
      }
      
      const appointmentData = {
        appointment_date: appointmentFormData.appointment_date,
        time: appointmentFormData.time,
        purpose: appointmentFormData.purpose,
        listing_price: appointmentFormData.listing_price,
        listing_id: parseInt(id, 10),
        agent_id: listing.agent_id,
        client_id: parseInt(appointmentFormData.client_id, 10)
      };
      
      await appointmentService.createAppointment(appointmentData);
      
      // Refresh appointments list
      const appointmentsRes = await appointmentService.getAppointmentsByListingId(parseInt(id, 10));
      setAppointments(appointmentsRes.data);
      
      // Show success message
      setAppointmentSuccess('Appointment scheduled successfully!');
      
      // Reset form
      setAppointmentFormData({
        appointment_date: new Date().toISOString().split('T')[0],
        time: '12:00',
        purpose: '',
        client_id: '',
        listing_price: listing.listing_price
      });
      
      // Close modal after a delay
      setTimeout(() => {
        setShowAppointmentModal(false);
        setAppointmentSuccess('');
      }, 2000);
      
    } catch (err) {
      setAppointmentError('Failed to schedule appointment: ' + (err.response?.data?.message || err.message));
      console.error('Error scheduling appointment:', err);
      setLoading(false);
    }
  };

  // Handle client form submission
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setClientError('');
    setClientSuccess('');
    
    try {
      if (!clientFormData.email) {
        setClientError('Email is required');
        return;
      }
      
      // Get current user's agent ID
      const agentId = listing ? listing.agent_id : 
                     (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : 0);
      
      const clientData = {
        ...clientFormData,
        agent_id: agentId
      };
      
      await clientService.createClient(clientData);
      
      // Show success message
      setClientSuccess('Client added successfully!');
      
      // Reset form
      setClientFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_no: '',
      });
      
      // Close modal after a delay
      setTimeout(() => {
        setShowClientModal(false);
        setClientSuccess('');
      }, 2000);
      
    } catch (err) {
      setClientError('Failed to add client: ' + (err.response?.data?.message || err.message));
      console.error('Error adding client:', err);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!listing) return <div className="text-center mt-5">Listing not found</div>;

  return (
    <div className="listing-detail-wrapper">
      <Container className="listing-detail-container">
        <Link to="/listings" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} className="icon" />
          Back to Listings
        </Link>

        <div className="listing-header">
          <h1>
            Listing #{listing.listing_id}
            {getStatusBadge(listing.status)}
          </h1>
          <div>
            <Link 
              to={`/listings/edit/${listing.listing_id}`} 
              className="btn btn-kw-outline me-2"
              onClick={(e) => {
                e.preventDefault();
                console.log('Navigating to edit page for listing ID:', listing.listing_id);
                navigate(`/listings/edit/${listing.listing_id}`);
              }}
            >
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Link>
            <Button variant="outline-danger" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Delete
            </Button>
          </div>
        </div>

        <Row>
          <Col lg={8}>
            <Card className="listing-card mb-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5><FontAwesomeIcon icon={faHome} className="icon" /> Property Details</h5>
                    {property ? (
                      <div>
                        <p><strong>Address:</strong> {property.address}</p>
                        <p><strong>Type:</strong> {property.type}</p>
                        <p><strong>Features:</strong> {property.features}</p>
                      </div>
                    ) : (
                      <p>Property information not available</p>
                    )}
                  </Col>
                  <Col md={6}>
                    <h5><FontAwesomeIcon icon={faInfoCircle} className="icon" /> Listing Details</h5>
                    <p><strong>Price:</strong> <span className="text-success">${listing.listing_price}</span></p>
                    <p><strong>Date Listed:</strong> {listing.listing_date}</p>
                    <p><strong>Status:</strong> {getStatusBadge(listing.status)}</p>
                  </Col>
                </Row>
                <hr />
                <h5 className="mt-3"><FontAwesomeIcon icon={faTag} className="icon" /> Description</h5>
                <p className="listing-description">{listing.description}</p>
              </Card.Body>
            </Card>

            <Tabs defaultActiveKey="appointments" className="listing-tabs mb-4">
              <Tab eventKey="appointments" title={<span><FontAwesomeIcon icon={faCalendarAlt} className="icon" /> Appointments</span>}>
                <Card className="listing-card">
                  <Card.Body>
                    {appointments.length > 0 ? (
                      <Table striped bordered hover responsive className="listing-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Client</th>
                            <th>Purpose</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map(appointment => (
                            <tr key={appointment.appointment_id}>
                              <td>{appointment.appointment_date}</td>
                              <td>{appointment.time}</td>
                              <td>
                                {clients[appointment.client_id] ? (
                                  `${clients[appointment.client_id].first_name} ${clients[appointment.client_id].last_name}`
                                ) : (
                                  `Client #${appointment.client_id}`
                                )}
                              </td>
                              <td>{appointment.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center p-4">
                        <p className="mb-0 text-muted">No appointments scheduled for this listing</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="clients" title={<span><FontAwesomeIcon icon={faUsers} className="icon" /> Interested Clients</span>}>
                <Card className="listing-card">
                  <Card.Body>
                    {Object.keys(clients).length > 0 ? (
                      <Table striped bordered hover responsive className="listing-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.values(clients).map(client => (
                            <tr key={client.client_id}>
                              <td>{client.first_name} {client.last_name}</td>
                              <td>{client.email}</td>
                              <td>{client.phone_no}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center p-4">
                        <p className="mb-0 text-muted">No interested clients for this listing</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>

          <Col lg={4}>
            <Card className="listing-card action-card">
              <Card.Header as="h5">Actions</Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button 
                    variant="success" 
                    className="action-button"
                    onClick={() => setShowAppointmentModal(true)}
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    Schedule Appointment
                  </Button>
                  <Button 
                    variant="outline-primary"
                    className="action-button outline"
                    onClick={() => setShowClientModal(true)}
                  >
                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                    Add Client
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Appointment Scheduling Modal */}
        <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} className="kw-modal">
          <Modal.Header closeButton>
            <Modal.Title>Schedule Appointment for Listing #{id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {appointmentError && <div className="alert alert-danger">{appointmentError}</div>}
            {appointmentSuccess && <div className="alert alert-success">{appointmentSuccess}</div>}
            
            <Form onSubmit={handleAppointmentSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="kw-form-label">Select Client</Form.Label>
                <Form.Select 
                  name="client_id" 
                  value={appointmentFormData.client_id} 
                  onChange={handleAppointmentChange}
                  required
                >
                  <option value="">Select a client</option>
                  {availableClients.map(client => (
                    <option key={client.client_id} value={client.client_id}>
                      {client.first_name} {client.last_name} ({client.email})
                    </option>
                  ))}
                </Form.Select>
                <div className="mt-2">
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => {
                      setShowAppointmentModal(false);
                      setShowClientModal(true);
                    }}
                    className="p-0 auth-link"
                  >
                    + Add a new client
                  </Button>
                </div>
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="kw-form-label">Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="appointment_date" 
                      value={appointmentFormData.appointment_date} 
                      onChange={handleAppointmentChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="kw-form-label">Time</Form.Label>
                    <Form.Control 
                      type="time" 
                      name="time" 
                      value={appointmentFormData.time} 
                      onChange={handleAppointmentChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label className="kw-form-label">Purpose</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  name="purpose" 
                  value={appointmentFormData.purpose} 
                  onChange={handleAppointmentChange}
                  placeholder="e.g. Property viewing, discussion of offer, etc."
                  required
                />
              </Form.Group>
              
              <div className="d-grid gap-2 mt-4">
                <Button variant="primary" type="submit" className="kw-submit-button">
                  Schedule Appointment
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Add Client Modal */}
        <Modal show={showClientModal} onHide={() => setShowClientModal(false)} className="kw-modal">
          <Modal.Header closeButton>
            <Modal.Title>Add New Client</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {clientError && <div className="alert alert-danger">{clientError}</div>}
            {clientSuccess && <div className="alert alert-success">{clientSuccess}</div>}
            
            <Form onSubmit={handleClientSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="kw-form-label">First Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="first_name" 
                      value={clientFormData.first_name} 
                      onChange={handleClientChange}
                      placeholder="John"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="kw-form-label">Last Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="last_name" 
                      value={clientFormData.last_name} 
                      onChange={handleClientChange}
                      placeholder="Doe"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label className="kw-form-label">Email</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  value={clientFormData.email} 
                  onChange={handleClientChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="kw-form-label">Phone Number</Form.Label>
                <Form.Control 
                  type="tel" 
                  name="phone_no" 
                  value={clientFormData.phone_no} 
                  onChange={handleClientChange}
                  placeholder="(123) 456-7890"
                  required
                />
              </Form.Group>
              
              <div className="d-grid gap-2 mt-4">
                <Button variant="primary" type="submit" className="kw-submit-button">
                  Add Client
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default ListingDetail; 