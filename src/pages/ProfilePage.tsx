import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material'
import { useAuthStore } from '../stores/authStore'
import { isValidEmail, isValidPassword, isValidUsername, isValidName } from '../utils/validation'

const ProfilePage = () => {
  const { user, updateProfile, updatePassword, loading, error } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: ''
  })
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: ''
  })
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        currentPassword: '',
        newPassword: ''
      }))
    }
  }, [user])

  const validateForm = () => {
    const errors = {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      currentPassword: '',
      newPassword: ''
    }

    if (!isValidUsername(formData.username)) {
      errors.username = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
    }

    if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (formData.firstName && !isValidName(formData.firstName)) {
      errors.firstName = 'First name can only contain letters and must be between 2-30 characters'
    }

    if (formData.lastName && !isValidName(formData.lastName)) {
      errors.lastName = 'Last name can only contain letters and must be between 2-30 characters'
    }

    // Password validation only if either field is filled
    if (formData.currentPassword || formData.newPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to update password'
      }
      if (!formData.newPassword) {
        errors.newPassword = 'New password is required to update password'
      }
      if (formData.newPassword && !isValidPassword(formData.newPassword)) {
        errors.newPassword = 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
      }
    }

    setValidationErrors(errors)
    return !Object.values(errors).some(error => error !== '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSuccess('') // Clear success message on any change
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')

    if (!validateForm()) {
      return
    }

    let hasUpdates = false
    let profileUpdateSuccess = false
    let passwordUpdateSuccess = false

    // Update profile if any non-password fields have changed
    if (
      user &&
      (formData.username !== user.username ||
        formData.email !== user.email ||
        formData.firstName !== user.firstName ||
        formData.lastName !== user.lastName)
    ) {
      hasUpdates = true
      try {
        await updateProfile({
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined
        })
        profileUpdateSuccess = !error
      } catch (err) {
        profileUpdateSuccess = false
      }
    }

    // Update password if both password fields are filled
    if (formData.currentPassword && formData.newPassword) {
      hasUpdates = true
      try {
        await updatePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
        passwordUpdateSuccess = !error
        if (passwordUpdateSuccess) {
          setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }))
        }
      } catch (err) {
        passwordUpdateSuccess = false
      }
    }

    if (!hasUpdates) {
      setSuccess('No changes to update')
    } else if (profileUpdateSuccess || passwordUpdateSuccess) {
      setSuccess('Profile updated successfully!')
    }
  }

  if (!user) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="sm">
          <Alert severity="error">Please log in to view your profile</Alert>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Profile
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              src={user.profileImage}
              sx={{ width: 80, height: 80 }}
            >
              {user.username?.[0]?.toUpperCase()}
            </Avatar>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
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
              type="email"
              name="email"
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
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
              autoComplete="given-name"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
              autoComplete="family-name"
            />
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
              error={!!validationErrors.currentPassword}
              helperText={validationErrors.currentPassword}
              autoComplete="current-password"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
              error={!!validationErrors.newPassword}
              helperText={validationErrors.newPassword}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ProfilePage