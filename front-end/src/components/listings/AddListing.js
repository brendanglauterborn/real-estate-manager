import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { listingService, propertyService } from '../../services/api';
import { useAuth } from '../../utils/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './AddEditListing.css';

const AddListing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Combined form data for both property and listing
  const [formData, setFormData] = useState({
    // Property fields
    address: '',
    type: '',
    features: '',
    
    // Listing fields
    listing_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    description: '',
    listing_price: '',
    agent_id: currentUser ? currentUser.id : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Create a new property
      const propertyData = {
        address: formData.address,
        type: formData.type,
        features: formData.features
      };
      
      const propertyResponse = await propertyService.createProperty(propertyData);
      const newPropertyId = propertyResponse.data.property_id;
      
      // Step 2: Create a new listing using the newly created property ID
      const listingData = {
        listing_date: formData.listing_date,
        status: formData.status,
        description: formData.description,
        listing_price: formData.listing_price,
        property_id: newPropertyId,
        agent_id: parseInt(formData.agent_id, 10)
      };
      
      await listingService.createListing(listingData);
      navigate('/listings');
    } catch (err) {
      setError('Failed to create listing: ' + (err.response?.data?.message || err.message));
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="listing-form-wrapper">
      <Container className="listing-form-container">
        <Row className="justify-content-center">
          <Col md={9}>
            <Button 
              variant="link" 
              className="mb-3 p-0 text-decoration-none" 
              onClick={() => navigate('/listings')}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Listings
            </Button>
            
            <Card className="listing-form-card">
              <Card.Header as="h4">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add New Listing
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <h5 className="form-section-title">
                    <FontAwesomeIcon icon={faHome} className="me-2" />
                    Property Information
                  </h5>
                  <Form.Group className="mb-3">
                    <Form.Label className="listing-form-label">Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full property address"
                      className="listing-form-control"
                      required
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="listing-form-label">Property Type</Form.Label>
                        <Form.Select
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="listing-form-control"
                          required
                        >
                          <option value="">Select a type</option>
                          <option value="Apartment">Apartment</option>
                          <option value="House">House</option>
                          <option value="Condo">Condo</option>
                          <option value="Townhouse">Townhouse</option>
                          <option value="Villa">Villa</option>
                          <option value="Land">Land</option>
                          <option value="Commercial">Commercial</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="listing-form-label">Listing Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="listing_date"
                          value={formData.listing_date}
                          onChange={handleChange}
                          className="listing-form-control"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="listing-form-label">Features</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="features"
                      value={formData.features}
                      onChange={handleChange}
                      placeholder="e.g. 3 bed, 2 bath, garden, pool, etc."
                      className="listing-form-control"
                      required
                    />
                  </Form.Group>
                  
                  <div className="form-divider"></div>
                  
                  <h5 className="form-section-title">Listing Information</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="listing-form-label">Price</Form.Label>
                        <Form.Control
                          type="text"
                          name="listing_price"
                          value={formData.listing_price}
                          onChange={handleChange}
                          placeholder="e.g. 250000"
                          className="listing-form-control"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="listing-form-label">Status</Form.Label>
                        <Form.Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="listing-form-control"
                          required
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Sold">Sold</option>
                          <option value="Withdrawn">Withdrawn</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="listing-form-label">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the property"
                      className="listing-form-control"
                      required
                    />
                  </Form.Group>

                  <div className="form-button-group">
                    <Button 
                      variant="secondary" 
                      className="form-cancel-btn"
                      onClick={() => navigate('/listings')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="form-submit-btn"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Listing'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddListing; 