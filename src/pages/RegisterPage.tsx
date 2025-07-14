// 


import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material'
import { useAuthStore } from '../stores/authStore'
import { isValidEmail, isValidPassword, isValidUsername } from '../utils/validation'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  })
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  })
  
  const navigate = useNavigate()
  const { register, loading, error, clearError, isAuthenticated } = useAuthStore()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/blogs', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // Clear any previous auth errors when component mounts
    clearError()
    return () => clearError()
  }, [clearError])

  const validateForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    }

    // Validate first name
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters long'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      errors.firstName = 'First name can only contain letters and spaces'
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters long'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      errors.lastName = 'Last name can only contain letters and spaces'
    }

    // Validate username
    if (!isValidUsername(formData.username)) {
      errors.username = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
    }

    // Validate email
    if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Validate password
    if (!isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
    }

    setValidationErrors(errors)
    return !errors.firstName && !errors.lastName && !errors.username && !errors.email && !errors.password
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError() // Clear any previous auth errors

    if (!validateForm()) {
      return
    }

    try {
      // Prepare data with trimmed names
      const registrationData = {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim()
      }
      
      await register(registrationData)
      // Navigation will be handled by the useEffect above when isAuthenticated changes
    } catch (error) {
      // Error is already handled in the store and will be displayed via the error state
      console.error('Registration failed:', error)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* First Name and Last Name in a row */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  margin="normal"
                  required
                  disabled={loading}
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  margin="normal"
                  required
                  disabled={loading}
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                  autoComplete="family-name"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              error={!!validationErrors.username}
              helperText={validationErrors.username}
              autoComplete="username"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ textDecoration: 'none' }}
                  onClick={() => clearError()}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default RegisterPage
