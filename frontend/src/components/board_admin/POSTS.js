"use client";
import { useState, useContext } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  TextField,
  Grid,
  Paper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import noteContext from "../../contexts/noteContext";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const info = useContext(noteContext);
  const value2 = info.info;

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 2, boxShadow: 3 }}>
      <CardHeader
        avatar={<Avatar src={post.userAvatar} />}
        title={post.userName}
        subheader={post.timestamp ? new Date(post.timestamp).toLocaleString() : "Unknown date"}
        action={
          value2.user_role === "super_admin" && (
            <Box>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )
        }
      />
      {post.media?.length > 0 && (
        <Carousel showThumbs={false} showStatus={false} infiniteLoop>
          {post.media.map((media, index) => (
            <CardMedia
              key={index}
              component={media.type === "video" ? "video" : "img"}
              image={media.url}
              controls={media.type === "video"}
              sx={{ height: 300, objectFit: "cover" }}
            />
          ))}
        </Carousel>
      )}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.description || "No description available"}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike} color={liked ? "error" : "default"}>
          <FavoriteIcon />
        </IconButton>
        <Typography variant="body2">{likes}</Typography>
      </CardActions>
    </Card>
  );
};

const samplePosts = [
  {
    userName: "Alice Johnson",
    userAvatar: "/avatars/alice.jpg",
    timestamp: "2025-03-14T12:30:00Z",
    media: [
      { url: "/images/post1-1.jpg", type: "image" },
      { url: "/images/post1-2.jpg", type: "image" },
    ],
    description: "Had an amazing trip to the mountains! 🌄",
    likes: 120,
  },
  {
    userName: "Bob Smith",
    userAvatar: "/avatars/bob.jpg",
    timestamp: "2025-03-13T15:45:00Z",
    media: [{ url: "/videos/post2.mp4", type: "video" }],
    description: "Check out my latest drone footage! 🚁",
    likes: 90,
  },
  {
    userName: "Charlie Davis",
    userAvatar: "/avatars/charlie.jpg",
    timestamp: "2025-03-12T09:10:00Z",
    media: [],
    description: "Just finished my latest painting! 🎨 What do you think?",
    likes: 75,
  },
];

const Posts = ({ posts = samplePosts }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Left Panel - Search Bar (Fixed, Non-Scrollable) */}
      <Grid item xs={12} sm={3}>
        <Paper
          sx={{
            p: 2,
            position: "sticky",
            top: 80, // Ensures it stays below any navbar
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: 3, // Moderate elevation
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Search posts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Paper>
      </Grid>

      {/* Right Panel - Scrollable Posts */}
      <Grid item xs={12} sm={9}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => <PostCard key={index} post={post} />)
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            No posts available.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Posts;
