

// import { useEffect, useState } from 'react'
// import { useParams, Link, useNavigate } from 'react-router-dom'
// import {
//   Container,
//   Typography,
//   Box,
//   Avatar,
//   Chip,
//   Button,
//   Alert,
//   CircularProgress,
//   Divider,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from '@mui/material'
// import { ArrowBack, Edit, Delete, Person, Schedule, Warning } from '@mui/icons-material'
// import { useBlogStore } from '../stores/blogStore'
// import { useAuthStore } from '../stores/authStore'
// import { BlogContent } from '../components/BlogContent'
// import { formatDate, getRelativeTime } from '../utils/dateFormat'
// import { Blog } from '../types/Blog'

// const BlogDetailPage = () => {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   const { user } = useAuthStore()
//   const {
//     currentBlog: blog,
//     loading,
//     error,
//     fetchBlogById,
//     deleteBlog,
//     clearError,
//   } = useBlogStore()

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)

//   useEffect(() => {
//     if (id) {
//       fetchBlogById(id)
//     }
//     return () => {
//       clearError()
//     }
//   }, [id, fetchBlogById, clearError])

//   const handleDeleteClick = () => {
//     setDeleteDialogOpen(true)
//   }

//   const handleDeleteConfirm = async () => {
//     if (!blog || !id) return

//     setIsDeleting(true)
//     try {
//       await deleteBlog(id)
//       setDeleteDialogOpen(false)
//       navigate('/blogs')
//     } catch (error) {
//       console.error('Failed to delete blog:', error)
//       setIsDeleting(false)
//     }
//   }

//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false)
//   }

//   const getAuthorDisplayName = (blog: Blog) => {
//     if (blog.author?.firstName && blog.author?.lastName) {
//       return `${blog.author.firstName} ${blog.author.lastName}`
//     }
//     return blog.author?.username || 'Unknown Author'
//   }

//   if (loading) {
//     return (
//       <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
//         <CircularProgress size={40} />
//       </Box>
//     )
//   }

//   if (error || !blog) {
//     return (
//       <Box sx={{ py: 4 }}>
//         <Container maxWidth="md">
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error || 'Blog not found'}
//           </Alert>
//           <Button
//             variant="outlined"
//             startIcon={<ArrowBack />}
//             component={Link}
//             to="/blogs"
//           >
//             Back to Blogs
//           </Button>
//         </Container>
//       </Box>
//     )
//   }

//   const isAuthor = user?.id === blog.authorId

//   return (
//     <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'grey.50' }}>
//       <Container maxWidth="md">
//         <Button
//           variant="outlined"
//           startIcon={<ArrowBack />}
//           component={Link}
//           to="/blogs"
//           sx={{ mb: 3, borderRadius: 2 }}
//         >
//           Back to Blogs
//         </Button>

//         <Paper elevation={1} sx={{ overflow: 'hidden', borderRadius: 2 }}>
//           {blog.imageUrl && (
//             <Box
//               component="img"
//               src={blog.imageUrl}
//               alt={blog.title}
//               sx={{
//                 width: '100%',
//                 height: 400,
//                 objectFit: 'cover',
//               }}
//             />
//           )}

//           <Box sx={{ p: 4 }}>
//             <Typography 
//               variant="h3" 
//               component="h1" 
//               gutterBottom
//               sx={{ 
//                 fontWeight: 700,
//                 lineHeight: 1.2,
//                 mb: 3,
//                 color: 'text.primary'
//               }}
//             >
//               {blog.title}
//             </Typography>

//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//               <Avatar
//                 src={blog.author?.profileImage}
//                 sx={{ width: 48, height: 48 }}
//               >
//                 {blog.author?.username?.[0]?.toUpperCase()}
//               </Avatar>
//               <Box sx={{ flexGrow: 1 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//                   <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
//                   <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                     {getAuthorDisplayName(blog)}
//                   </Typography>
//                   {isAuthor && (
//                     <Chip 
//                       label="Author" 
//                       size="small" 
//                       color="primary" 
//                       variant="outlined"
//                       sx={{ ml: 1 }}
//                     />
//                   )}
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
//                   <Typography variant="body2" color="text.secondary">
//                     Published {getRelativeTime(blog.createdAt)}
//                   </Typography>
//                   <Chip
//                     label={formatDate(blog.createdAt)}
//                     size="small"
//                     variant="outlined"
//                     sx={{ ml: 1 }}
//                   />
//                 </Box>
//               </Box>
//             </Box>

