import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Button, Chip, FormControl, CircularProgress
} from "@mui/material";

// Global variables with sample values
const GLOBAL_VARIABLES = {
  club_id: "club123",
  event_id: "event456", 
  board_id: "board789",
  user_id: "user101"
};

const SAMPLE_TAGS = [
  "Technology", 
  "Education", 
  "Research", 
  "Innovation"
];

const CreateResourceDialog = ({ 
  open, 
  onClose, 
  existingResource = null,
  onCreateResource,
  onUpdateResource 
}) => {
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    resource_link: "",
    published_at: new Date().toISOString().split('T')[0],
    tags: [],
    club_id: GLOBAL_VARIABLES.club_id,
    event_id: GLOBAL_VARIABLES.event_id,
    board_id: GLOBAL_VARIABLES.board_id,
    user_id: GLOBAL_VARIABLES.user_id
  });
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form when editing an existing resource
  useEffect(() => {
    if (existingResource) {
      setNewResource({
        ...existingResource,
        published_at: existingResource.published_at 
          ? new Date(existingResource.published_at).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0]
      });
    } else {
      // Reset form when no existing resource
      setNewResource({
        title: "",
        description: "",
        resource_link: "",
        published_at: new Date().toISOString().split('T')[0],
        tags: [],
        club_id: GLOBAL_VARIABLES.club_id,
        event_id: GLOBAL_VARIABLES.event_id,
        board_id: GLOBAL_VARIABLES.board_id,
        user_id: GLOBAL_VARIABLES.user_id
      });
    }
  }, [existingResource, open]);

  const handleNewResourceChange = (field) => (event) => {
    setNewResource({ ...newResource, [field]: event.target.value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newResource.tags.includes(newTag.trim())) {
      setNewResource({
        ...newResource,
        tags: [...newResource.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewResource({
      ...newResource,
      tags: newResource.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmitResource = async () => {
    // Form validation
    if (!newResource.title || !newResource.description || !newResource.resource_link) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (existingResource) {
        // Update existing resource
        response = await fetch(`http://localhost:5000/resources/bpi/${existingResource.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newResource)
        });
      } else {
        // Create new resource
        response = await fetch('http://localhost:5000/resources/api/resource', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newResource)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save resource');
      }

      const savedResource = await response.json();
      
      // Reset form
      setNewResource({
        title: "",
        description: "",
        resource_link: "",
        published_at: new Date().toISOString().split('T')[0],
        tags: [],
        club_id: GLOBAL_VARIABLES.club_id,
        event_id: GLOBAL_VARIABLES.event_id,
        board_id: GLOBAL_VARIABLES.board_id,
        user_id: GLOBAL_VARIABLES.user_id
      });
      setNewTag("");
      
      // Close dialog
      onClose();
      
      // Call appropriate callback
      if (existingResource) {
        onUpdateResource(savedResource.data);
      } else {
        onCreateResource(savedResource.data);
      }
      
      // Optional: show success message
      alert(existingResource ? 'Resource updated successfully!' : 'Resource created successfully!');
    } catch (err) {
      setError(err.message);
      alert(`Error ${existingResource ? 'updating' : 'creating'} resource: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form on close
    setNewResource({
      title: "",
      description: "",
      resource_link: "",
      published_at: new Date().toISOString().split('T')[0],
      tags: [],
      club_id: GLOBAL_VARIABLES.club_id,
      event_id: GLOBAL_VARIABLES.event_id,
      board_id: GLOBAL_VARIABLES.board_id,
      user_id: GLOBAL_VARIABLES.user_id
    });
    setNewTag("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{existingResource ? 'Edit Resource' : 'Create New Resource'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Title"
            value={newResource.title}
            onChange={handleNewResourceChange("title")}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={newResource.description}
            onChange={handleNewResourceChange("description")}
            fullWidth
            required
            multiline
            rows={4}
          />
          <TextField
            label="Resource Link"
            value={newResource.resource_link}
            onChange={handleNewResourceChange("resource_link")}
            fullWidth
            required
          />
          <TextField
            label="Published Date"
            type="date"
            value={newResource.published_at}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            disabled
          />
          <FormControl fullWidth>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                label="Add Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                fullWidth
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button variant="contained" onClick={handleAddTag}>Add</Button>
            </Box>
            <Box sx={{ mt: 1 }}>
              {newResource.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  sx={{ mr: 1, mt: 1 }}
                />
              ))}
            </Box>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>Cancel</Button>
        <Button 
          onClick={handleSubmitResource} 
          variant="contained" 
          color="primary" 
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : (existingResource ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateResourceDialog;