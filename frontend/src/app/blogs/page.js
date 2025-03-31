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
import BlogCreateForm from "../../components/blogs/BlogCreateForm";
import SearchBar from "../../components/blogs/SearchBar";

export default function BLOGS() {
  const {
    info: { user_role },
  } = useContext(noteContext);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/blogs/blogs");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();

        const transformedBlogs = jsonResponse
          .map((blog) => ({
            id: blog._id,
            title: blog.title || "Untitled Blog",
            publisher: "Unknown", // Since publisher is not in the current response
            introduction: blog.introduction || "",
            mainContent: blog.main_content || "", // Note the snake_case
            conclusion: blog.conclusion || "",
            tags: blog.tags || [],
            image: blog.image || null, // Assuming this is an image ID
            createdAt: new Date().toLocaleDateString(), // No createdAt in current response
          }))
          .filter((blog) => blog.title !== "Untitled Blog"); // Optional: filter out incomplete blogs

        setBlogs(transformedBlogs);
        setFilteredBlogs(transformedBlogs);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Add filtering effect
  useEffect(() => {
    if (!searchQuery) {
      setFilteredBlogs(blogs);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = blogs.filter(blog => 
      blog.title.toLowerCase().includes(lowercaseQuery) ||
      blog.introduction.toLowerCase().includes(lowercaseQuery) ||
      blog.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );

    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  const handleDelete = async (blogId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/blogs/blogs/${blogId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedBlogs = blogs.filter((blog) => blog.id !== blogId);
      setBlogs(updatedBlogs);
      setFilteredBlogs(updatedBlogs);
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  const handleEdit = async (blog) => {
    try {
      const response = await fetch(
        `http://localhost:5000/blogs/blogs/${blog.id}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const blogDetails = await response.json();
      
      // Adjust this based on the actual response structure
      const fetchedBlog = blogDetails; // If the response is directly the blog object
  
      const formData = {
        title: fetchedBlog.title,
        publisher: "Unknown", // You might want to add a publisher field if available
        introduction: fetchedBlog.introduction,
        mainContent: fetchedBlog.main_content, // Note the snake_case to camelCase conversion
        conclusion: fetchedBlog.conclusion,
        tags: fetchedBlog.tags || [],
        blogImage: fetchedBlog.image || null,
      };
  
      setSelectedBlog({
        ...blog,
        ...formData // Merge existing blog data with fetched details
      });
      setIsEditing(true);
      setOpenDialog(true);
    } catch (error) {
      console.error("Failed to fetch blog details:", error);
    }
  };

  const handleAddNew = () => {
    setSelectedBlog(null);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const url = isEditing
        ? `http://localhost:5000/blogs/blogs/${selectedBlog.id}`
        : "http://localhost:5000/blogs/blogs";

      const method = isEditing ? "PUT" : "POST";

      const multipartFormData = new FormData();

      // Append all text fields
      multipartFormData.append("title", formData.title);
      multipartFormData.append("publisher", formData.publisher);
      multipartFormData.append("introduction", formData.introduction);
      multipartFormData.append("mainContent", formData.mainContent);
      multipartFormData.append("conclusion", formData.conclusion);

      // Append tags
      formData.tags.forEach((tag, index) => {
        multipartFormData.append(`tags[${index}]`, tag);
      });

      // Handle image upload
      if (formData.blogImage instanceof File) {
        multipartFormData.append("image", formData.blogImage);
      } else if (formData.blogImage && typeof formData.blogImage === "string") {
        multipartFormData.append("image", formData.blogImage);
      }

      // Append ID for editing
      if (isEditing && selectedBlog) {
        multipartFormData.append("_id", selectedBlog.id);
      }

      const response = await fetch(url, {
        method: method,
        body: multipartFormData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedBlog = await response.json();

      if (isEditing && selectedBlog) {
        const updatedBlogs = blogs.map((blog) =>
          blog.id === selectedBlog.id
            ? {
                ...updatedBlog,
                id: updatedBlog._id,
                createdAt: new Date(
                  updatedBlog.createdAt
                ).toLocaleDateString(),
              }
            : blog
        );
        setBlogs(updatedBlogs);
        setFilteredBlogs(updatedBlogs);
      } else {
        const newBlog = {
          ...updatedBlog,
          id: updatedBlog._id,
          createdAt: new Date(updatedBlog.createdAt).toLocaleDateString(),
        };
        const updatedBlogs = [...blogs, newBlog];
        setBlogs(updatedBlogs);
        setFilteredBlogs(updatedBlogs);
      }
      setOpenDialog(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to submit blog:", error);
    }
  };

  const isAdmin = user_role === "super_admin" || user_role === "club_admin";

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterToggle = () => {};

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 2, textAlign: "center" }}>
        <Typography variant="h6">Loading blogs...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error loading blogs: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 2, position: "relative", minHeight: "80vh" }}
    >
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterToggle={handleFilterToggle}
      />

      <Grid container spacing={2}>
        {filteredBlogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Card elevation={1} sx={{ height: "100%" }}>
              <CardContent>
                {blog.image && (
                  <Box
                    component="img"
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      mb: 2,
                      borderRadius: 1,
                    }}
                    src={blog.image}
                    alt={blog.title}
                  />
                )}
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">{blog.title}</Typography>
                  {isAdmin && (
                    <Box>
                      <IconButton
                        onClick={() => handleEdit(blog)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(blog.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>By:</strong> {blog.publisher}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {blog.tags && blog.tags.length > 0 && (
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}
                    >
                      {blog.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    <strong>Published:</strong> {blog.createdAt}
                  </Typography>
                </Box>
                <Button variant="outlined" fullWidth color="primary">
                  Read More
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

      <BlogCreateForm
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setIsEditing(false);
        }}
        onSubmit={handleFormSubmit}
        initialData={
          selectedBlog
            ? {
                title: selectedBlog.title,
                publisher: selectedBlog.publisher,
                introduction: selectedBlog.introduction,
                mainContent: selectedBlog.mainContent,
                conclusion: selectedBlog.conclusion,
                tags: selectedBlog.tags,
                image: selectedBlog.image,
              }
            : null
        }
      />
    </Container>
  );
}