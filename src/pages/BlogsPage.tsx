import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { apiClient } from '../utils/api'
import { Blog } from '../types/Blog'

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await apiClient.get<Blog[]>('/blogs')
        setBlogs(response)
        setFilteredBlogs(response)
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = blogs.filter(blog =>
        blog.author?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBlogs(filtered)
    } else {
      setFilteredBlogs(blogs)
    }
  }, [searchTerm, blogs])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getAuthorDisplayName = (blog: Blog) => {
    if (blog.author?.firstName && blog.author?.lastName) {
      return `${blog.author.firstName} ${blog.author.lastName}`
    }
    return blog.author?.username || 'Unknown Author'
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography>Loading blogs...</Typography>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Recent blog posts
        </Typography>

        <TextField
          fullWidth
          placeholder="Search by author name or blog title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={3}>
          {filteredBlogs.map((blog) => (
            <Grid item xs={12} md={6} lg={4} key={blog.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
                component={Link}
                to={`/blog/${blog.id}`}
                style={{ textDecoration: 'none' }}
              >
                {blog.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={blog.imageUrl}
                    alt={blog.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {truncateContent(blog.content)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar
                      src={blog.author?.profileImage}
                      sx={{ width: 24, height: 24 }}
                    >
                      {blog.author?.username[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {getAuthorDisplayName(blog)}
                    </Typography>
                    <Chip
                      label={formatDate(blog.createdAt)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredBlogs.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No blogs found matching your search.' : 'No blogs available yet.'}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default BlogsPage

