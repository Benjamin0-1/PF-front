import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HelpIcon from '@mui/icons-material/Help';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PaymentIcon from '@mui/icons-material/Payment';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false);

    const toggleSidebar = () => {
        setExpanded(!expanded);
    };

    return (
        <Box sx={{ width: expanded ? 250 : 64, flexShrink: 0, backgroundColor: '#2c3e50', '& .MuiDrawer-paper': { boxSizing: 'border-box', width: expanded ? 250 : 64 }}}>
            <IconButton onClick={toggleSidebar} sx={{ marginLeft: 1, color: 'white', ...(expanded && { display: 'none' }) }}>
                <MenuIcon />
            </IconButton>
            <Drawer
                variant="persistent"
                anchor="left"
                open={expanded}
                sx={{
                    width: expanded ? 250 : 64,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: expanded ? 250 : 64,
                        boxSizing: 'border-box',
                        backgroundColor: '#2c3e50',
                        color: 'white',
                    },
                }}
            >
                <IconButton onClick={toggleSidebar} sx={{ color: 'lightblue', margin: 1 }}>
                    {expanded ? '<' : '>'}
                </IconButton>
                <List>
                    {[
                        { text: "Home", icon: <HomeIcon />, path: "/home" },
                        { text: "Buy a product", icon: <ShoppingBasketIcon />, path: "/buy" },
                        { text: "Profile", icon: <PersonIcon />, path: "/viewprofile" },
                        { text: "Favorites", icon: <FavoriteIcon />, path: "/favorites" },
                        { text: "FAQs", icon: <HelpIcon />, path: "/faq" },
                        { text: "Shipping Details", icon: <LocalShippingIcon />, path: "/shippingdetails" },
                        { text: "Shipping", icon: <LocalShippingIcon />, path: "/shipping" },
                        { text: "Reviews", icon: <RateReviewIcon />, path: "/userreviews" },
                        { text: "Orders", icon: <RateReviewIcon />, path: "/orders" },
                        { text: "Payment History", icon: <PaymentIcon />, path: "/paymenthistory" },
                        { text: "About Us", icon: <InfoIcon />, path: "/aboutus" },
                    ].map((item, index) => (
                        <ListItem button key={index} component={Link} to={item.path}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
};

export default Sidebar;
