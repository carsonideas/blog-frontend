

import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material'
import { Search, Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useBlogStore } from '../stores/blogStore'
import { useAuthStore } from '../stores/authStore'
import { BlogCard } from '../components/BlogCard'
import { Blog } from '../types/Blog'

const BlogsPage = () => {
  const { blogs, fetchBlogs, loading, error, clearError } = useBlogStore()
  const { isAuthenticated } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])

  useEffect(() => {
    fetchBlogs()
    return () => clearError()
  }, [fetchBlogs, clearError])

  useEffect(() => {
    if (searchTerm) {
      const filtered = blogs.filter(blog =>
        blog.author?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBlogs(filtered)
    } else {
      setFilteredBlogs(blogs)
    }
  }, [searchTerm, blogs])

  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={40} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Recent Blog Posts
          </Typography>
          {blogs.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {filteredBlogs.length} of {blogs.length} posts
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          placeholder="Search by author, title, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            mb: 4,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 2
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {filteredBlogs.length > 0 ? (
          <Grid container spacing={3}>
            {filteredBlogs.map((blog) => (
              <Grid item xs={12} sm={6} lg={4} key={blog.id}>
                <BlogCard blog={blog} showActions={true} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No blogs found matching your search.' : 'No blogs available yet.'}
            </Typography>
            {!searchTerm && isAuthenticated && (
              <Typography variant="body2" color="text.secondary">
                Be the first to share your thoughts!
              </Typography>
            )}
          </Box>
        )}

        {/* Floating Action Button for creating new blog */}
        {isAuthenticated && (
          <Fab
            color="primary"
            aria-label="create blog"
            component={Link}
            to="/blogs/create"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <Add />
          </Fab>
        )}
      </Container>
    </Box>
  )
}

export default BlogsPage