"use client";
import { Card, CardContent, Typography, Grid, Container } from "@mui/material";

const stats = [
  { label: "Followers", value: 1200 },
  { label: "Views", value: 8750 },
  { label: "Likes", value: 530 },
  { label: "Comments", value: 215 },
];

export default function StatsDisplay() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={6} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}