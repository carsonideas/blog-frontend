
import { Card, CardContent, CardMedia, Typography, Button, Box, Avatar, Chip, IconButton, Menu, MenuItem } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { MoreVert, Edit, Delete, Visibility } from '@mui/icons-material'
import { Blog } from '../types/Blog'
import { formatDate, getRelativeTime } from '../utils/dateFormat'
import { useAuthStore } from '../stores/authStore'
import { useBlogStore } from '../stores/blogStore'

interface BlogCardProps {
  blog: Blog
  showActions?: boolean
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, showActions = true }) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { deleteBlog } = useBlogStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const getInitials = (username: string) => {
    return username?.[0]?.toUpperCase() || '?'
  }

  const getAuthorDisplayName = (blog: Blog) => {
    if (blog.author?.firstName && blog.author?.lastName) {
      return `${blog.author.firstName} ${blog.author.lastName}`
    }
    return blog.author?.username || 'Anonymous'
  }

  const isOwner = user?.id === blog.authorId

  // Extract first 200 characters of content as synopsis, removing markdown syntax
  const cleanContent = blog.content
    .replace(/[#*`_~\[\]()]/g, '') // Remove basic markdown characters
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image syntax
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove link syntax
    .trim()

  const synopsis = cleanContent.length > 200 
    ? `${cleanContent.substring(0, 200)}...`
    : cleanContent

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleView = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleMenuClose()
    navigate(`/blogs/${blog.id}`)
  }

  const handleEdit = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleMenuClose()
    navigate(`/blogs/${blog.id}/edit`)
  }

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleMenuClose()
    
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        await deleteBlog(blog.id)
        // The blog will be removed from the list automatically by the store
      } catch (error) {
        console.error('Failed to delete blog:', error)
        alert('Failed to delete blog. Please try again.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Card sx={{ 
      maxWidth: 400, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      opacity: isDeleting ? 0.5 : 1,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      },
      position: 'relative'
    }}>
      {showActions && isOwner && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
            }}
            disabled={isDeleting}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleView}>
              <Visibility sx={{ mr: 1 }} />
              View
            </MenuItem>
            <MenuItem onClick={handleEdit}>
              <Edit sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
      )}

      {blog.imageUrl && (
        <CardMedia
          component="img"
          height="200"
          image={blog.imageUrl}
          alt={blog.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography 
          gutterBottom 
          variant="h5" 
          component="div"
          sx={{ 
            fontWeight: 600,
            lineHeight: 1.3,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {blog.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {synopsis}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Avatar 
            sx={{ width: 32, height: 32 }}
            src={blog.author?.profileImage}
          >
            {getInitials(blog.author?.username || '')}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              {getAuthorDisplayName(blog)}
            </Typography>
           
          <Typography variant="caption" color="text.secondary">
            @{blog.author?.username}

          </Typography>
            <Chip
              label={getRelativeTime(blog.createdAt)}
              size="small"
              variant="outlined"
              title={formatDate(blog.createdAt)}
              sx={{ fontSize: '0.75rem', height: 20,
                  marginLeft: 13, 
                  marginTop: -4,
                
              }}
            />
          </Box>
        </Box>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          to={`/blogs/${blog.id}`}
          variant="contained"
          fullWidth
          disabled={isDeleting}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1
          }}
        >
          {isDeleting ? 'Deleting...' : 'Read More'}
        </Button>
      </Box>
    </Card>
  )
}