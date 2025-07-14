import { Card, CardContent, CardMedia, Typography, Button, Box, Avatar } from '@mui/material'
import { Link } from 'react-router-dom'
import { Blog } from '../types/Blog'

interface BlogCardProps {
  blog: Blog
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const getInitials = (username: string) => {
    return username?.[0]?.toUpperCase() || '?'
  }

  // Extract first 150 characters of content as synopsis
  const synopsis = blog.content.length > 150 
    ? `${blog.content.substring(0, 150)}...`
    : blog.content

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {blog.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={blog.imageUrl}
          alt={blog.title}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {synopsis}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ width: 32, height: 32 }}
            src={blog.author?.profileImage}
          >
            {getInitials(blog.author?.username || '')}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {blog.author?.username || 'Anonymous'}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          component={Link}
          to={`/blogs/${blog.id}`}
          variant="contained"
          fullWidth
        >
          Read More
        </Button>
      </Box>
    </Card>
  )
}