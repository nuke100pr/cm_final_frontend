"use client";
import React, { useContext, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  IconButton,
  Box,
  TextField,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import noteContext from "../../contexts/noteContext";

const sampleProjects = [
  {
    _id: "1",
    club_id: "club123",
    board_id: "board456",
    start_date: "2024-01-10",
    status: "Running",
    end_date: "2024-06-30",
    created_on: "2024-01-01",
    title: "AI Research Project",
    description: "Developing an AI model for image recognition.",
    members: ["Alice", "Bob", "Charlie"],
  },
  {
    _id: "2",
    club_id: "club789",
    board_id: "board012",
    start_date: "2023-09-15",
    status: "Completed",
    end_date: "2024-02-10",
    created_on: "2023-09-01",
    title: "Web App Development",
    description: "Building a full-stack web application for students.",
    members: ["David", "Eve", "Frank"],
  },
];

const PROJECTS = () => {
  const info = useContext(noteContext);
  const value2 = info.info;
  const [searchTerm, setSearchTerm] = useState("");

  // Filter projects as the user types
  const filteredProjects = sampleProjects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            label="Search Projects"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Paper>
      </Grid>

      {/* Right Panel - Scrollable Projects */}
      <Grid item xs={12} sm={9}>
        <Grid container spacing={2}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{project.title}</Typography>
                    <Typography color="textSecondary">Status: {project.status}</Typography>
                    <Typography variant="body2">{project.description}</Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      Members:
                    </Typography>
                    {project.members.map((member, index) => (
                      <Typography key={index} variant="body2">
                        {member}
                      </Typography>
                    ))}
                  </CardContent>
                  <CardActions>
                    {value2.user_role === "super_admin" && (
                      <Box>
                        <IconButton onClick={() => console.log(`Edit project ${project._id}`)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => console.log(`Delete project ${project._id}`)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No projects found.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PROJECTS;
