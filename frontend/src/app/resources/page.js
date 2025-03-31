"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Box, Container, Grid, Typography, Card, CardContent, Button, Chip,
  IconButton, Tooltip, Fab
} from "@mui/material";
import {
  Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon, Add as AddIcon
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import noteContext from "../../contexts/noteContext";
import SearchAndFilterBar from "../../components/resources/SearchAndFilterBar";
import CreateResourceDialog from "../../components/resources/CreateResourceDialog";

// Tag color generation function
const getTagColor = (index) => {
  const colors = [
    "#1976d2", "#388e3c", "#d32f2f", "#7b1fa2", 
    "#f57c00", "#455a64", "#00796b", "#c2185b"
  ];
  return colors[index % colors.length];
};

const ResourceCards = () => {
  const [allResources, setAllResources] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  
  const { info: value2 } = useContext(noteContext);

  // Extract unique keywords
  const allKeywords = [...new Set(allResources.flatMap(resource => resource.tags || []))];

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("http://localhost:5000/resources/api/resource");
        const result = await response.json();
        
        if (result.success && result.data) {
          const formattedResources = result.data.map(resource => ({
            id: resource._id,
            title: resource.title,
            description: resource.description,
            keywords: resource.tags || [],
            publishedBy: resource.user_id || "Unknown",
            publishedAt: resource.published_at,
            url: resource.resource_link,
            tags: resource.tags || []
          }));

          setAllResources(formattedResources);
          
          // Restore saved resources from localStorage
          const savedIds = JSON.parse(localStorage.getItem("savedResources") || "[]");
          setSavedResources(formattedResources.filter(resource => savedIds.includes(resource.id)));
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);

  // Filter resources when dependencies change
  useEffect(() => {
    const baseResources = activeTab === "all" ? allResources : savedResources;
    let result = baseResources;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(search) ||
        resource.description.toLowerCase().includes(search) ||
        resource.keywords.some(keyword => keyword.toLowerCase().includes(search))
      );
    }

    // Apply keyword filters
    if (selectedKeywords.length > 0) {
      result = result.filter(resource => 
        resource.keywords.some(keyword => selectedKeywords.includes(keyword))
      );
    }

    setFilteredResources(result);
  }, [searchTerm, activeTab, allResources, savedResources, selectedKeywords]);

  // Resource management functions
  const saveResource = (resourceId) => {
    const savedIds = JSON.parse(localStorage.getItem("savedResources") || "[]");
    if (!savedIds.includes(resourceId)) {
      const newSavedIds = [...savedIds, resourceId];
      localStorage.setItem("savedResources", JSON.stringify(newSavedIds));
      setSavedResources(prev => [...prev, allResources.find(r => r.id === resourceId)]);
    }
  };

  const unsaveResource = (resourceId) => {
    const savedIds = JSON.parse(localStorage.getItem("savedResources") || "[]");
    const newSavedIds = savedIds.filter(id => id !== resourceId);
    localStorage.setItem("savedResources", JSON.stringify(newSavedIds));
    setSavedResources(prev => prev.filter(resource => resource.id !== resourceId));
  };

  const shareResource = (resource) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: resource.url,
      }).catch(error => console.error("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(resource.url)
        .then(() => alert("Link copied to clipboard: " + resource.url))
        .catch(err => console.error("Failed to copy link: ", err));
    }
  };

  const handleEdit = async (resourceId) => {
    console.log("Edit button clicked for resource:", resourceId); // Debugging log
    try {
      const response = await fetch(`http://localhost:5000/resources/bpi/${resourceId}`);
      const result = await response.json();
      
      if (result.success) {
        const editResource = {
          id: result.data._id,
          title: result.data.title,
          description: result.data.description,
          resource_link: result.data.resource_link,
          published_at: result.data.published_at,
          tags: result.data.tags || []
        };
        
        console.log("Editing resource:", editResource); // Debugging log
        
        // Set editing resource and open dialog
        setEditingResource(editResource);
        setCreateDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching resource details:", error);
    }
  };

  const handleDelete = async (resourceId) => {
    try {
      const response = await fetch(`http://localhost:5000/resources/bpi/${resourceId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        // Remove from all resources
        setAllResources(prev => prev.filter(r => r.id !== resourceId));
        // Remove from saved resources if it was saved
        setSavedResources(prev => prev.filter(r => r.id !== resourceId));
        alert('Resource deleted successfully!');
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const handleCreateResource = (newResource) => {
    // Add to resources
    setAllResources(prev => [...prev, newResource]);
    setCreateDialogOpen(false);
  };

  const handleUpdateResource = (updatedResource) => {
    // Update in all resources
    setAllResources(prev => 
      prev.map(r => r.id === updatedResource.id ? updatedResource : r)
    );
    // Update in saved resources if applicable
    setSavedResources(prev => 
      prev.map(r => r.id === updatedResource.id ? updatedResource : r)
    );
    setCreateDialogOpen(false);
    setEditingResource(null);
  };

  const handleFilterReset = () => {
    setSelectedKeywords([]);
    setFilterActive(false);
  };

  const handleDialogClose = () => {
    setCreateDialogOpen(false);
    setEditingResource(null);
  };

  return (
    <Box>
      {/* Search and Filter Bar */}
      <SearchAndFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        allKeywords={allKeywords}
        selectedKeywords={selectedKeywords}
        setSelectedKeywords={setSelectedKeywords}
        filterActive={filterActive}
        setFilterActive={setFilterActive}
        handleFilterReset={handleFilterReset}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allResourcesCount={allResources.length}
        savedResourcesCount={savedResources.length}
      />

      {/* Resource Grid */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => {
              const isSaved = savedResources.some(r => r.id === resource.id);
              
              return (
                <Grid item key={resource.id} xs={12} sm={6} md={4}>
                  <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
                    {value2.user_role === "super_admin" && (
                      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
                        <IconButton 
                          onClick={() => handleEdit(resource.id)} 
                          color="primary" 
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(resource.id)} color="error" size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                    
                    {/* Rest of the card content remains the same */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {resource.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {resource.description}
                      </Typography>

                      {resource.tags && resource.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                          {resource.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{
                                backgroundColor: getTagColor(index),
                                color: "white",
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      <Typography variant="body2" color="text.secondary">
                        Published by: {resource.publishedBy}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Published at: {new Date(resource.publishedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.open(resource.url, "_blank")}
                      >
                        View Resource
                      </Button>

                      <Box display="flex" alignItems="center">
                        <Tooltip title="Share resource">
                          <IconButton onClick={() => shareResource(resource)} color="primary">
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>

                        <Button
                          variant="contained"
                          color={isSaved ? "error" : "success"}
                          startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                          onClick={() => isSaved ? unsaveResource(resource.id) : saveResource(resource.id)}
                          size="medium"
                        >
                          {isSaved ? "Unsave" : "Save"}
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", width: "100%", mt: 4 }}>
              No resources found
            </Typography>
          )}
        </Grid>
      </Container>

      {/* Create Resource Dialog */}
      <CreateResourceDialog 
        open={createDialogOpen}
        onClose={handleDialogClose}
        existingResource={editingResource}
        onCreateResource={handleCreateResource}
        onUpdateResource={handleUpdateResource}
      />

      {/* Floating Action Button for Creating Resources */}
      {value2.user_role === "super_admin" && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => {
            setEditingResource(null);
            setCreateDialogOpen(true);
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ResourceCards;