import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { listingService, propertyService } from '../../services/api';
import { useAuth } from '../../utils/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './AddEditListing.css';

const EditListing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Combined form data for both property and listing
  const [formData, setFormData] = useState({
    // Property fields
    property_id: '',
    address: '',
    type: '',
    features: '',
    
    // Listing fields
    listing_id: '',
    listing_date: '',
    status: '',
    description: '',
    listing_price: '',
    agent_id: currentUser ? currentUser.id : ''
  });

  // Fetch existing listing and property data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) {
          setError('You must be logged in to edit listings');
          setLoading(false);
          return;
        }

        // Parse ID parameter to ensure it's a number
        const listingId = parseInt(id, 10);
        if (isNaN(listingId)) {
          setError('Invalid listing ID');
          setLoading(false);
          return;
        }
        
        // Get listings by agent ID to find the correct listing
        const listingsRes = await listingService.getListingsByAgentId(currentUser.id);
        const foundListing = listingsRes.data.find(l => l.listing_id === listingId);
        
        if (!foundListing) {
          setError('Listing not found');
          setLoading(false);
          return;
        }
        
        // Get property details
        const propertyRes = await propertyService.getPropertyById(foundListing.property_id);
        const property = propertyRes.data;
        
        if (!property) {
          setError('Property information not available');
          setLoading(false);
          return;
        }
        
        // Set form data with existing values
        setFormData({
          // Property fields
          property_id: property.property_id,
          address: property.address,
          type: property.type,
          features: property.features,
          
          // Listing fields
          listing_id: foundListing.listing_id,
          listing_date: foundListing.listing_date,
          status: foundListing.status,
          description: foundListing.description,
          listing_price: foundListing.listing_price,
          agent_id: foundListing.agent_id
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load listing details: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]);

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
      // Update property first
      const propertyData = {
        address: formData.address,
        type: formData.type,
        features: formData.features
      };
      
      await propertyService.updateProperty(formData.property_id, propertyData);
      
      // Then update listing
      const listingData = {
        listing_date: formData.listing_date,
        status: formData.status,
        description: formData.description,
        listing_price: formData.listing_price,
        property_id: formData.property_id,
        agent_id: parseInt(formData.agent_id, 10)
      };
      
      await listingService.updateListing(formData.listing_id, listingData);
      navigate(`/listings/${formData.listing_id}`);
    } catch (err) {
      setError('Failed to update listing: ' + (err.response?.data?.message || err.message));
      console.error('Error updating listing:', err);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><h4>Loading...</h4></div>;
  if (!currentUser) return <div className="text-center mt-5"><h4>Please log in to edit listings</h4></div>;

  return (
    <div className="listing-form-wrapper">
      <Container className="listing-form-container">
        <Row className="justify-content-center">
          <Col md={9}>
            <Button 
              variant="link" 
              className="mb-3 p-0 text-decoration-none" 
              onClick={() => navigate(`/listings/${formData.listing_id}`)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Listing
            </Button>
            
            <Card className="listing-form-card">
              <Card.Header as="h4">
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit Listing #{formData.listing_id}
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
                      onClick={() => navigate(`/listings/${formData.listing_id}`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="form-submit-btn"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
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

export default EditListing; 