//             <Divider sx={{ mb: 4 }} />

//             <Box sx={{ mb: 4 }}>
//               <BlogContent content={blog.content} />
//             </Box>

//             {isAuthor && (
//               <>
//                 <Divider sx={{ mb: 3 }} />
//                 <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<Edit />}
//                     component={Link}
//                     to={`/blogs/${blog.id}/edit`}
//                     sx={{ borderRadius: 2 }}
//                   >
//                     Edit Blog
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     startIcon={<Delete />}
//                     onClick={handleDeleteClick}
//                     sx={{ borderRadius: 2 }}
//                     disabled={isDeleting}
//                   >
//                     {isDeleting ? 'Deleting...' : 'Delete Blog'}
//                   </Button>
//                 </Box>
//               </>
//             )}
//           </Box>
//         </Paper>

//         {/* Delete Confirmation Dialog */}
//         <Dialog
//           open={deleteDialogOpen}
//           onClose={handleDeleteCancel}
//           maxWidth="sm"
//           fullWidth
//         >
//           <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Warning color="error" />
//             Confirm Delete
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Are you sure you want to delete "<strong>{blog.title}</strong>"? 
//               This action cannot be undone and the blog will be permanently removed.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions sx={{ p: 3, pt: 1 }}>
//             <Button 
//               onClick={handleDeleteCancel}
//               variant="outlined"
//               disabled={isDeleting}
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleDeleteConfirm}
//               color="error"
//               variant="contained"
//               disabled={isDeleting}
//               startIcon={isDeleting ? <CircularProgress size={16} /> : <Delete />}
//             >
//               {isDeleting ? 'Deleting...' : 'Delete Blog'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </Box>
//   )
// }

// export default BlogDetailPage



// import { useEffect, useState } from 'react'
// import { useParams, Link, useNavigate } from 'react-router-dom'
// import {
//   Container,
//   Typography,
//   Box,
//   Avatar,
//   Chip,
//   Button,
//   Alert,
//   CircularProgress,
//   Divider,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from '@mui/material'
// import { ArrowBack, Edit, Delete, Person, Schedule, Warning } from '@mui/icons-material'
// import { useBlogStore } from '../stores/blogStore'
// import { useAuthStore } from '../stores/authStore'
// import { BlogContent } from '../components/BlogContent'
// import { formatDate, getRelativeTime } from '../utils/dateFormat'
// import { Blog } from '../types/Blog'

// const BlogDetailPage = () => {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   const { user } = useAuthStore()
//   const {
//     currentBlog: blog,
//     loading,
//     error,
//     fetchBlogById,
//     deleteBlog,
//     clearError,
//   } = useBlogStore()

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)

//   useEffect(() => {
//     console.log('BlogDetailPage: Component mounted, id:', id)
//     if (id) {
//       console.log('BlogDetailPage: Fetching blog with id:', id)
//       fetchBlogById(id)
//     }
//     return () => {
//       clearError()
//     }
//   }, [id, fetchBlogById, clearError])

//   useEffect(() => {
//     console.log('BlogDetailPage: State updated', { blog, loading, error })
//   }, [blog, loading, error])

//   const handleDeleteClick = () => {
//     setDeleteDialogOpen(true)
//   }

//   const handleDeleteConfirm = async () => {
//     if (!blog || !id) return

//     setIsDeleting(true)
//     try {
//       await deleteBlog(id)
//       setDeleteDialogOpen(false)
//       navigate('/blogs')
//     } catch (error) {
//       console.error('Failed to delete blog:', error)
//       setIsDeleting(false)
//     }
//   }

//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false)
//   }

//   const getAuthorDisplayName = (blog: Blog) => {
//     if (blog.author?.firstName && blog.author?.lastName) {
//       return `${blog.author.firstName} ${blog.author.lastName}`
//     }
//     return blog.author?.username || 'Unknown Author'
//   }

//   console.log('BlogDetailPage: Rendering with state', { blog, loading, error })

