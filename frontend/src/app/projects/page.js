"use client";
import { useState, useContext, useEffect } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Grid,
  Box,
  Fab,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchAndFilter from "../../components/projects/SearchAndFilter";
import CreateProjectDialog from "../../components/projects/CreateProjectDialog";
import Navbar from "../../components/Navbar";

// Function to generate colors for tags
const getTagColor = (index) => {
  const colors = [
    "#3f51b5", // Indigo
    "#2196f3", // Blue
    "#00bcd4", // Cyan
    "#4caf50", // Green
    "#ff9800", // Orange
    "#9c27b0", // Purple
    "#f44336", // Red
  ];
  return colors[index % colors.length];
};

const PROJECTS = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    club: null,
    board: null,
    status: null,
  });
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  
  const info = useContext(noteContext);
  const value2 = info.info;

  // Fetch projects from backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/projects/api/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchProjectDetails = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:5000/projects/${projectId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching project details:', error);
      return null;
    }
  };

  const createProject = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/projects/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      await fetchProjects();
      return result;
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project: ' + error.message);
      return null;
    }
  };

  const updateProject = async (projectId, formData) => {
    try {
      const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      await fetchProjects();
      return result;
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project: ' + error.message);
      return null;
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Remove the deleted project from the state
      setProjects(projects.filter(project => project._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setAddProjectOpen(true);
  };
  
  const handleAddProjectOpen = () => {
    setEditProject(null);
    setAddProjectOpen(true);
  };
  
  const handleAddProjectClose = () => {
    setAddProjectOpen(false);
    setEditProject(null);
  };
  
  const handleProjectSubmit = (updatedOrNewProject) => {
    handleAddProjectClose();
  };

  const handleSearchChange = (searchText) => {
    setSearch(searchText);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) &&
      (!filters.club || project.club_id === filters.club) &&
      (!filters.board || project.board_id === filters.board) &&
      (!filters.status || project.status === filters.status)
  );

  return (
    <div>
      <Navbar/>
      <>
        <SearchAndFilter 
          onSearchChange={handleSearchChange} 
          onFilterChange={handleFilterChange} 
        />
        
        {/* Project Cards */}
        <Grid container spacing={2}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card>
                {/* Added image display */}
                {project.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:5000${project.image}`}
                    alt={project.title}
                  />
                )}
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">{project.title}</Typography>
                    {value2.user_role === "super_admin" && (
                      <Box>
                        <IconButton onClick={() => handleEdit(project)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(project._id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    Status: {project.status}
                  </Typography>
                  <Typography variant="body2">{project.description}</Typography>
                  
                  {/* Additional Project Details */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Start Date: {new Date(project.start_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      End Date: {new Date(project.end_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created On: {new Date(project.created_on).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* Tags Display */}
                  {project.tags && project.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {project.tags.map((tag, index) => (
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Add/Edit Project Dialog Component */}
        <CreateProjectDialog 
          open={addProjectOpen}
          onClose={handleAddProjectClose}
          onSubmit={handleProjectSubmit}
          projectToEdit={editProject}
          clubId={value2.club_id}
          boardId={value2.board_id}
          fetchProjectDetails={fetchProjectDetails}
          createProject={createProject}
          updateProject={updateProject}
        />
        
        {/* Floating Action Button for adding a new project */}
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={handleAddProjectOpen}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      </>
    </div>
  );
};

export default PROJECTS;