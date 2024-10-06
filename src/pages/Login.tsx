import React, { useState } from 'react';
import { TextField, Typography, Box } from '@mui/material';
import { login as apiLogin } from '../services/api';
import { StyledPaper, StyledButton } from '../styles/styledComponents';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiLogin(email, password);
      console.log('Login response:', data); // Add this line
      login(data.token);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <StyledPaper>
        <Box p={3} component="form" onSubmit={handleLogin}>
          <Typography variant="h5" mb={2}>Login</Typography>
          {error && <Typography color="error" mb={2}>{error}</Typography>}
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Login
          </StyledButton>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Login;