import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  // AccountCircle,
  Brightness4,
  Brightness7,
  Create as CreateIcon
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';

interface HeaderProps {
  toggleTheme: () => void;
  
}

export const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?';
  };

  return (
    <AppBar position="sticky" sx={{background: "linear-gradient(135deg, #801b3bff, #1d2671 100%)",
      borderRadius: 0,
    }}>
      <Toolbar >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: 50,
          fontWeight: 700,
                  // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  // background: "linear-gradient(135deg, #c33764, #1d2671 100%)",
                  background: "linear-gradient(1deg, #dd5e89, #f7bb97) 100%",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  // mb: 3,
                  
         }} >
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            BlogIt
            
          </Link>
        </Typography>

        <IconButton sx={{ mr: 1 }} onClick={toggleTheme} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/blogs"
              
              // startIcon={<CreateIcon />}
              sx={{ fontSize: 19,
                fontWeight: 700,
                  // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  // background: "linear-gradient(135deg, #c33764, #1d2671 100%)",
                  background: "linear-gradient(1deg, #dd5e89, #f7bb97) 100%",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
               }}
            >
              Blogs
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/create-blog"
              startIcon={<CreateIcon />}
              sx={{ fontSize: 19,
                fontWeight: 700,
                  // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  // background: "linear-gradient(135deg, #c33764, #1d2671 100%)",
                  background: "linear-gradient(1deg, #dd5e89, #f7bb97) 100%",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
               }}
              
            >
              Create
            </Button>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {user?.profileImage ? (
                <Avatar 
                  src={user.profileImage} 
                  alt={user.username}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {getInitials(user?.firstName, user?.lastName)}
                </Avatar>
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              variant="outlined"
            >
              Login
            </Button>
            <Button 
              color="secondary" 
              component={Link} 
              to="/register"
              variant="contained"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

