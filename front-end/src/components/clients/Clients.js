import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { clientService } from '../../services/api';
import { useAuth } from '../../utils/AuthContext';
import './Clients.css';

const Clients = () => {
  const { currentUser } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for add/edit client modal
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientFormData, setClientFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_no: '',
  });
  const [clientError, setClientError] = useState('');
  const [clientSuccess, setClientSuccess] = useState('');

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        if (!currentUser || !currentUser.id) {
          setError('You must be logged in to view clients');
          setLoading(false);
          return;
        }

        const response = await clientService.getClientsByAgentId(currentUser.id);
        setClients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load clients: ' + (err.response?.data?.message || err.message));
        console.error('Error loading clients:', err);
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentUser]);

  // Handle client form input changes
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientFormData({
      ...clientFormData,
      [name]: value
    });
  };

  // Handle client form submission (create or edit)
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
      const agentId = currentUser ? currentUser.id : 0;
      
      const clientData = {
        ...clientFormData,
        agent_id: agentId
      };
      
      let response;
      if (editingClient) {
        // Update existing client
        await clientService.updateClient(editingClient.client_id, clientData);
        setClientSuccess('Client updated successfully!');
        
        // Update local state
        setClients(clients.map(client => 
          client.client_id === editingClient.client_id 
            ? { ...clientData, client_id: editingClient.client_id } 
            : client
        ));
      } else {
        // Create new client
        response = await clientService.createClient(clientData);
        setClientSuccess('Client added successfully!');
        
        // Add to local state with the returned ID
        const newClient = {
          ...clientData,
          client_id: response.data.client_id
        };
        setClients([...clients, newClient]);
      }
      
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
        setEditingClient(null);
      }, 2000);
      
    } catch (err) {
      setClientError('Failed to ' + (editingClient ? 'update' : 'add') + ' client: ' + (err.response?.data?.message || err.message));
      console.error(`Error ${editingClient ? 'updating' : 'adding'} client:`, err);
    }
  };

  // Handle edit client button click
  const handleEditClient = (client) => {
    setEditingClient(client);
    setClientFormData({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone_no: client.phone_no,
    });
    setShowClientModal(true);
  };

  // Handle delete client
  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(clientId);
        setClients(clients.filter(client => client.client_id !== clientId));
      } catch (err) {
        setError('Failed to delete client: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting client:', err);
      }
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      client.first_name.toLowerCase().includes(term) ||
      client.last_name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone_no.includes(term)
    );
  });

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="clients-wrapper">
      <Container className="clients-container">
        <div className="clients-header">
          <h1>
            <FontAwesomeIcon icon={faUsers} className="icon-accent" />
            My Clients
          </h1>
        </div>

        <Card className="clients-card">
          <Card.Body>
            <Row className="mb-3 clients-filters">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="clients-search-icon">
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="clients-search-input"
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="d-flex justify-content-md-end">
                <Button 
                  variant="primary" 
                  className="btn-kw-primary"
                  onClick={() => {
                    setEditingClient(null);
                    setClientFormData({
                      first_name: '',
                      last_name: '',
                      email: '',
                      phone_no: '',
                    });
                    setShowClientModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                  Add New Client
                </Button>
              </Col>
            </Row>

            {filteredClients.length === 0 ? (
              <div className="clients-empty-state">
                <h5>No clients found</h5>
                <p>
                  {clients.length === 0 
                    ? "You don't have any clients yet."
                    : "No clients match your search criteria."}
                </p>
              </div>
            ) : (
              <Table responsive hover className="clients-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(client => (
                    <tr key={client.client_id}>
                      <td>{client.first_name} {client.last_name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone_no}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="client-action-btn btn-kw-outline"
                          onClick={() => handleEditClient(client)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="client-action-btn"
                          onClick={() => handleDeleteClient(client.client_id)}
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

        {/* Add/Edit Client Modal */}
        <Modal show={showClientModal} onHide={() => setShowClientModal(false)} className="client-modal">
          <Modal.Header closeButton>
            <Modal.Title>{editingClient ? 'Edit Client' : 'Add New Client'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {clientError && <div className="alert alert-danger">{clientError}</div>}
            {clientSuccess && <div className="alert alert-success">{clientSuccess}</div>}
            
            <Form onSubmit={handleClientSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="client-form-label">First Name</Form.Label>
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
                    <Form.Label className="client-form-label">Last Name</Form.Label>
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
                <Form.Label className="client-form-label">Email</Form.Label>
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
                <Form.Label className="client-form-label">Phone Number</Form.Label>
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
                <Button variant="primary" type="submit" className="client-submit-button">
                  {editingClient ? 'Update Client' : 'Add Client'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Clients; 