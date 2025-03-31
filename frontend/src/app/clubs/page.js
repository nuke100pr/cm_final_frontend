"use client";
import React, { useState, useContext, useMemo, useEffect } from "react";
import noteContext from "../../contexts/noteContext";
import {
  Card,
  Typography,
  Button,
  IconButton,
  Box,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Import the separated components
import SearchAndFilter from "../../components/clubs/SearchAndFilter";
import CreateClubForm from "../../components/clubs/CreateClubForm";
import Navbar from "../../components/Navbar";

// Club Card Component 
const ClubCard = ({ club, boardName, onFollow, onEdit, onDelete }) => {
  const info = useContext(noteContext);
  const value2 = info.info;
  
  // Determine tag color based on board
  const getTagColor = (boardId) => {
    return boardId === "b1" ? "#4CAF50" : "#FF5722";
  };

  return (
    <Card sx={{ width: 350, m: 1, boxShadow: "0px 2px 6px rgba(0,0,0,0.1)", borderRadius: 2 }}>
      <Box p={2}>
        <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            {club.name}
          </Typography>
          {value2?.user_role === "super_admin" && (
            <Box>
              <IconButton onClick={() => onEdit(club)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(club._id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        
        <Button 
          variant="contained" 
          disableElevation
          sx={{ 
            borderRadius: 20, 
            backgroundColor: getTagColor(club.board_id),
            textTransform: "none",
            mb: 2,
            px: 2,
            py: 0.5,
            "&:hover": {
              backgroundColor: getTagColor(club.board_id),
            }
          }}
        >
          {boardName}
        </Button>

        <Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
          <Typography component="div" sx={{ display: 'flex', mb: 1 }}>
            <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>Owner:</Typography>
            <Typography component="span">{club.name}</Typography>
          </Typography>
          
          <Typography component="div" sx={{ display: 'flex', mb: 2 }}>
            <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>Description:</Typography>
            <Typography component="span" sx={{ maxHeight: "60px", overflow: "hidden" }}>
              {club.description}
            </Typography>
          </Typography>
        </Box>

        <Button 
          variant="outlined" 
          fullWidth
          color="primary" 
          onClick={() => onFollow(club._id)}
          sx={{ 
            borderRadius: 2, 
            textTransform: "none",
            py: 1.5,
            borderColor: "#1976d2",
            color: "#1976d2",
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: "#1976d2",
              opacity: 0.8,
            }
          }}
        >
          FOLLOW
        </Button>
      </Box>
    </Card>
  );
};

const ClubList = () => {
  const [clubs, setClubs] = useState([]);

const [boards, setBoards] = useState(["Project Board", "Personal Board", "Work Board"]);

  
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const info = useContext(noteContext);
  const value2 = info.info;

  // Fetch clubs and boards on component mount
  useEffect(() => {
    const fetchClubsAndBoards = async () => {
      try {
        // Fetch clubs
        const clubsResponse = await fetch('http://localhost:5000/clubs/clubs');
        if (!clubsResponse.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const clubsData = await clubsResponse.json();
        setClubs(clubsData);

        // Fetch boards
        const boardsResponse = await fetch('http://localhost:5000/boards');
        if (!boardsResponse.ok) {
          throw new Error('Failed to fetch boards');
        }
        const boardsData = await boardsResponse.json();
        
        // Convert boards array to object
        const boardsObject = boardsData.reduce((acc, board) => {
          acc[board._id] = board.name;
          return acc;
        }, {});
        setBoards(boardsObject);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchClubsAndBoards();
  }, []);
  
  const handleEdit = async (club) => {
    try {
      const response = await fetch(`http://localhost:5000/clubs/clubs/${club._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch club details');
      }
      const clubDetails = await response.json();
      setSelectedClub(clubDetails);
      setEditDialogOpen(true);
    } catch (error) {
      console.error('Error fetching club details:', error);
    }
  };

  const handleDelete = async (clubId) => {
    try {
      const response = await fetch(`http://localhost:5000/clubs/clubs/${clubId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete club');
      }
      
      // Remove deleted club from the list
      setClubs(prevClubs => prevClubs.filter(club => club._id !== clubId));
    } catch (error) {
      console.error('Error deleting club:', error);
    }
  };
  
  const handleCreateClub = async (newClub) => {
    // Add the new club to the list
    setClubs(prevClubs => [...prevClubs, newClub]);
    setCreateDialogOpen(false);
  };

  const handleUpdateClub = async (updatedClub) => {
    // Update the club in the list
    setClubs(prevClubs => 
      prevClubs.map(club => 
        club._id === updatedClub._id ? updatedClub : club
      )
    );
    setEditDialogOpen(false);
  };

  const handleFollow = (clubId) => {
    console.log(`Following club ${clubId}`);
    // Implement follow logic if needed
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleBoardFilterChange = (boardId) => {
    setSelectedBoard(boardId);
  };

  const filteredClubs = useMemo(() => {
    return clubs.filter(
      (club) =>
        club.name.toLowerCase().includes(search.toLowerCase()) &&
        (!selectedBoard || club.board_id === selectedBoard)
    );
  }, [clubs, search, selectedBoard]);
  
  // Group clubs by board
  const groupedClubs = useMemo(() => {
    return filteredClubs.reduce((acc, club) => {
      const boardId = club.board_id;
      const boardName = boards[boardId] || "Unknown Board";
      
      if (!acc[boardName]) {
        acc[boardName] = [];
      }
      
      acc[boardName].push(club);
      return acc;
    }, {});
  }, [filteredClubs, boards]);
  
  // Sort board names
  const sortedBoardNames = Object.keys(groupedClubs).sort();

  return (
    <div>
      <Navbar/>
    <Box sx={{ position: "relative", pb: 10 }}>
      {/* Search and Filter Component */}
      <SearchAndFilter 
        onSearchChange={handleSearchChange}
        onBoardFilterChange={handleBoardFilterChange}
        availableBoards={boards}
      />
      
      {sortedBoardNames.map((boardName) => (
        <Box key={boardName} sx={{ mb: 4 }}>
          {/* Board header bar */}
          <Box 
            sx={{ 
              backgroundColor: "#f5f5f5", 
              p: 1.5, 
              borderRadius: "4px 4px 0 0",
              borderBottom: "1px solid #e0e0e0",
              mb: 2
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {boardName}
            </Typography>
          </Box>
          
          {/* Clubs in this board */}
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {groupedClubs[boardName].map((club) => (
              <ClubCard 
                key={club._id}
                club={club} 
                boardName={boardName} 
                onFollow={handleFollow}
                onEdit={handleEdit}
                onDelete={handleDelete} 
              />
            ))}
          </Box>
        </Box>
      ))}
      
      {/* Floating Action Button for creating new club */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setCreateDialogOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)"
        }}
      >
        <AddIcon />
      </Fab>
      
      {/* Create Club Dialog Component */}
      <CreateClubForm
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        boards={boards}
        onSave={handleCreateClub}
      />

      {/* Edit Club Dialog Component */}
      {selectedClub && (
        <CreateClubForm
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          boards={boards}
          onSave={handleUpdateClub}
          initialData={selectedClub}
          isEditMode={true}
        />
      )}
    </Box>
    </div>
  );
};

export default ClubList;