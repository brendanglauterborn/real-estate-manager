import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser, faEnvelope, faPhone, faMapMarkerAlt, faBuilding, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    region: '',
    role: 'Agent',
    branch_id: '',
    password: ''
  });
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/branch');
        setBranches(response.data);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branch information');
      }
    };
    
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'branch_id' && value !== '') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiData = {
        ...formData,
        branch_id: parseInt(formData.branch_id, 10)
      };
      
      await register(apiData);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account. ' + (err.response?.data || err.message || 'Email may already be registered.'));
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <Container className="auth-container">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="auth-brand">
              <img src="/logo.png" alt="Keller Williams Realty" onError={(e) => {e.target.style.display = 'none'}} />
              <h4>Agent Portal</h4>
            </div>
            
            <Card className="auth-card">
              <Card.Body>
                <div className="auth-header">
                  <h2><FontAwesomeIcon icon={faUserPlus} className="me-2" /> Agent Registration</h2>
                  <p>Join the Keller Williams family</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="auth-form-label">
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          First Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                          className="auth-form-control"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="auth-form-label">Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                          className="auth-form-control"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="auth-form-label">
                      <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="auth-form-control"
                      placeholder="your.name@example.com"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="auth-form-label">
                      <FontAwesomeIcon icon={faPhone} className="me-2" />
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="phone_no"
                      value={formData.phone_no}
                      onChange={handleChange}
                      required
                      className="auth-form-control"
                      placeholder="(123) 456-7890"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="auth-form-label">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      Region
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      required
                      className="auth-form-control"
                      placeholder="e.g. North West, Southern California"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="auth-form-label">Role</Form.Label>
                    <Form.Control
                      as="select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="auth-form-control"
                    >
                      <option value="Agent">Agent</option>
                      <option value="Senior Agent">Senior Agent</option>
                      <option value="Manager">Manager</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="auth-form-label">
                      <FontAwesomeIcon icon={faBuilding} className="me-2" />
                      Branch
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="branch_id"
                      value={formData.branch_id}
                      onChange={handleChange}
                      required
                      className="auth-form-control"
                    >
                      <option value="">Select a Branch</option>
                      {branches && branches.length > 0 ? (
                        branches.filter(branch => branch && branch.branch_id).map(branch => (
                          <option key={branch.branch_id} value={branch.branch_id}>
                            {branch.name || branch.location || `Branch ID: ${branch.branch_id}`}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading branches...</option>
                      )}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="auth-form-label">
                      <FontAwesomeIcon icon={faLock} className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="auth-form-control"
                    />
                  </Form.Group>

                  <Button
                    disabled={loading}
                    className="w-100 auth-submit-btn"
                    type="submit"
                  >
                    {loading ? 'Creating Account...' : 'Register'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            
            <div className="auth-footer">
              Already have an account? <Link to="/login" className="auth-link">Log In</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register; 