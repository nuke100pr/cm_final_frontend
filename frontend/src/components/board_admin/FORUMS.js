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

const sampleForums = [
  {
    _id: "1",
    title: "How to get started with AI?",
    description: "Looking for beginner-friendly resources to learn AI.",
    author: "John Doe",
    created_at: "2024-03-10",
    club_id: "AI Club",
  },
  {
    _id: "2",
    title: "Best practices for secure web development",
    description: "What are some security best practices for web developers?",
    author: "Jane Smith",
    created_at: "2024-02-20",
    club_id: "Web Dev Club",
  },
  {
    _id: "3",
    title: "Understanding Blockchain Technology",
    description: "Can someone explain how blockchain works in simple terms?",
    author: "Alice Johnson",
    created_at: "2024-01-15",
    club_id: "Blockchain Club",
  },
];

const FORUMS = () => {
  const [open, setOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const info = useContext(noteContext);
  const value2 = info.info;

  useEffect(() => {
    console.log("User Role from Context:", info.user_role);
  }, [info]);

  const handleEdit = (forum) => {
    console.log("Edit button clicked for:", forum.title);
  };

  const handleDelete = (forum) => {
    console.log("Delete button clicked for:", forum.title);
  };

  const handleOpen = (forum) => {
    setSelectedForum(forum);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedForum(null);
  };

  // Filter forums dynamically based on search query
  const filteredForums = sampleForums.filter((forum) =>
    forum.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {/* Left Panel - Search Bar (Fixed, Non-Scrollable) */}
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
            label="Search Forums"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Paper>
      </Grid>

      {/* Right Panel - Forum Cards */}
      <Grid item xs={12} sm={9}>
        <Grid container spacing={2}>
          {filteredForums.length > 0 ? (
            filteredForums.map((forum) => (
              <Grid item xs={12} sm={6} md={4} key={forum._id}>
                <Card>
                  <CardHeader
                    title={forum.title}
                    subheader={`By ${forum.author} on ${forum.created_at}`}
                    action={
                      value2.user_role === "super_admin" && (
                        <Box>
                          <IconButton onClick={() => handleEdit(forum)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(forum)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {forum.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="contained" color="primary" onClick={() => handleOpen(forum)}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" align="center">
                No forums found.
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Dialog for Viewing Forum Details */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedForum?.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              {selectedForum?.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Club: {selectedForum?.club_id} <br />
              Author: {selectedForum?.author} <br />
              Created At: {selectedForum?.created_at}
            </Typography>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default FORUMS;