//   if (loading) {
//     return (
//       <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
//         <CircularProgress size={40} />
//         <Typography sx={{ ml: 2 }}>Loading blog...</Typography>
//       </Box>
//     )
//   }

//   if (error) {
//     return (
//       <Box sx={{ py: 4 }}>
//         <Container maxWidth="md">
//           <Alert severity="error" sx={{ mb: 3 }}>
//             Error: {error}
//           </Alert>
//           <Button
//             variant="outlined"
//             startIcon={<ArrowBack />}
//             component={Link}
//             to="/blogs"
//           >
//             Back to Blogs
//           </Button>
//         </Container>
//       </Box>
//     )
//   }

//   if (!blog) {
//     return (
//       <Box sx={{ py: 4 }}>
//         <Container maxWidth="md">
//           <Alert severity="warning" sx={{ mb: 3 }}>
//             Blog not found or may have been deleted.
//           </Alert>
//           <Button
//             variant="outlined"
//             startIcon={<ArrowBack />}
//             component={Link}
//             to="/blogs"
//           >
//             Back to Blogs
//           </Button>
//         </Container>
//       </Box>
//     )
//   }

//   const isAuthor = user?.id === blog.authorId

//   return (
//     <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'grey.50' }}>
//       <Container maxWidth="md">
//         <Button
//           variant="outlined"
//           startIcon={<ArrowBack />}
//           component={Link}
//           to="/blogs"
//           sx={{ mb: 3, borderRadius: 2 }}
//         >
//           Back to Blogs
//         </Button>

//         <Paper elevation={1} sx={{ overflow: 'hidden', borderRadius: 2 }}>
//           {blog.imageUrl && (
//             <Box
//               component="img"
//               src={blog.imageUrl}
//               alt={blog.title}
//               sx={{
//                 width: '100%',
//                 height: 400,
//                 objectFit: 'cover',
//               }}
//             />
//           )}

//           <Box sx={{ p: 4 }}>
//             <Typography 
//               variant="h3" 
//               component="h1" 
//               gutterBottom
//               sx={{ 
//                 fontWeight: 700,
//                 lineHeight: 1.2,
//                 mb: 3,
//                 color: 'text.primary'
//               }}
//             >
//               {blog.title}
//             </Typography>

//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//               <Avatar
//                 src={blog.author?.profileImage}
//                 sx={{ width: 48, height: 48 }}
//               >
//                 {blog.author?.username?.[0]?.toUpperCase()}
//               </Avatar>
//               <Box sx={{ flexGrow: 1 }}>
//                 {/* Author name and time on the same line */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                     {getAuthorDisplayName(blog)}
//                   </Typography>
//                   <Chip
//                     label={getRelativeTime(blog.createdAt)}
//                     size="small"
//                     variant="outlined"
//                     title={formatDate(blog.createdAt)}
//                     sx={{ fontSize: '0.75rem' }}
//                   />
//                   {isAuthor && (
//                     <Chip 
//                       label="Author" 
//                       size="small" 
//                       color="primary" 
//                       variant="outlined"
//                     />
//                   )}
//                 </Box>
//                 {/* Username below the name */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
//                   <Typography variant="body2" color="text.secondary">
//                     @{blog.author?.username || 'unknown'}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
//                     • {formatDate(blog.createdAt)}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>

//             <Divider sx={{ mb: 4 }} />

//             <Box sx={{ mb: 4 }}>
//               <BlogContent content={blog.content} />
//             </Box>

//             {isAuthor && (
//               <>
//                 <Divider sx={{ mb: 3 }} />
//                 <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<Edit />}
//                     component={Link}
//                     to={`/blogs/${blog.id}/edit`}
//                     sx={{ borderRadius: 2 }}
//                   >
//                     Edit Blog
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     startIcon={<Delete />}
//                     onClick={handleDeleteClick}
//                     sx={{ borderRadius: 2 }}
//                     disabled={isDeleting}
//                   >
//                     {isDeleting ? 'Deleting...' : 'Delete Blog'}
//                   </Button>
//                 </Box>
//               </>
//             )}
//           </Box>
//         </Paper>

