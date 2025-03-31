"use client";

import React, { useContext, useState } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  IconButton,
  Chip,
  TextField,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const sampleOpportunities = [
  {
    _id: "1",
    title: "Hackathon 2025",
    description: "A nationwide hackathon for students.",
    expiry_date: "2025-05-20",
    status: "active",
    external_link: "https://hackathon.com",
    start_date: "2025-04-15",
    end_date: "2025-05-15",
    keywords: ["coding", "AI", "development"],
  },
  {
    _id: "2",
    title: "Research Internship",
    description: "A summer internship in AI research.",
    expiry_date: "2025-06-30",
    status: "active",
    external_link: "https://research-intern.com",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    keywords: ["ML", "research", "internship"],
  },
];

const OPPORTUNITIES = () => {
  const info = useContext(noteContext);
  const value2 = info.info;
  const [searchQuery, setSearchQuery] = useState("");

  // Filter opportunities dynamically
  const filteredOpportunities = sampleOpportunities.filter((opportunity) =>
    opportunity.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
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
            label="Search Opportunities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Paper>
      </Grid>

      {/* Right Panel - Scrollable Opportunities */}
      <Grid item xs={12} sm={9}>
        <Stack spacing={2} alignItems="center">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opportunity) => (
              <Card key={opportunity._id} sx={{ width: "100%", maxWidth: "500px", p: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{opportunity.title}</Typography>
                    {value2.user_role === "super_admin" && (
                      <Box>
                        <IconButton onClick={() => console.log("Edit", opportunity.title)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => console.log("Delete", opportunity.title)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {opportunity.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Start Date:</strong> {opportunity.start_date}
                  </Typography>
                  <Typography variant="body2">
                    <strong>End Date:</strong> {opportunity.end_date}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {opportunity.status}
                  </Typography>
                  <Box mt={2}>
                    {opportunity.keywords.map((keyword, index) => (
                      <Chip key={index} label={keyword} sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    href={opportunity.external_link}
                    target="_blank"
                    sx={{ mt: 2 }}
                  >
                    Apply
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No opportunities found.
            </Typography>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default OPPORTUNITIES;
