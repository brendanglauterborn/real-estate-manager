import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <Container className="auth-container">
        <Row className="justify-content-center">
          <Col md={5}>
            <div className="auth-brand">
              <img src="/logo.png" alt="Keller Williams Realty" onError={(e) => {e.target.style.display = 'none'}} />
              <h4>Agent Portal</h4>
            </div>
            
            <Card className="auth-card">
              <Card.Body>
                <div className="auth-header">
                  <h2><FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Agent Login</h2>
                  <p>Sign in to access your agent dashboard</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="email" className="mb-3">
                    <Form.Label className="auth-form-label">Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                      <Form.Control 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="auth-form-control"
                        placeholder="agent@kellerwilliams.com"
                      />
                    </div>
                  </Form.Group>
                  
                  <Form.Group id="password" className="mb-4">
                    <Form.Label className="auth-form-label">Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-form-control" 
                    />
                  </Form.Group>
                  
                  <Button 
                    disabled={loading} 
                    className="w-100 auth-submit-btn" 
                    type="submit"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            
            <div className="auth-footer">
              Don't have an account? <Link to="/register" className="auth-link">Register</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 