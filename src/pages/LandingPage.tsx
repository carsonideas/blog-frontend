import { Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Card,
  CardMedia,
  Grid,
} from '@mui/material'

const LandingPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'white',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        
        <Grid container spacing={6} alignItems="center" sx={{ mb: 8 }}>
          
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            >
              <CardMedia
                component="img"
                height="400"
                image="https://m.media-amazon.com/images/I/71xGHuTl1iL._UF894,1000_QL80_.jpg"
                
                sx={{
                  objectFit: 'cover',
                  filter: 'brightness(0.9) contrast(1.1)',
                }}
              />
            </Card>
          </Grid>

          {/* Right Side - Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  // background: "linear-gradient(135deg, #c33764, #1d2671 100%)",
                  background: "linear-gradient(135deg, #dd5e89, #f7bb97) 100%",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Welcome to Blog App
              </Typography>
              
              <Typography 
                variant="h5" 
                component="p" 
                sx={{ 
                  mb: 4, 
                  color: '#666',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Share your thoughts, connect with others, and discover amazing stories from around the world.
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ mb: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{ 
                    mr: 2,
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    // background: "linear-gradient(to right, #c33764, #1d2671)",
                    background: "linear-gradient(to right, #dd5e89, #f7bb97)",

                    boxShadow: '0 8px 25px rgba(234, 102, 232, 0.3)',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      // boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                      boxShadow: '0 8px 25px rgba(234, 102, 232, 0.3)',
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/login"
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    borderColor: '#667eea',
                    color: '#667eea',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#764ba2',
                      // backgroundColor: 'rgba(102, 126, 234, 0.05)',
                      backgroundColor: "linear-gradient(to right, #c33764, #1d2671)",
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Feature Cards Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 600,
              color: '#333',
              mb: 6
            }}
          >
            Why Choose Our Platform?
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
          <Paper 
            sx={{ 
              p: 4, 
              maxWidth: 320, 
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              }
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: 'orange',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Create & Write
            </Typography>
            <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
              Express yourself with our intuitive writing tools. Create beautiful blog posts with ease.
            </Typography>
          </Paper>

          <Paper 
            sx={{ 
              p: 4, 
              maxWidth: 320, 
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              }
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: 'orange',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Connect
            </Typography>
            <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
              Build a community around your ideas. Connect with like-minded writers and readers.
            </Typography>
          </Paper>

          <Paper 
            sx={{ 
              p: 4, 
              maxWidth: 320, 
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              }
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: 'orange',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Share
            </Typography>
            <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
              Share your stories with the world. Reach readers who are passionate about your topics.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default LandingPage