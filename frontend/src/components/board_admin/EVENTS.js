"use client";
import { useState, useContext } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Divider,
  Chip,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const events = [
  { id: 1, name: "Event 1", owner: "Club A", date: "13/3/25", venue: "Hall 1", registered: false, type: "Session" },
  { id: 2, name: "Event 2", owner: "Club B", date: "13/3/25", venue: "Hall 2", registered: true, type: "Competition" },
  { id: 3, name: "Event 3", owner: "Club C", date: "14/3/25", venue: "Online", registered: false, type: "Session" },
  { id: 4, name: "Event 3", owner: "Club C", date: "14/3/25", venue: "Online", registered: false, type: "Session" },
  { id: 5, name: "Event 3", owner: "Club C", date: "14/3/25", venue: "Online", registered: false, type: "Session" },
  { id: 6, name: "Event 3", owner: "Club C", date: "14/3/25", venue: "Online", registered: false, type: "Session" },
  { id: 7, name: "Event 3", owner: "Club C", date: "14/3/25", venue: "Online", registered: false, type: "Session" },
  { id: 8, name: "Event 3", owner: "Club C", date: "14/3/25", venue: "Online", registered: false, type: "Session" },
];

const getTypeColor = (type) => {
  switch (type) {
    case "Session":
      return "#4CAF50";
    case "Competition":
      return "#FF5722";
    default:
      return "#2196F3";
  }
};

export default function EVENTS() {
  const [searchQuery, setSearchQuery] = useState("");
  const info = useContext(noteContext);
  const value2 = info.info;

  const handleEdit = (eventId) => {
    console.log(`Edit event ${eventId}`);
  };

  const handleDelete = (eventId) => {
    console.log(`Delete event ${eventId}`);
  };

  const filteredEvents = events.filter((event) => event.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Panel - Fixed Search Bar */}
        <Grid item xs={12} sm={3}>
          <Paper
            sx={{
              p: 2,
              position: "sticky",
              top: 80, // Adjust to keep it below top navigation
              maxHeight: "90vh", // Prevent excessive growth
              overflow: "auto",
              borderRadius: 2,
              boxShadow: 3, // Moderate elevation
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Search events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Paper>
        </Grid>

        {/* Right Panel - Scrollable Event Cards */}
        <Grid item xs={12} sm={9}>
          <Grid container spacing={2}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card elevation={1} sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="h6">{event.name}</Typography>
                      {value2.user_role === "super_admin" && (
                        <Box>
                          <IconButton onClick={() => handleEdit(event.id)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(event.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Chip
                      label={event.type}
                      size="small"
                      sx={{ backgroundColor: getTypeColor(event.type), color: "white", mt: 0.5 }}
                    />
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Owner:</strong> {event.owner}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Date:</strong> {event.date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Venue:</strong> {event.venue}
                      </Typography>
                    </Box>
                    <Button
                      variant={event.registered ? "contained" : "outlined"}
                      fullWidth
                      color={event.registered ? "success" : "primary"}
                      size="medium"
                    >
                      {event.registered ? "Registered" : "Register"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
