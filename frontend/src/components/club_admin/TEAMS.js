"use client";
import { useState } from "react";
import { TextField, List, ListItem, ListItemText, Container, Paper } from "@mui/material";

const users = [
  { name: "Alice Johnson", email: "alice@example.com" },
  { name: "Bob Smith", email: "bob@example.com" },
  { name: "Charlie Brown", email: "charlie@example.com" },
  { name: "David Lee", email: "david@example.com" },
];

export default function UserList() {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <TextField
        fullWidth
        label="Search Users"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Paper elevation={3}>
        <List>
          {filteredUsers.map((user, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
