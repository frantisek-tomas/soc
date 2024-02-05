import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import '../navbar/navbar.css'
import logo from '../img/medicity-logo.png';
import logoBlack from '../img/medicity-logo-black.png';
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const drawerWidth = 240;


function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h5" sx={{ my: 2 }}>
      <img className='img' src={logoBlack} alt="Logo" />
      </Typography>
      <List>
    <Link to='/' className='drawer-link'>Ambulancia</Link><br/>
    <Link to='/recipe-request' className='drawer-link'>Objednávka liekov</Link><br/>
    <Link to='/booking' className='drawer-link'>Preventívna prehliadka</Link><br/>
    <Link to='/prices' className='drawer-link'>Cenník</Link><br/>
    <Link to='/about' className='drawer-link'>Kontakt</Link>
    </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
          <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}
          >
            <Link to='/'>
            <img className='logo-img' src={logo} alt="Logo" />
            </Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <NavLink to='/recipe-request' className={({ isActive }) => (isActive ? "link-active" : "link")}>Objednávka liekov</NavLink>
          <NavLink to='/booking' className={({ isActive }) => (isActive ? "link-active" : "link")}>Preventívna prehliadka</NavLink>
            <NavLink to='/prices' className={({ isActive }) => (isActive ? "link-active" : "link")}>Cenník</NavLink>
            <NavLink to='/about' className={({ isActive }) => (isActive ? "link-active" : "link")}>Kontakt</NavLink>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;