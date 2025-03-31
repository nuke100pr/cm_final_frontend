"use client";

import React, { useState, useContext, useEffect } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Box,
  IconButton,
  TextField,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const sampleResources = [
  {
    _id: "1",
    title: "Machine Learning Basics",
    description: "Introduction to ML concepts and algorithms.",
    resource_link_id: "https://mlbasics.com",
    club_id: "AI Club",
    event_id: "ML Workshop",
    board_id: "Technical Board",
    user_id: "John Doe",
  },
  {
    _id: "2",
    title: "Web Development Guide",
    description: "Comprehensive guide on modern web development.",
    resource_link_id: "https://webdev.com",
    club_id: "Web Dev Club",
    event_id: "React Meetup",
    board_id: "Technical Board",
    user_id: "Jane Smith",
  },
  {
    _id: "3",
    title: "Cybersecurity Fundamentals",
    description: "Learn about network security and best practices.",
    resource_link_id: "https://cybersec.com",
    club_id: "Cybersecurity Club",
    event_id: "Cyber Talk",
    board_id: "Security Board",
    user_id: "Alice Johnson",
  },
];

const RESOURCES = () => {
  const [open, setOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResources, setFilteredResources] = useState(sampleResources);
  const info = useContext(noteContext);

  useEffect(() => {
    console.log("User Role from Context:", info.user_role);
  }, [info]);

  useEffect(() => {
    const filtered = sampleResources.filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResources(filtered);
  }, [searchTerm]);

  const handleEdit = (resource) => {
    console.log("Edit button clicked for:", resource.title);
  };

  const handleDelete = (resource) => {
    console.log("Delete button clicked for:", resource.title);
  };

  const handleOpen = (resource) => {
    setSelectedResource(resource);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedResource(null);
  };

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {/* Left Panel - Search Bar (Fixed, Non-Scrollable) - Styled like OPPORTUNITIES */}
      <Grid item xs={12} sm={3}>
        <Paper
          sx={{
            p: 2,
            position: "sticky",
            top: 80, // Ensures it stays below any navbar
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: 3, // Moderate elevation
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Search Resources"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Paper>
      </Grid>

      {/* Right Panel - Scrollable Resources */}
      <Grid item xs={12} sm={9}>
        <Grid container spacing={2}>
          {filteredResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource._id}>
              <Card>
                <CardHeader
                  title={resource.title}
                  action={
                    info.user_role === "super_admin" && (
                      <Box>
                        <IconButton onClick={() => handleEdit(resource)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(resource)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {resource.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" color="primary" onClick={() => handleOpen(resource)}>
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Dialog for Viewing Resource Details */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedResource?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedResource?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Club:</strong> {selectedResource?.club_id} <br />
            <strong>Event:</strong> {selectedResource?.event_id} <br />
            <strong>Board:</strong> {selectedResource?.board_id} <br />
            <strong>User:</strong> {selectedResource?.user_id}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href={selectedResource?.resource_link_id}
            target="_blank"
            sx={{ mt: 2 }}
          >
            Open Resource
          </Button>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default RESOURCES;