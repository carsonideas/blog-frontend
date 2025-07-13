import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material'
import { ArrowBack, Edit, Delete } from '@mui/icons-material'
import { marked } from 'marked'
import { apiClient } from '../utils/api'
import { authStore } from '../stores/authStore'
import { Blog } from '../types/Blog'

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const currentUser = authStore.getUser()

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return

      try {
        const response = await apiClient.get<Blog>(`/blogs/${id}`)
        setBlog(response)
      } catch (err) {
        setError('Blog not found')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  const handleDelete = async () => {
    if (!blog || !window.confirm('Are you sure you want to delete this blog?')) return

    setDeleting(true)
    try {
      await apiClient.delete(`/blogs/${blog.id}`)
      navigate('/blogs')
    } catch (err) {
      setError('Failed to delete blog')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getAuthorDisplayName = (blog: Blog) => {
    if (blog.author?.firstName && blog.author?.lastName) {
      return `${blog.author.firstName} ${blog.author.lastName}`
    }
    return blog.author?.username || 'Unknown Author'
  }

  const convertMarkdownToHtml = (markdown: string) => {
    return marked(markdown)
  }

  if (loading) {
    return (
      <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !blog) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Blog not found'}
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            component={Link}
            to="/blogs"
          >
            Back to Blogs
          </Button>
        </Container>
      </Box>
    )
  }

  const isAuthor = currentUser?.id === blog.authorId

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          component={Link}
          to="/blogs"
          sx={{ mb: 3 }}
        >
          Back to Blogs
        </Button>

        {blog.imageUrl && (
          <Box
            component="img"
            src={blog.imageUrl}
            alt={blog.title}
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 3,
            }}
          />
        )}

        <Typography variant="h3" component="h1" gutterBottom>
          {blog.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={blog.author?.profileImage}
            sx={{ width: 40, height: 40 }}
          >
            {blog.author?.username[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {getAuthorDisplayName(blog)}
            </Typography>
            <Chip
              label={formatDate(blog.createdAt)}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Box
          sx={{ mb: 4 }}
          dangerouslySetInnerHTML={{
            __html: convertMarkdownToHtml(blog.content),
          }}
        />

        {isAuthor && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              component={Link}
              to={`/edit-blog/${blog.id}`}
            >
              Edit Blog
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Blog'}
            </Button>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  )
}

export default BlogDetailPage

