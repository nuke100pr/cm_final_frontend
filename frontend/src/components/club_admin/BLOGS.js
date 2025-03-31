"use client";

import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import Image from "next/image";

const sampleBlogs = [
  {
    _id: "1",
    title: "The Rise of AI in Everyday Life",
    introduction: "Artificial Intelligence is shaping the world around us...",
    main_content:
      "AI is integrated into multiple domains, including healthcare, finance, and automation...",
    conclusion: "The future of AI looks promising as technology advances.",
    author_info: "John Doe, AI Researcher",
    published_at: "2024-03-10",
    published_by: "Tech Weekly",
    keywords: ["AI", "Machine Learning", "Future Tech"],
    images: ["/ai1.jpg", "/ai2.jpg"],
  },
  {
    _id: "2",
    title: "Web 3.0: The Future of Internet",
    introduction:
      "Web 3.0 promises decentralization and better user control...",
    main_content:
      "Blockchain and smart contracts play a significant role in Web 3.0...",
    conclusion:
      "It is essential to understand how Web 3.0 will impact our digital interactions.",
    author_info: "Jane Smith, Blockchain Developer",
    published_at: "2024-02-15",
    published_by: "Blockchain Insights",
    keywords: ["Blockchain", "Web 3.0", "Decentralization"],
    images: ["/web3.jpg"],
  },
];

const BLOGS = () => {
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleOpen = (blog) => {
    setSelectedBlog(blog);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBlog(null);
  };

  return (
    <Grid container spacing={2}>
      {sampleBlogs.map((blog) => (
        <Grid item xs={12} sm={6} md={4} key={blog._id}>
          <Card>
            <CardHeader
              title={blog.title}
              subheader={`By ${blog.published_by} on ${blog.published_at}`}
            />
            {blog.images.length > 0 && (
              <Image
                src={blog.images[0]}
                alt={blog.title}
                width={400}
                height={250}
                style={{ objectFit: "cover", width: "100%" }}
              />
            )}
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {blog.introduction}
              </Typography>
              <div style={{ marginTop: 8 }}>
                {blog.keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    style={{ marginRight: 4 }}
                  />
                ))}
              </div>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleOpen(blog)}
              >
                Read More
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{selectedBlog?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedBlog?.introduction}
          </Typography>
          <Typography variant="body2" paragraph>
            {selectedBlog?.main_content}
          </Typography>
          <Typography variant="subtitle1" fontStyle="italic">
            {selectedBlog?.conclusion}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Author: {selectedBlog?.author_info} | Published by{" "}
            {selectedBlog?.published_by} on {selectedBlog?.published_at}
          </Typography>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default BLOGS;
