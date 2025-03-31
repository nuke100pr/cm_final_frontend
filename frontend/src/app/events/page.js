"use client";
import { useState, useContext, useEffect } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  Chip,
  IconButton,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EventsSearchBar from "../../components/events/EventsSearchBar";
import EventForm from "../../components/events/EventForm";

const filters = [
  "My Clubs",
  "My Boards",
  "Week",
  "Month",
  "Year",
  "My Registered Events",
];
const eventTypes = ["Session", "Competition", "Workshop", "Meeting"];
const typeColors = {
  Session: "#4CAF50",
  Competition: "#FF5722",
  Workshop: "#9C27B0",
  Meeting: "#2196F3",
};

export default function EVENTS() {
  const {
    info: { user_role },
  } = useContext(noteContext);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/events");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();

        const transformedEvents = jsonResponse.data.map((event) => ({
          id: event._id,
          name: event.name,
          owner: event.club_id,
          date: new Date(event.timestamp).toLocaleDateString(),
          venue: event.venue,
          registered: false,
          type: event.event_type_id || "Session",
          description: event.description,
          duration: event.duration,
          image: event.image || null, // Handle potential missing image
        }));

        setEvents(transformedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleFilterChange = (event) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleEdit = async (event) => {
    try {
      const response = await fetch(`http://localhost:5000/events/${event.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sample = await response.json();
      const eventDetails = sample.data;

      const formData = {
        name: eventDetails.name,
        venue: eventDetails.venue,
        timestamp: new Date(eventDetails.timestamp).toISOString().slice(0, 16),
        duration: eventDetails.duration,
        description: eventDetails.description,
        event_type_id: eventDetails.event_type_id || "Session",
        club_id: eventDetails.club_id,
        board_id: eventDetails.board_id,
        image: eventDetails.image || null, // Include existing image
      };

      setCurrentEvent(event);
      setEditFormData(formData);
      setIsEditing(true);
      setOpenDialog(true);

    } catch (error) {
      console.error("Failed to fetch event details:", error);
    }
  };

  const handleAddNew = () => {
    setCurrentEvent(null);
    setEditFormData(null);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const url = isEditing
        ? `http://localhost:5000/events/${currentEvent.id}`
        : "http://localhost:5000/events";
  
      const method = isEditing ? "PUT" : "POST";
      
      const multipartFormData = new FormData();
      
      // Append all text fields
      multipartFormData.append('name', formData.name);
      multipartFormData.append('venue', formData.venue);
      multipartFormData.append('timestamp', new Date(formData.timestamp).toISOString());
      multipartFormData.append('duration', formData.duration);
      multipartFormData.append('description', formData.description);
      multipartFormData.append('event_type_id', formData.event_type_id || "Session");
      multipartFormData.append('club_id', formData.club_id);
      multipartFormData.append('board_id', formData.board_id);

      // Handle image upload
      if (formData.image instanceof File) {
        multipartFormData.append('image', formData.image);
      } else if (formData.image && typeof formData.image === 'string') {
        // If image is a URL/path string, send it as is
        multipartFormData.append('image', formData.image);
      }

      // Append ID for editing
      if (isEditing && currentEvent) {
        multipartFormData.append('_id', currentEvent.id);
      }
  
      const response = await fetch(url, {
        method: method,
        body: multipartFormData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const updatedEvent = await response.json();

      if (isEditing && currentEvent) {
        setEvents(
          events.map((event) =>
            event.id === currentEvent.id
              ? {
                  ...updatedEvent,
                  id: updatedEvent._id,
                  date: new Date(updatedEvent.timestamp).toLocaleDateString(),
                  registered: event.registered,
                }
              : event
          )
        );
      } else {
        setEvents([
          ...events,
          {
            ...updatedEvent,
            id: updatedEvent._id,
            date: new Date(updatedEvent.timestamp).toLocaleDateString(),
            registered: false,
          },
        ]);
      }
      setOpenDialog(false);
      setEditFormData(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to submit event:", error);
    }
  };

  // Filtering events
  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchQuery
      ? event.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const hasActiveFilters = Object.values(selectedFilters).some(Boolean);

    if (!hasActiveFilters) {
      return matchesSearch;
    }

    const matchesRegisteredFilter = selectedFilters["My Registered Events"]
      ? event.registered
      : true;

    return matchesSearch && matchesRegisteredFilter;
  });

  const isAdmin = user_role === "super_admin" || user_role === "club_admin";

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 2, textAlign: "center" }}>
        <Typography variant="h6">Loading events...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error loading events: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 2, position: "relative", minHeight: "80vh" }}
    >
      <EventsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        filters={filters}
        clearFilters={clearFilters}
      />

      <Grid container spacing={2}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card elevation={1} sx={{ height: "100%" }}>
              <CardContent>
                {event.image && (
                  <Box
                    component="img"
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      mb: 2,
                      borderRadius: 1,
                    }}
                    src={event.image}
                    alt={event.name}
                  />
                )}
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">{event.name}</Typography>
                  {isAdmin && (
                    <Box>
                      <IconButton
                        onClick={() => handleEdit(event)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(event.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Chip
                  label={event.type}
                  size="small"
                  sx={{
                    backgroundColor:
                      typeColors[event.type] || typeColors["Session"],
                    color: "white",
                    mt: 0.5,
                  }}
                />
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Description:</strong> {event.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date:</strong> {event.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Venue:</strong> {event.venue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Duration:</strong> {event.duration}
                  </Typography>
                </Box>
                <Button
                  variant={event.registered ? "contained" : "outlined"}
                  fullWidth
                  color={event.registered ? "success" : "primary"}
                >
                  {event.registered ? "Registered" : "Register"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddNew}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            boxShadow: 3,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      <EventForm
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditFormData(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={
          editFormData || {
            name: "",
            owner: "",
            date: "",
            venue: "",
            type: "Session",
            description: "",
            duration: "",
            image: null,
          }
        }
        title={isEditing ? "Edit Event" : "Add New Event"}
        submitButtonText={isEditing ? "Update Event" : "Create Event"}
        eventTypes={eventTypes}
      />
    </Container>
  );
}