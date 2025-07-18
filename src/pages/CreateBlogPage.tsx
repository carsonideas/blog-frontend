
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material'
import { useBlogStore } from '../stores/blogStore'
import { BlogContent } from '../components/BlogContent'
import { isValidBlogTitle, isValidBlogContent } from '../utils/validation'

const CreateBlogPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  })
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    content: ''
  })
  const [activeTab, setActiveTab] = useState(0)
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const { createBlog, loading, error, clearError } = useBlogStore()

  const validateForm = () => {
    const errors = {
      title: '',
      content: ''
    }

    if (!isValidBlogTitle(formData.title)) {
      errors.title = 'Title must be between 3 and 100 characters'
    }

    if (!isValidBlogContent(formData.content)) {
      errors.content = 'Content must be at least 100 characters long'
    }

    setValidationErrors(errors)
    return !Object.values(errors).some(error => error !== '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSuccess('') // Clear success message
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError() // Clear any previous errors
    setSuccess('')

    if (!validateForm()) {
      return
    }

    try {
      const newBlog = await createBlog({
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageUrl: formData.imageUrl.trim() || undefined
      })
      
      setSuccess('Blog created successfully!')
      
      // Navigate to the new blog or blogs list after a short delay
      setTimeout(() => {
        navigate('/blogs')
      }, 1500)
    } catch (error) {
      console.error('Failed to create blog:', error)
      // Error is already handled in the store
    }
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Create New Blog
          </Typography>

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
              label="Blog Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              error={!!validationErrors.title}
              helperText={validationErrors.title || 'Enter a title for your blog (3-100 characters)'}
            />
            <TextField
              fullWidth
              label="Image URL (Optional)"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
              helperText="Enter a URL for the blog's featured image"
            />

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, mb: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Write" />
                <Tab label="Preview" />
              </Tabs>
            </Box>

            <Box hidden={activeTab !== 0}>
              <TextField
                fullWidth
                label="Blog Content (Markdown)"
                name="content"
                multiline
                rows={12}
                value={formData.content}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!validationErrors.content}
                helperText={validationErrors.content || `Use Markdown syntax for formatting (minimum 100 characters, current: ${formData.content.length})`}
              />
            </Box>

            <Box hidden={activeTab !== 1} sx={{ mt: 2, minHeight: '300px' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Preview
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                {formData.content ? (
                  <BlogContent content={formData.content} />
                ) : (
                  <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Start writing to see the preview...
                  </Typography>
                )}
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !!success}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Blog'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/blogs')}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default CreateBlogPage
