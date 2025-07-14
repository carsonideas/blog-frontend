
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuthStore } from '../stores/authStore'

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, clearError, isAuthenticated } = useAuthStore()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/blogs'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  useEffect(() => {
    // Clear any previous auth errors when component mounts
    clearError()
    return () => clearError()
  }, [clearError])

  useEffect(() => {
    // Clear form error when user starts typing
    if (formError) {
      setFormError('')
    }
  }, [emailOrUsername, password])

  const validateForm = () => {
    if (!emailOrUsername.trim()) {
      setFormError('Email or username is required')
      return false
    }
    if (!password.trim()) {
      setFormError('Password is required')
      return false
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError() // Clear any previous auth errors

    if (!validateForm()) {
      return
    }

    try {
      await login({ emailOrUsername: emailOrUsername.trim(), password: password.trim() })
      // Navigation will be handled by the useEffect above when isAuthenticated changes
    } catch (error) {
      // Error is already handled in the store and will be displayed via the error state
      console.error('Login failed:', error)
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
            Sign In
          </Typography>

          {(error || formError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || formError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email or Username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="username"
              error={!!formError && !emailOrUsername.trim()}
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="current-password"
              error={!!formError && !password.trim()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ textDecoration: 'none' }}
                  onClick={() => clearError()}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
