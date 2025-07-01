import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4">Real Estate Agent Portal</h1>
          <p className="lead mb-5">
            Manage your property listings, track appointments, and connect with clients - all in one place.
          </p>

          {currentUser ? (
            <Button 
              as={Link} 
              to="/dashboard" 
              size="lg" 
              variant="primary"
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
              Go to Dashboard
            </Button>
          ) : (
            <Row className="justify-content-center">
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body className="text-center">
                    <h3>Already have an account?</h3>
                    <Button 
                      as={Link} 
                      to="/login" 
                      size="lg" 
                      variant="primary" 
                      className="mt-3 w-100"
                    >
                      <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                      Login
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body className="text-center">
                    <h3>New to the platform?</h3>
                    <Button 
                      as={Link} 
                      to="/register" 
                      size="lg" 
                      variant="success" 
                      className="mt-3 w-100"
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                      Register
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 