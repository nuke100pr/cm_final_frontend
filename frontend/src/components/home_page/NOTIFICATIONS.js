"use client";
import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Badge,
  Divider
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";

const sampleNotifications = [
  { id: 1, title: "New Order Received", message: "You have a new order #12345.", time: "2m ago" },
  { id: 2, title: "System Update", message: "Your system was updated successfully.", time: "1h ago" },
  { id: 3, title: "New Message", message: "John sent you a message.", time: "3h ago" },
  { id: 4, title: "Reminder", message: "Meeting with the team at 4 PM.", time: "5h ago" }
];

const Notifications = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
      <IconButton onClick={toggleDrawer} sx={{ backgroundColor: "#fff", boxShadow: 3 }}>
        <Badge badgeContent={sampleNotifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 350, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Notifications</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {sampleNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem button>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {notification.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < sampleNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Notifications;
