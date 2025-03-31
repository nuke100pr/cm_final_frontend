"use client";

import React, { useContext, useEffect } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  IconButton,
  Chip,
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

  useEffect(() => {
    console.log("User Role from Context:", info.user_role);
  }, [info]);

  const handleEdit = (event, opportunity) => {
    event.stopPropagation(); // Prevents unintended clicks
    console.log("Edit button clicked for:", opportunity.title);
  };

  const handleDelete = (event, opportunity) => {
    event.stopPropagation(); // Prevents unintended clicks
    console.log("Delete button clicked for:", opportunity.title);
  };

  return (
    <Container>
      <Stack spacing={2} alignItems="center">
        {sampleOpportunities.map((opportunity) => (
          <Card key={opportunity._id} style={{ width: "100%", maxWidth: "500px", padding: "16px" }}>
            <CardContent>
              {/* Title & Edit/Delete Buttons */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{opportunity.title}</Typography>
                {value2.user_role === "super_admin" && (
                  <Box>
                    <IconButton onClick={(event) => handleEdit(event, opportunity)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={(event) => handleDelete(event, opportunity)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {/* Description */}
              <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                {opportunity.description}
              </Typography>

              {/* Dates */}
              <Typography variant="body2" style={{ marginTop: 8 }}>
                <strong>Start Date:</strong> {opportunity.start_date}
              </Typography>
              <Typography variant="body2">
                <strong>End Date:</strong> {opportunity.end_date}
              </Typography>

              {/* Status */}
              <Typography variant="body2">
                <strong>Status:</strong> {opportunity.status}
              </Typography>

              {/* Keywords */}
              <Box marginTop={2}>
                {opportunity.keywords.map((keyword, index) => (
                  <Chip key={index} label={keyword} style={{ marginRight: 4, marginBottom: 4 }} />
                ))}
              </Box>

              {/* Apply Button */}
              <Button
                variant="contained"
                color="primary"
                href={opportunity.external_link}
                target="_blank"
                style={{ marginTop: 12 }}
              >
                Apply
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default OPPORTUNITIES;
