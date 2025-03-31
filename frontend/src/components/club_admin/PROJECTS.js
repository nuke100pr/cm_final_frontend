"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Collapse,
  Grid,
} from "@mui/material";

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
  const [expanded, setExpanded] = useState(null);

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <Grid container spacing={2}>
      {sampleProjects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project._id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{project.title}</Typography>
              <Typography color="textSecondary" gutterBottom>
                Status: {project.status}
              </Typography>
              <Typography variant="body2">{project.description}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleExpandClick(project._id)}>
                {expanded === project._id ? "Hide Members" : "Show Members"}
              </Button>
            </CardActions>
            <Collapse in={expanded === project._id} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography variant="subtitle1">Members:</Typography>
                {project.members.map((member, index) => (
                  <Typography key={index} variant="body2">
                    {member}
                  </Typography>
                ))}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PROJECTS;
