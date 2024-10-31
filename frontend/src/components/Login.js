import React, { useState } from 'react';
import { handleLogin } from '../services/authService';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Container, Form, Button, Alert } from 'react-bootstrap'; // Import Bootstrap components

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ username, password });
      onLogin(); // Call the onLogin prop to update the parent component's state
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
      <p className="mt-3">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p> {/* Link to the Signup page */}
    </Container>
  );
};

export default Login;



