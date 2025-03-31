"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const SearchAndFilter = ({ onSearchChange, onBoardFilterChange, availableBoards }) => {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const handleResetFilters = () => {
    setSelectedBoard(null);
    onBoardFilterChange(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  };

  const handleBoardChange = (e) => {
    const value = e.target.value;
    setSelectedBoard(value);
    onBoardFilterChange(value);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          top: 0, 
          bgcolor: 'transparent', 
          boxShadow: 'none', 
          mb: 4, 
          zIndex: theme => theme.zIndex.appBar 
        }}
      >
        <Toolbar>
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              maxWidth: 600,
              width: '100%',
              height: 40,
              bgcolor: '#f5f5f5',
              borderRadius: 24,
              pl: 1,
              transition: 'background-color 0.3s',
              '&:hover': {
                bgcolor: '#eeeeee',
              }
            }}
          >
            <SearchIcon sx={{ opacity: 0.6, mr: 1 }} />
            <InputBase
              placeholder="Search clubs..."
              value={search}
              onChange={handleSearchChange}
              fullWidth
              sx={{ 
                fontSize: '0.95rem',
                '& ::placeholder': {
                  opacity: 0.7
                },
                disableUnderline: true
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleFilterToggle}>
            <FilterListIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Dialog open={filterOpen} onClose={handleFilterToggle}>
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Filter by Board</Typography>
            <RadioGroup
              value={selectedBoard || ""}
              onChange={handleBoardChange}
            >
              {Object.entries(availableBoards).map(([id, name]) => (
                <FormControlLabel key={id} value={id} control={<Radio />} label={name} />
              ))}
            </RadioGroup>
          </FormControl>
          <Button onClick={handleResetFilters} style={{ marginTop: "10px" }}>
            Reset Filters
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchAndFilter;