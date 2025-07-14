import { useEffect } from 'react'
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
import { useBlogStore } from '../stores/blogStore'
import { useAuthStore } from '../stores/authStore'
import { BlogContent } from '../components/BlogContent'
import { formatDate, getRelativeTime } from '../utils/dateFormat'
import { Blog } from '../types/Blog'

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    currentBlog: blog,
    loading,
    error,
    fetchBlogById,
    deleteBlog,
    loading: deleteLoading,
    error: deleteError,
    clearError,
  } = useBlogStore()

  useEffect(() => {
    if (id) {
      fetchBlogById(id)
    }
    return () => {
      clearError()
    }
  }, [id, fetchBlogById, clearError])

  const handleDelete = async () => {
    if (!blog || !id) return

    await deleteBlog(id)
    if (!deleteError) {
      navigate('/blogs')
    }
  }

  const getAuthorDisplayName = (blog: Blog) => {
    return blog.author?.username || 'Unknown Author'
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

  const isAuthor = user?.id === blog.authorId

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
            {blog.author?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {getAuthorDisplayName(blog)}
            </Typography>
            <Chip
              label={getRelativeTime(blog.createdAt)}
              size="small"
              variant="outlined"
              title={formatDate(blog.createdAt)}
            />
          </Box>
        </Box>

        <BlogContent content={blog.content} />

        {isAuthor && (
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              component={Link}
              to={`/blogs/${blog.id}/edit`}
            >
              Edit Blog
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Blog'}
            </Button>
          </Box>
        )}

        {deleteError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {deleteError}
          </Alert>
        )}
      </Container>
    </Box>
  )
}

export default BlogDetailPage

