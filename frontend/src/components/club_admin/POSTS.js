"use client";
import { useState } from "react";
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);

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
      />
      {post.media && post.media.length > 0 && (
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
      { url: "/images/post1-2.jpg", type: "image" }
    ],
    description: "Had an amazing trip to the mountains! 🌄",
    likes: 120
  },
  {
    userName: "Bob Smith",
    userAvatar: "/avatars/bob.jpg",
    timestamp: "2025-03-13T15:45:00Z",
    media: [
      { url: "/videos/post2.mp4", type: "video" }
    ],
    description: "Check out my latest drone footage! 🚁",
    likes: 90
  },
  {
    userName: "Charlie Davis",
    userAvatar: "/avatars/charlie.jpg",
    timestamp: "2025-03-12T09:10:00Z",
    media: [],
    description: "Just finished my latest painting! 🎨 What do you think?",
    likes: 75
  }
];

const Posts = ({ posts = samplePosts }) => {
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post, index) => <PostCard key={index} post={post} />)
      ) : (
        <Typography variant="body2" color="text.secondary" align="center">
          No posts available.
        </Typography>
      )}
    </div>
  );
};

export default Posts;
