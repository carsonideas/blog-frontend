

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
  Grid,
  // Divider,
} from '@mui/material'
import { useAuthStore } from '../stores/authStore'
import { isValidEmail, isValidPassword, isValidUsername, isValidName } from '../utils/validation'

const ProfilePage = () => {
  const { user, updateProfile, updatePassword, loading, error, clearError } = useAuthStore()
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: ''
  })
  const [passwordData, setPasswordData] = useState({
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
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      })
    }
  }, [user])

  useEffect(() => {
    // Clear errors when component mounts
    clearError()
  }, [clearError])

  const validateProfileForm = () => {
    const errors = {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      currentPassword: '',
      newPassword: ''
    }

    if (!isValidUsername(profileData.username)) {
      errors.username = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
    }

    if (!isValidEmail(profileData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!profileData.firstName.trim()) {
      errors.firstName = 'First name is required'
    } else if (!isValidName(profileData.firstName)) {
      errors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes (2-50 characters)'
    }

    if (!profileData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    } else if (!isValidName(profileData.lastName)) {
      errors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes (2-50 characters)'
    }

    setValidationErrors(prev => ({ ...prev, ...errors }))
    return !errors.username && !errors.email && !errors.firstName && !errors.lastName
  }

  const validatePasswordForm = () => {
    const errors = {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      currentPassword: '',
      newPassword: ''
    }

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required'
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required'
    } else if (!isValidPassword(passwordData.newPassword)) {
      errors.newPassword = 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
    }

    setValidationErrors(prev => ({ ...prev, ...errors }))
    return !errors.currentPassword && !errors.newPassword
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    setSuccess('') // Clear success message on any change
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setSuccess('') // Clear success message on any change
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    clearError()

    if (!validateProfileForm()) {
      return
    }

    // Check if any profile fields have changed
    if (
      user &&
      profileData.username === user.username &&
      profileData.email === user.email &&
      profileData.firstName === user.firstName &&
      profileData.lastName === user.lastName
    ) {
      setSuccess('No changes to update')
      return
    }

    try {
      await updateProfile({
        username: profileData.username.trim(),
        email: profileData.email.trim(),
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim()
      })
      
      if (!error) {
        setSuccess('Profile updated successfully!')
      }
    } catch (err) {
      console.error('Profile update failed:', err)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    clearError()

    if (!validatePasswordForm()) {
      return
    }

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      if (!error) {
        setSuccess('Password updated successfully!')
        setPasswordData({ currentPassword: '', newPassword: '' })
      }
    } catch (err) {
      console.error('Password update failed:', err)
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

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.username

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Profile
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={user.profileImage}
              sx={{ width: 100, height: 100, mb: 2 }}
            >
              {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
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

          <Grid container spacing={4}>
            {/* Profile Information Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Profile Information
              </Typography>
              <Box component="form" onSubmit={handleProfileSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
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
                      value={profileData.lastName}
                      onChange={handleProfileChange}
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
                  value={profileData.username}
                  onChange={handleProfileChange}
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
                  value={profileData.email}
                  onChange={handleProfileChange}
                  margin="normal"
                  required
                  disabled={loading}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  autoComplete="email"
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
            </Grid>

            {/* Password Change Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Change Password
              </Typography>
              <Box component="form" onSubmit={handlePasswordSubmit}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
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
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
                  disabled={loading}
                  error={!!validationErrors.newPassword}
                  helperText={validationErrors.newPassword}
                  autoComplete="new-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Password'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}

export default ProfilePage