//         {/* Delete Confirmation Dialog */}
//         <Dialog
//           open={deleteDialogOpen}
//           onClose={handleDeleteCancel}
//           maxWidth="sm"
//           fullWidth
//         >
//           <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Warning color="error" />
//             Confirm Delete
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Are you sure you want to delete "<strong>{blog.title}</strong>"? 
//               This action cannot be undone and the blog will be permanently removed.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions sx={{ p: 3, pt: 1 }}>
//             <Button 
//               onClick={handleDeleteCancel}
//               variant="outlined"
//               disabled={isDeleting}
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleDeleteConfirm}
//               color="error"
//               variant="contained"
//               disabled={isDeleting}
//               startIcon={isDeleting ? <CircularProgress size={16} /> : <Delete />}
//             >
//               {isDeleting ? 'Deleting...' : 'Delete Blog'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </Box>
//   )
// }

// export default BlogDetailPage





import { useEffect, useState } from 'react'
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
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import { ArrowBack, Edit, Delete, Person, Warning } from '@mui/icons-material'
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
    clearError,
  } = useBlogStore()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    console.log('BlogDetailPage: Component mounted, id:', id)
    if (id) {
      console.log('BlogDetailPage: Fetching blog with id:', id)
      fetchBlogById(id)
    }
    return () => {
      clearError()
    }
  }, [id, fetchBlogById, clearError])

  useEffect(() => {
    console.log('BlogDetailPage: State updated', { 
      blog: blog ? { id: blog.id, title: blog.title, content: blog.content?.substring(0, 100) + '...' } : null, 
      loading, 
      error 
    })
  }, [blog, loading, error])

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!blog || !id) return

    setIsDeleting(true)
    try {
      await deleteBlog(id)
      setDeleteDialogOpen(false)
      navigate('/blogs')
    } catch (error) {
      console.error('Failed to delete blog:', error)
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const getAuthorDisplayName = (blog: Blog) => {
    if (blog.author?.firstName && blog.author?.lastName) {
      return `${blog.author.firstName} ${blog.author.lastName}`
    }
    return blog.author?.username || 'Unknown Author'
  }

  console.log('BlogDetailPage: Rendering with state', { 
    blogExists: !!blog, 
    blogId: blog?.id,
    blogTitle: blog?.title,
    contentLength: blog?.content?.length,
    loading, 
    error 
  })

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2 }}>Loading blog...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error: {error}
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
    )
  }

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Blog not found or may have been deleted.
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
    )
  }

  const isAuthor = user?.id === blog.authorId

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        component={Link}
        to="/blogs"
        sx={{ mb: 3 }}
      >
        Back to Blogs
      </Button>

      <Paper elevation={2} sx={{ p: 4 }}>
        {/* Blog Image */}
        {blog.imageUrl && (
          <Box
            component="img"
            src={blog.imageUrl}
            alt={blog.title}
            sx={{
              width: '100%',
              height: 300,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 3
            }}
          />
        )}

        {/* Blog Title */}
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            mb: 3,
            color: 'text.primary'
          }}
        >
          {blog.title}
        </Typography>

        {/* Author Information - Layout Adjustments */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={blog.author?.profileImage}
            sx={{ width: 48, height: 48 }}
          >
            {blog.author?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            {/* Author name and time on the same line */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getAuthorDisplayName(blog)}
              </Typography>
              <Chip
                label={getRelativeTime(blog.createdAt)}
                size="small"
                color="primary"
                variant="outlined"
                title={formatDate(blog.createdAt)}
              />
              {isAuthor && (
                <Chip 
                  label="Author" 
                  size="small" 
                  color="secondary" 
                  variant="filled"
                />
              )}
            </Box>
            {/* Username below the name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                @{blog.author?.username || 'unknown'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                • Published on {formatDate(blog.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Full Blog Content */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Content:
          </Typography>
          {blog.content ? (
            <BlogContent content={blog.content} />
          ) : (
            <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No content available for this blog.
            </Typography>
          )}
        </Box>

        {/* Debug Information */}
        <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Debug Info: Blog ID: {blog.id}, Content Length: {blog.content?.length || 0} characters
          </Typography>
        </Box>

        {/* Author Actions */}
        {isAuthor && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Blog'}
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "<strong>{blog.title}</strong>"? 
            This action cannot be undone and the blog will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : <Delete />}
          >
            {isDeleting ? 'Deleting...' : 'Delete Blog'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BlogDetailPage