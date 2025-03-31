"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

// Global variables with sample values
const GLOBAL_VARIABLES = {
  board_id: "board_123456",
  club_id: "club_789012",
  event_id: "event_345678",
  creator_id: "user_987654",
};

const CreateResourceDialog = ({ 
  open, 
  handleClose, 
  handleSubmit, 
  initialData = null 
}) => {
  const [error, setError] = useState({
    external_link: false,
  });

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    expiry_date: "",
    external_link: "",
    status: "active",
    tags: [],
    image: null,
    created_at: new Date().toISOString().split("T")[0],
    updated_at: null,
    ...GLOBAL_VARIABLES,
  });

  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Effect to populate form when editing
  useEffect(() => {
    if (initialData) {
      setNewProject({
        ...initialData,
        created_at: initialData.created_at || new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
      });
      
      // Set image preview if existing image
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    } else {
      // Reset form when no initial data
      setNewProject({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        expiry_date: "",
        external_link: "",
        status: "active",
        tags: [],
        image: null,
        created_at: new Date().toISOString().split("T")[0],
        updated_at: null,
        ...GLOBAL_VARIABLES,
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, open]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Validate URL if external_link is being changed
    if (name === "external_link") {
      const urlPattern = /^https?:\/\/.+/;
      setError({
        ...error,
        external_link: !urlPattern.test(value),
      });
    }

    setNewProject({
      ...newProject,
      [name]: value,
      updated_at: new Date().toISOString().split("T")[0],
    });
  };

  const handleAddTag = () => {
    if (tagInput && !newProject.tags.includes(tagInput)) {
      setNewProject({
        ...newProject,
        tags: [...newProject.tags, tagInput],
        updated_at: new Date().toISOString().split("T")[0],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = newProject.tags.filter((_, i) => i !== index);
    setNewProject({
      ...newProject,
      tags: newTags,
      updated_at: new Date().toISOString().split("T")[0],
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // If editing and there was a previous image, remove it from the project
    setNewProject({
      ...newProject,
      image: null,
    });
  };

  const onSubmit = async () => {
    // Validate URL before submission
    const urlPattern = /^https?:\/\/.+/;
    const isValidUrl = urlPattern.test(newProject.external_link);

    if (!isValidUrl) {
      setError({
        ...error,
        external_link: true,
      });
      return;
    }

    // Create FormData to send multipart/form-data
    const formData = new FormData();

    // Append all project details
    Object.keys(newProject).forEach((key) => {
      // Handle tags as a JSON string
      if (key === "tags") {
        newProject.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      } else if (key !== "image") {
        formData.append(key, newProject[key]);
      }
    });

    // Append image if exists
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      // Call the submit handler passed from parent component
      // This will either create or update based on whether initialData exists
      await handleSubmit({
        ...newProject,
        tags: newProject.tags,
        image: imagePreview  // Send the image preview or null
      });

      // Reset form state
      setNewProject({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        expiry_date: "",
        external_link: "",
        status: "active",
        tags: [],
        image: null,
        created_at: new Date().toISOString().split("T")[0],
        updated_at: null,
        ...GLOBAL_VARIABLES,
      });

      // Reset image
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reset error state
      setError({
        external_link: false,
      });
    } catch (error) {
      console.error("Error submitting opportunity:", error);
      alert("Failed to submit opportunity. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {initialData ? "Edit Project" : "Create New Project"}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newProject.title}
              onChange={handleFormChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={newProject.description}
              onChange={handleFormChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Start Date"
              name="start_date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newProject.start_date}
              onChange={handleFormChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="End Date"
              name="end_date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newProject.end_date}
              onChange={handleFormChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              name="expiry_date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newProject.expiry_date}
              onChange={handleFormChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="External Link"
              name="external_link"
              value={newProject.external_link}
              onChange={handleFormChange}
              required
              type="url"
              error={error.external_link}
              helperText={
                error.external_link ? "Enter a valid URL (https://...)" : ""
              }
            />
          </Grid>

          {/* Image Upload Section */}
          <Grid item xs={12}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
              id="image-upload-input"
            />
            <label htmlFor="image-upload-input">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
              </Button>
            </label>

            {/* Image Preview */}
            {(imagePreview || newProject.image) && (
              <Box
                sx={{ mt: 2, position: "relative", display: "inline-block" }}
              >
                <img
                  src={imagePreview || newProject.image}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    color: "red",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={newProject.status}
                onChange={handleFormChange}
                required
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddTag}>
                Add
              </Button>
            </Box>
            <Box sx={{ mt: 1 }}>
              {newProject.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(index)}
                  sx={{ mr: 1, mt: 1 }}
                />
              ))}
            </Box>
          </Grid>

          {/* Existing hidden fields for global variables */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Board ID"
              name="board_id"
              value={newProject.board_id}
              onChange={handleFormChange}
              disabled
              hidden
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Club ID"
              name="club_id"
              value={newProject.club_id}
              onChange={handleFormChange}
              disabled
              hidden
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Event ID"
              name="event_id"
              value={newProject.event_id}
              onChange={handleFormChange}
              disabled
              hidden
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Creator ID"
              name="creator_id"
              value={newProject.creator_id}
              onChange={handleFormChange}
              disabled
              hidden
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {initialData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateResourceDialog;