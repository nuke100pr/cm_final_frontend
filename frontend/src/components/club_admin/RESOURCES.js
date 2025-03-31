'use client';

import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, Button, Dialog, DialogTitle, DialogContent, Typography, Grid } from '@mui/material';

const sampleResources = [
  {
    _id: '1',
    title: 'Machine Learning Basics',
    description: 'Introduction to ML concepts and algorithms.',
    resource_link_id: 'https://mlbasics.com',
    club_id: 'AI Club',
    event_id: 'ML Workshop',
    board_id: 'Technical Board',
    user_id: 'John Doe',
  },
  {
    _id: '2',
    title: 'Web Development Guide',
    description: 'Comprehensive guide on modern web development.',
    resource_link_id: 'https://webdev.com',
    club_id: 'Web Dev Club',
    event_id: 'React Meetup',
    board_id: 'Technical Board',
    user_id: 'Jane Smith',
  },
  {
    _id: '3',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn about network security and best practices.',
    resource_link_id: 'https://cybersec.com',
    club_id: 'Cybersecurity Club',
    event_id: 'Cyber Talk',
    board_id: 'Security Board',
    user_id: 'Alice Johnson',
  }
];

const RESOURCES = () => {
  const [open, setOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const handleOpen = (resource) => {
    setSelectedResource(resource);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedResource(null);
  };

  return (
    <Grid container spacing={2}>
      {sampleResources.map((resource) => (
        <Grid item xs={12} sm={6} md={4} key={resource._id}>
          <Card>
            <CardHeader title={resource.title} />
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedResource?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selectedResource?.description}</Typography>
          <Typography variant="body2" color="text.secondary">
            Club: {selectedResource?.club_id} <br />
            Event: {selectedResource?.event_id} <br />
            Board: {selectedResource?.board_id} <br />
            User: {selectedResource?.user_id}
          </Typography>
          <Button variant="contained" color="primary" href={selectedResource?.resource_link_id} target="_blank" sx={{ mt: 2 }}>
            Open Resource
          </Button>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default RESOURCES;