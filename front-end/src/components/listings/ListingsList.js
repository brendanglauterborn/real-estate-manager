import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { listingService, propertyService } from '../../services/api';
import { useAuth } from '../../utils/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faHome } from '@fortawesome/free-solid-svg-icons';
import './ListingsList.css';

const ListingsList = () => {
  const { currentUser } = useAuth();
  const [listings, setListings] = useState([]);
  const [properties, setProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.id) {
          // Fetch listings for the current agent
          const listingsRes = await listingService.getListingsByAgentId(currentUser.id);
          setListings(listingsRes.data);
          
          // Fetch all properties
          const propertiesRes = await propertyService.getAllProperties();
          const propertiesMap = {};
          propertiesRes.data.forEach(property => {
            propertiesMap[property.property_id] = property;
          });
          setProperties(propertiesMap);
        }
      } catch (err) {
        setError('Failed to load listings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await listingService.deleteListing(id);
        setListings(listings.filter(listing => listing.listing_id !== id));
      } catch (err) {
        setError('Failed to delete listing');
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
        return <Badge bg="success" className="badge-active">Active</Badge>;
      case 'pending':
        return <Badge bg="warning" className="badge-pending">Pending</Badge>;
      case 'sold':
        return <Badge bg="primary" className="badge-sold">Sold</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="listings-wrapper">
      <Container className="listings-container">
        <div className="listings-header">
          <Row className="align-items-center">
            <Col>
              <h1>
                <FontAwesomeIcon icon={faHome} className="icon-accent" />
                My Listings
              </h1>
            </Col>
            <Col xs="auto">
              <Link to="/listings/new" className="btn btn-kw-primary">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add New Listing
              </Link>
            </Col>
          </Row>
        </div>

        <Card className="listings-card">
          <Card.Body>
            {listings.length === 0 ? (
              <div className="empty-state">
                <h5>You don't have any listings yet</h5>
                <p>Create your first property listing to get started</p>
                <Link to="/listings/new" className="btn btn-kw-primary">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add Your First Listing
                </Link>
              </div>
            ) : (
              <Table responsive striped hover className="listings-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Property</th>
                    <th>Price</th>
                    <th>Date Listed</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(listing => (
                    <tr key={listing.listing_id}>
                      <td>{listing.listing_id}</td>
                      <td className="property-info">
                        {properties[listing.property_id] ? (
                          <>
                            <strong>{properties[listing.property_id].address}</strong><br />
                            <small className="text-muted">{properties[listing.property_id].type}</small>
                          </>
                        ) : (
                          `Property ID: ${listing.property_id}`
                        )}
                      </td>
                      <td>${listing.listing_price}</td>
                      <td>{listing.listing_date}</td>
                      <td>{getStatusBadge(listing.status)}</td>
                      <td>
                        <Link to={`/listings/${listing.listing_id}`} className="btn btn-sm btn-kw-outline me-2">
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        <Link 
                          to={`/listings/edit/${listing.listing_id}`} 
                          className="btn btn-sm btn-kw-outline me-2"
                          onClick={(e) => {
                            // Prevent default navigation for logging/debugging purposes
                            e.preventDefault();
                            console.log('Navigating to edit page for listing ID:', listing.listing_id);
                            // Handle navigation programmatically
                            navigate(`/listings/edit/${listing.listing_id}`);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDelete(listing.listing_id)}
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
      </Container>
    </div>
  );
};

export default ListingsList; 