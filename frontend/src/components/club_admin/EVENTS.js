"use client";
import { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Paper,
  Grid,
  Divider,
  Chip,
} from "@mui/material";

const filters = [
  "My Clubs",
  "My Boards",
  "Week",
  "Month",
  "Year",
  "My Registered Events",
];

const events = [
  {
    id: 1,
    name: "Event 1",
    owner: "Club A",
    date: "13/3/25",
    venue: "Hall 1",
    registered: false,
    type: "Session",
  },
  {
    id: 2,
    name: "Event 2",
    owner: "Club B",
    date: "13/3/25",
    venue: "Hall 2",
    registered: true,
    type: "Competition",
  },
  {
    id: 3,
    name: "Event 3",
    owner: "Club C",
    date: "14/3/25",
    venue: "Online",
    registered: false,
    type: "Session",
  },
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
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (event) => {
    setSelectedFilters({
      ...selectedFilters,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar Filter */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filters
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {filters.map((filter) => (
                  <FormControlLabel
                    key={filter}
                    control={
                      <Checkbox
                        checked={selectedFilters[filter] || false}
                        onChange={handleFilterChange}
                        name={filter}
                        color="primary"
                      />
                    }
                    label={filter}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>

        {/* Events List */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card elevation={1} sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {event.name}
                      </Typography>
                      <Chip
                        label={event.type}
                        size="small"
                        sx={{
                          backgroundColor: getTypeColor(event.type),
                          color: "white",
                          mt: 0.5,
                        }}
                      />
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        <strong>Owner:</strong> {event.owner}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
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