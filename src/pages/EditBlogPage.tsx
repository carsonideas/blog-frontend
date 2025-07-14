import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { Blog } from '../types/Blog'

const EditBlogPage = () => {
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  })
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()
  const { currentBlog, loading, error, fetchBlogById, updateBlog } = useBlogStore()

  useEffect(() => {
    if (id) {
      fetchBlogById(id)
    }
  }, [id, fetchBlogById])

  useEffect(() => {
    if (currentBlog) {
      setFormData({
        title: currentBlog.title,
        content: currentBlog.content,
        imageUrl: currentBlog.imageUrl || ''
      })
    }
  }, [currentBlog])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBlog?.id) return

    await updateBlog(currentBlog.id, formData)
    
    if (!error) {
      navigate(`/blog/${currentBlog.id}`)
    }
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  if (loading && !currentBlog) {
    return (
      <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error && !currentBlog) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="md">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    )
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
            Edit Blog
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
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
                helperText="Use Markdown syntax for formatting"
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Blog'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/blog/${currentBlog?.id}`)}
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

export default EditBlogPage

