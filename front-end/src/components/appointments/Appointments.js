import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { appointmentService, clientService, listingService } from '../../services/api';
import { useAuth } from '../../utils/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faSearch, faFilter, faHome, faUser, faClock, faEdit, faTrash, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import './Appointments.css';

const Appointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState({});
  const [listings, setListings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [searchTerm, setSearchTerm] = useState('');

  // State for edit appointment modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [appointmentFormData, setAppointmentFormData] = useState({
    appointment_date: '',
    time: '',
    purpose: '',
    listing_price: '',
    listing_id: 0,
    client_id: 0
  });
  const [appointmentError, setAppointmentError] = useState('');
  const [appointmentSuccess, setAppointmentSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser || !currentUser.id) {
          setError('You must be logged in to view appointments');
          setLoading(false);
          return;
        }

        // Get all appointments for the agent
        const appointmentsRes = await appointmentService.getAppointmentsByAgentId(currentUser.id);
        const appointmentsData = appointmentsRes.data;
        setAppointments(appointmentsData);

        // Get client details for the appointments
        const clientIds = [...new Set(appointmentsData.map(a => a.client_id))];
        const clientsData = await clientService.getClientsByAgentId(currentUser.id);
        
        const clientsMap = {};
        clientsData.data.forEach(client => {
          if (clientIds.includes(client.client_id)) {
            clientsMap[client.client_id] = client;
          }
        });
        setClients(clientsMap);

        // Get listing details for the appointments
        const listingIds = [...new Set(appointmentsData.map(a => a.listing_id))];
        const listingsRes = await listingService.getListingsByAgentId(currentUser.id);
        
        const listingsMap = {};
        listingsRes.data.forEach(listing => {
          if (listingIds.includes(listing.listing_id)) {
            listingsMap[listing.listing_id] = listing;
          }
        });
        setListings(listingsMap);

      } catch (err) {
        setError('Failed to load appointments: ' + (err.response?.data?.message || err.message));
        console.error('Error loading appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Handle edit appointment button click
  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setAppointmentFormData({
      appointment_date: appointment.appointment_date,
      time: appointment.time,
      purpose: appointment.purpose || '',
      listing_price: appointment.listing_price || '',
      listing_id: appointment.listing_id,
      client_id: appointment.client_id
    });
    setShowAppointmentModal(true);
  };

  // Handle appointment form input changes
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentFormData({
      ...appointmentFormData,
      [name]: value
    });
  };

  // Handle appointment form submission (edit)
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setAppointmentError('');
    setAppointmentSuccess('');
    
    try {
      if (!appointmentFormData.appointment_date || !appointmentFormData.time) {
        setAppointmentError('Date and time are required');
        return;
      }
      
      // Get current user's agent ID
      const agentId = currentUser ? currentUser.id : 0;
      
      const appointmentData = {
        ...appointmentFormData,
        agent_id: agentId
      };
      
      // Update existing appointment
      await appointmentService.updateAppointment(editingAppointment.appointment_id, appointmentData);
      setAppointmentSuccess('Appointment updated successfully!');
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment.appointment_id === editingAppointment.appointment_id 
          ? { ...appointmentData, appointment_id: editingAppointment.appointment_id } 
          : appointment
      ));
      
      // Close modal after a delay
      setTimeout(() => {
        setShowAppointmentModal(false);
        setAppointmentSuccess('');
        setEditingAppointment(null);
      }, 2000);
      
    } catch (err) {
      setAppointmentError('Failed to update appointment: ' + (err.response?.data?.message || err.message));
      console.error('Error updating appointment:', err);
    }
  };

  // Handle delete appointment
  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteAppointment(appointmentId);
        // Update local state
        setAppointments(appointments.filter(appointment => appointment.appointment_id !== appointmentId));
      } catch (err) {
        setError('Failed to delete appointment: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting appointment:', err);
      }
    }
  };

  const getStatusBadge = (appointment) => {
    const today = new Date();
    const appDate = new Date(appointment.appointment_date);
    
    // Compare dates without time
    today.setHours(0, 0, 0, 0);
    appDate.setHours(0, 0, 0, 0);
    
    if (appDate < today) {
      return <Badge bg="secondary" className="badge-past">Past</Badge>;
    } else if (appDate.getTime() === today.getTime()) {
      return <Badge bg="warning" className="badge-today">Today</Badge>;
    } else {
      return <Badge bg="success" className="badge-upcoming">Upcoming</Badge>;
    }
  };

  const filterAppointments = () => {
    if (!appointments.length) return [];
    
    let filtered = [...appointments];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Apply date filter
    if (filter === 'upcoming') {
      filtered = filtered.filter(appointment => {
        const appDate = new Date(appointment.appointment_date);
        appDate.setHours(0, 0, 0, 0);
        return appDate >= today;
      });
    } else if (filter === 'past') {
      filtered = filtered.filter(appointment => {
        const appDate = new Date(appointment.appointment_date);
        appDate.setHours(0, 0, 0, 0);
        return appDate < today;
      });
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => {
        // Search in client name
        const client = clients[appointment.client_id];
        const clientName = client ? 
          `${client.first_name} ${client.last_name}`.toLowerCase() : '';
        
        // Search in purpose
        const purpose = appointment.purpose ? appointment.purpose.toLowerCase() : '';
        
        // Search in listing address
        const listing = listings[appointment.listing_id];
        let listingAddress = '';
        
        if (listing && listing.property_id) {
          // This is a simplification. In a real app you'd fetch property details
          listingAddress = `Listing #${listing.listing_id}`.toLowerCase();
        }
        
        return clientName.includes(term) || 
               purpose.includes(term) || 
               listingAddress.includes(term) ||
               appointment.appointment_date.includes(term);
      });
    }
    
    // Sort by date (newest first for upcoming, oldest first for past)
    filtered.sort((a, b) => {
      const dateA = new Date(a.appointment_date);
      const dateB = new Date(b.appointment_date);
      
      if (filter === 'past') {
        return dateB - dateA; // Most recent past appointments first
      } else {
        return dateA - dateB; // Closest upcoming appointments first
      }
    });
    
    return filtered;
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  const filteredAppointments = filterAppointments();

  return (
    <div className="appointments-wrapper">
      <Container className="appointments-container">
        <div className="appointments-header">
          <h1>
            <FontAwesomeIcon icon={faCalendarAlt} className="icon-accent" />
            My Appointments
          </h1>
        </div>

        <Card className="appointments-card">
          <Card.Body>
            <Row className="mb-3 appointments-filters">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="appointments-search-icon">
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="appointments-search-input"
                  />
                </InputGroup>
              </Col>
              <Col md={6}>
                <div className="d-flex justify-content-md-end">
                  <Form.Group>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faFilter} />
                      </InputGroup.Text>
                      <Form.Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appointments-filter-select"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                        <option value="all">All</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </div>
              </Col>
            </Row>

            {filteredAppointments.length === 0 ? (
              <div className="appointments-empty-state">
                <h5>No appointments found</h5>
                <p>
                  {filter === 'upcoming' 
                    ? "You don't have any upcoming appointments."
                    : filter === 'past'
                    ? "You don't have any past appointments."
                    : "You don't have any appointments."}
                </p>
              </div>
            ) : (
              <Table responsive hover className="appointments-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th><FontAwesomeIcon icon={faCalendarAlt} className="me-2 icon" />Date</th>
                    <th><FontAwesomeIcon icon={faClock} className="me-2 icon" />Time</th>
                    <th><FontAwesomeIcon icon={faUser} className="me-2 icon" />Client</th>
                    <th><FontAwesomeIcon icon={faHome} className="me-2 icon" />Property</th>
                    <th>Purpose</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(appointment => (
                    <tr key={appointment.appointment_id}>
                      <td>{getStatusBadge(appointment)}</td>
                      <td>{appointment.appointment_date}</td>
                      <td>{appointment.time}</td>
                      <td>
                        {clients[appointment.client_id] ? (
                          <span className="client-info">
                            {clients[appointment.client_id].first_name} {clients[appointment.client_id].last_name}
                            <br />
                            <small className="client-email">{clients[appointment.client_id].email}</small>
                          </span>
                        ) : (
                          `Client #${appointment.client_id}`
                        )}
                      </td>
                      <td>
                        {listings[appointment.listing_id] ? (
                          <Button 
                            variant="link" 
                            href={`/listings/${appointment.listing_id}`}
                            className="p-0 auth-link"
                          >
                            Listing #{appointment.listing_id}
                          </Button>
                        ) : (
                          `Listing #${appointment.listing_id}`
                        )}
                      </td>
                      <td>{appointment.purpose}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="appointment-action-btn btn-kw-outline me-2"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="appointment-action-btn"
                          onClick={() => handleDeleteAppointment(appointment.appointment_id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Edit Appointment Modal */}
        <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} className="appointment-modal">
          <Modal.Header closeButton>
            <Modal.Title>
              <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
              Edit Appointment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {appointmentError && <div className="alert alert-danger">{appointmentError}</div>}
            {appointmentSuccess && <div className="alert alert-success">{appointmentSuccess}</div>}
            
            <Form onSubmit={handleAppointmentSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="appointment-form-label">Date</Form.Label>
                <Form.Control 
                  type="date" 
                  name="appointment_date" 
                  value={appointmentFormData.appointment_date} 
                  onChange={handleAppointmentChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="appointment-form-label">Time</Form.Label>
                <Form.Control 
                  type="time" 
                  name="time" 
                  value={appointmentFormData.time} 
                  onChange={handleAppointmentChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="appointment-form-label">Purpose</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  name="purpose" 
                  value={appointmentFormData.purpose} 
                  onChange={handleAppointmentChange}
                  placeholder="Appointment purpose..."
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="appointment-form-label">Listing Price</Form.Label>
                <Form.Control 
                  type="text" 
                  name="listing_price" 
                  value={appointmentFormData.listing_price} 
                  onChange={handleAppointmentChange}
                  placeholder="$250,000"
                />
              </Form.Group>
              
              <div className="d-grid gap-2 mt-4">
                <Button variant="primary" type="submit" className="appointment-submit-button">
                  Update Appointment
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Appointments; 