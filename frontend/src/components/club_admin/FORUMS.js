'use client';

import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, Button, Dialog, DialogTitle, DialogContent, Typography, Grid, Chip } from '@mui/material';

const sampleForums = [
  {
    _id: '1',
    title: 'AI Innovations',
    description: 'Discuss the latest trends and breakthroughs in AI.',
    number_of_views: '1200',
    number_of_replies: '150',
    event_id: 'AI Summit',
    club_id: 'AI Club',
    board_id: 'Tech Board',
    user_id: 'John Doe',
    public_or_private: 'Public',
  },
  {
    _id: '2',
    title: 'Web Development Best Practices',
    description: 'Share and discuss the best practices for web development.',
    number_of_views: '900',
    number_of_replies: '75',
    event_id: 'Web Dev Workshop',
    club_id: 'Web Dev Club',
    board_id: 'Tech Board',
    user_id: 'Jane Smith',
    public_or_private: 'Private',
  },
  {
    _id: '3',
    title: 'Cybersecurity Awareness',
    description: 'A forum to discuss the importance of cybersecurity.',
    number_of_views: '1500',
    number_of_replies: '200',
    event_id: 'Cybersecurity Talk',
    club_id: 'Cybersecurity Club',
    board_id: 'Security Board',
    user_id: 'Alice Johnson',
    public_or_private: 'Public',
  }
];

const FORUMS = () => {
  const [open, setOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);

  const handleOpen = (forum) => {
    setSelectedForum(forum);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedForum(null);
  };

  return (
    <Grid container spacing={2}>
      {sampleForums.map((forum) => (
        <Grid item xs={12} sm={6} md={4} key={forum._id}>
          <Card>
            <CardHeader title={forum.title} subheader={`By ${forum.user_id} | ${forum.public_or_private}`} />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {forum.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Views: {forum.number_of_views} | Replies: {forum.number_of_replies}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" color="primary" onClick={() => handleOpen(forum)}>
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedForum?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedForum?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Club: {selectedForum?.club_id} <br />
            Event: {selectedForum?.event_id} <br />
            Board: {selectedForum?.board_id} <br />
            User: {selectedForum?.user_id} <br />
            Views: {selectedForum?.number_of_views} | Replies: {selectedForum?.number_of_replies}
          </Typography>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default FORUMS;
