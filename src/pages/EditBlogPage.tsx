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
} from '@mui/material'
import { apiClient } from '../utils/api'
import { Blog } from '../types/Blog'

const EditBlogPage = () => {
  const { id } = useParams<{ id: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return

      try {
        const response = await apiClient.get<Blog>(`/blogs/${id}`)
        setBlog(response)
        setTitle(response.title)
        setContent(response.content)
        setImageUrl(response.imageUrl || '')
      } catch (err) {
        setError('Blog not found')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blog) return

    setSaving(true)
    setError('')

    try {
      await apiClient.put(`/blogs/${blog.id}`, {
        title,
        content,
        imageUrl,
      })
      navigate(`/blog/${blog.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error && !blog) {
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Blog Content"
              multiline
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              margin="normal"
              required
              disabled={saving}
              helperText="You can use Markdown formatting"
            />
            <TextField
              fullWidth
              label="Image URL (Optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              margin="normal"
              disabled={saving}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Update Blog'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/blog/${blog?.id}`)}
                disabled={saving}
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

