"use client";
import { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  RadioGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  LinearProgress,
  Box,
  Divider,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  Collapse,
  AppBar,
  Toolbar,
  Badge,
} from "@mui/material";
import {
  Send,
  AttachFile,
  Mic,
  PictureAsPdf,
  Description,
  PollOutlined,
  Close,
  DownloadOutlined,
  ReplyOutlined,
  MoreVert,
  ExpandMore,
  ExpandLess,
  Image,
  VideoFile,
  AudioFile,
  People,
  ChevronRight,
} from "@mui/icons-material";

import img1 from "../../../public/background.jpg";

const API_URL = "http://localhost:5000/uploads";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [organizedMessages, setOrganizedMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [audio, setAudio] = useState(null);
  const [pollDialogOpen, setPollDialogOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollType, setPollType] = useState("single");
  const [isSending, setIsSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const [forumName, setForumName] = useState("Project Discussion");
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  const endOfMessagesRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Fetch messages from the backend
  const fetchMessages = async (forumId, page = 1, limit = 1000) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${forumId}?page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();

      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch replies for a specific message
  const fetchReplies = async (messageId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}/replies`
      );
      if (!response.ok) throw new Error("Failed to fetch replies");
      const data = await response.json();
      return data.replies;
    } catch (error) {
      console.error("Error fetching replies:", error);
      return [];
    }
  };

  // Organize messages - group replies with parent messages
  useEffect(() => {
    const organizeMessages = async () => {
      setOrganizedMessages(messages);

      // Automatically expand replies for messages with replies
      const expandedState = {};
      messages.forEach((msg) => {
        if (msg.replies && msg.replies.length > 0) {
          expandedState[msg.id] = true;
        }
      });
      setExpandedReplies(expandedState);
    };

    organizeMessages();
  }, [messages]);

  // Send message to the backend
  const sendMessage = async () => {
    if (!input.trim() && !file && !audio) return;

    setIsSending(true);

    const formData = new FormData();
    formData.append("forum_id", "67d82170e5cfbbf1ee400414"); // Replace with actual forum ID
    formData.append("user_id", "67d824cfe5cfbbf1ee400416"); // Replace with actual user ID
    formData.append("text", input);
    if (file) formData.append("file", file);
    if (audio) formData.append("audio", audio);

    try {
      let response;
      let endpoint;

      if (replyingTo) {
        endpoint = `http://localhost:5000/api/messages/${replyingTo}/replies`;
      } else {
        endpoint = "http://localhost:5000/api/messages";
      }

      response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to send message");
      const newMessage = await response.json();

      // Update the messages array and reorganize
      if (replyingTo) {
        // If it's a reply, we need to update the parent message's replies
        setMessages((prevMessages) => {
          // Make a deep copy of the messages array
          const updatedMessages = [...prevMessages];

          // Find the parent message
          const parentIndex = updatedMessages.findIndex(
            (msg) => msg.id === replyingTo
          );

          if (parentIndex >= 0) {
            // Create replies array if it doesn't exist
            if (!updatedMessages[parentIndex].replies) {
              updatedMessages[parentIndex].replies = [];
            }

            // Add the new reply to the parent's replies array
            updatedMessages[parentIndex].replies.push(newMessage);

            // Return the updated messages array
            return updatedMessages;
          }

          // If parent not found, just return the original array
          return prevMessages;
        });
      } else {
        // If it's a new thread message, simply add it to the messages array
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }

      // Reset input fields
      setInput("");
      setFile(null);
      setAudio(null);
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Create poll
  const createPoll = async () => {
    if (
      !pollQuestion.trim() ||
      pollOptions.filter((opt) => opt.trim()).length < 2
    )
      return;

    setIsSending(true);

    const pollData = {
      forum_id: "67d82170e5cfbbf1ee400414", // Replace with actual forum ID
      user_id: "67d824cfe5cfbbf1ee400416", // Replace with actual user ID
      type: "poll",
      text: pollQuestion,
      poll: {
        question: pollQuestion,
        options: pollOptions.filter((opt) => opt.trim()),
        type: pollType,
      },
      parent_id: replyingTo || null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });
      if (!response.ok) throw new Error("Failed to create poll");
      const newPoll = await response.json();

      // Update messages the same way as regular messages
      if (replyingTo) {
        // If it's a reply poll
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const parentIndex = updatedMessages.findIndex(
            (msg) => msg.id === replyingTo
          );
          if (parentIndex >= 0) {
            if (!updatedMessages[parentIndex].replies) {
              updatedMessages[parentIndex].replies = [];
            }
            updatedMessages[parentIndex].replies.push(newPoll);
          }
          return [...updatedMessages, newPoll];
        });
      } else {
        setMessages((prevMessages) => [...prevMessages, newPoll]);
      }

      setPollDialogOpen(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setPollType("single");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Update poll vote
  const handleVote = async (
    messageId,
    optionIndex,
    isReply = false,
    parentMessageId = null
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}/poll`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageId: messageId, // Make sure these match
            userId: "67d824cfe5cfbbf1ee400416", // Replace with actual user ID
            optionIndex,
            voteType: "single", // or 'multi' based on poll type
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update poll vote");
      const updatedMessage = await response.json();

      const updatedMessages = messages.map((message) => {
        if (message._id === updatedMessage._id) {
          return updatedMessage;
        }
        return message;
      });

      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error updating poll vote:", error);
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete message");
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages("67d82170e5cfbbf1ee400414"); // Replace with actual forum ID
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [organizedMessages]);

  // Helper functions
  const downloadFile = (fileUrl, filename) => {
    // Create anchor element and trigger download
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderFileContent = (fileData) => {
    // Check if we have the necessary file information
    if (!fileData) return null;

    console.log(fileData);

    // Extract file info - API could return different structures
    const fileUrl = `${API_URL}/files/${fileData.filename}`;
    const fileName = fileData.filename;
    const fileType = fileData.mimetype;

    console.log(fileType);

    // Default icon is Document
    let FileIcon = Description;
    let iconColor = "primary";

    // Determine file type and appropriate icon
    if (fileType) {
      if (fileType.startsWith("image")) {
        FileIcon = Image;
        iconColor = "success";
      } else if (fileType.startsWith("video")) {
        FileIcon = VideoFile;
        iconColor = "info";
      } else if (fileType.startsWith("audio")) {
        FileIcon = AudioFile;
        iconColor = "secondary";
      } else if (fileType === "application/pdf") {
        FileIcon = PictureAsPdf;
        iconColor = "error";
      }
    }

    return (
      <Box sx={{ my: 1 }}>
        {fileType && fileType.startsWith("image") && fileUrl ? (
          <Box sx={{ position: "relative", width: "fit-content" }}>
            <Box
              component="img"
              src={fileUrl}
              alt={fileName}
              sx={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: 1,
                display: "block",
              }}
            />
            <Tooltip title="Download">
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
                onClick={() => downloadFile(fileUrl, fileName)}
              >
                <DownloadOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : fileType && fileType.startsWith("video") && fileUrl ? (
          <Box sx={{ position: "relative", width: "fit-content" }}>
            <video
              controls
              src={fileUrl}
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "4px",
              }}
            />
            <Tooltip title="Download">
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
                onClick={() => downloadFile(fileUrl, fileName)}
              >
                <DownloadOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : fileType && fileType.startsWith("audio") && fileUrl ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <audio controls>
              <source src={fileUrl} type={fileType} />
              Your browser does not support the audio element.
            </audio>
            <Button
              size="small"
              startIcon={<DownloadOutlined />}
              variant="outlined"
              onClick={() => downloadFile(fileUrl, fileName)}
            >
              Download
            </Button>
          </Box>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FileIcon color={iconColor} fontSize="large" sx={{ mr: 2 }} />
              <Typography variant="body1" noWrap sx={{ maxWidth: "200px" }}>
                {fileName}
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<DownloadOutlined />}
              variant="outlined"
              onClick={() => downloadFile(fileUrl, fileName)}
            >
              Download
            </Button>
          </Paper>
        )}
      </Box>
    );
  };

  const renderFilePreview = (file) => {
    if (!file) return null;

    const fileURL = URL.createObjectURL(file);
    const fileType = file.type;
    const fileName = file.name;

    // Use the same rendering logic for consistency
    return renderFileContent({
      url: fileURL,
      name: fileName,
      type: fileType,
    });
  };

  const renderPoll = (
    poll,
    messageId,
    isReply = false,
    parentMessageId = null
  ) => {
    // Check if poll data exists
    if (!poll) return null;

    // Destructure with consistent property names
    const { question, options, type, totalVotes = 0, userVotes = [] } = poll;

    // Ensure options is an array and each option has the expected structure
    const pollOptions = Array.isArray(options) ? options : [];

    return (
      <Paper variant="outlined" sx={{ p: 2, my: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {question}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          {type === "single" ? "Single choice poll" : "Multiple choice poll"} •{" "}
          {totalVotes} votes
        </Typography>

        <FormControl component="fieldset" fullWidth>
          {type === "single" ? (
            <RadioGroup>
              {pollOptions.map((option, optIndex) => {
                // Safely access votes property with a fallback
                const voteCount = option.votes || 0;
                const percentage =
                  totalVotes > 0
                    ? Math.round((voteCount / totalVotes) * 100)
                    : 0;

                console.log(userVotes);
                const isSelected = userVotes.some(
                  (vote) => vote.optionIndex === optIndex
                );

                return (
                  <Box key={optIndex} sx={{ mb: 1 }}>
                    <FormControlLabel
                      control={<Radio checked={isSelected} />}
                      label={option.text}
                      onChange={() =>
                        handleVote(
                          messageId,
                          optIndex,
                          isReply,
                          parentMessageId
                        )
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center", mt: -1 }}>
                      <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 8,
                            borderRadius: 1,
                            backgroundColor: "rgba(124, 124, 124, 0.1)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: isSelected
                                ? "primary.main"
                                : "blue.500",
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {percentage}%
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </RadioGroup>
          ) : (
            <FormGroup>
              {pollOptions.map((option, optIndex) => {
                // Safely access votes property with a fallback
                const voteCount = option.votes || 0;
                const percentage =
                  totalVotes > 0
                    ? Math.round((voteCount / totalVotes) * 100)
                    : 0;

                const isSelected = userVotes.some(
                  (vote) => vote.optionIndex === optIndex
                );

                return (
                  <Box key={optIndex} sx={{ mb: 1 }}>
                    <FormControlLabel
                      control={<Checkbox checked={isSelected} />}
                      label={option.text}
                      onChange={() =>
                        handleVote(
                          messageId,
                          optIndex,
                          isReply,
                          parentMessageId
                        )
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center", mt: -1 }}>
                      <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 8,
                            borderRadius: 1,
                            backgroundColor: "rgba(124, 124, 124, 0.1)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: isSelected
                                ? "primary.main"
                                : "blue.500",
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {percentage}%
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </FormGroup>
          )}
        </FormControl>
      </Paper>
    );
  };

  // UI event handlers
  const handleFileChange = (event) => setFile(event.target.files[0]);
  const handleAudioChange = (event) => setAudio(event.target.files[0]);
  const clearAttachment = () => {
    setFile(null);
    setAudio(null);
  };
  const cancelReply = () => setReplyingTo(null);

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => setPollOptions([...pollOptions, ""]);

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  const toggleReplies = (messageId) => {
    setExpandedReplies((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  const handleMessageMenu = (event, index) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMessageIndex(index);
  };

  const closeMessageMenu = () => {
    setMenuAnchorEl(null);
    setSelectedMessageIndex(null);
  };

  const handleReply = () => {
    if (selectedMessageIndex !== null) {
      setReplyingTo(organizedMessages[selectedMessageIndex]._id);

      console.log(organizedMessages);

      organizedMessages.forEach((msg, index) => {
        console.log(msg);
        console.log(`Message ${index + 1}:`);
        console.log(`Text: ${msg.text}`);
        console.log(`Type: ${msg.replies.size}`);
        console.log(`Timestamp: ${msg.created_at}`);
        if (msg.file) {
          console.log(`File: ${msg.file.name || msg.file.url}`);
        }
        if (msg.audio) {
          console.log(`Audio: ${msg.audio.name || msg.audio.url}`);
        }
        if (msg.poll) {
          console.log(`Poll Question: ${msg.poll.question}`);
          console.log(`Poll Options: ${msg.poll.options.join(", ")}`);
        }
        if (msg.replies && msg.replies.length > 0) {
          console.log(`Replies:`);
          msg.replies.forEach((reply, replyIndex) => {
            console.log(`  Reply ${replyIndex + 1}: ${reply.text}`);
          });
        }
        console.log("-----------------------------");
      });
      closeMessageMenu();
      setTimeout(() => document.getElementById("message-input").focus(), 100);
    }
  };

  const getReplyingToMessage = () => {
    if (replyingTo === null) return null;
    return messages.find((msg) => msg.id === replyingTo);
  };

  // Fixed date formatting function
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    try {
      // Ensure timestamp is properly formatted for Date constructor
      const date = new Date(timestamp);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      // Format date with options
      return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date error";
    }
  };

  // Members dialog content
  const membersList = [
    { id: 1, name: "John Doe", avatar: "J", role: "Admin", online: true },
    { id: 2, name: "Jane Smith", avatar: "J", role: "Member", online: true },
    { id: 3, name: "Mike Johnson", avatar: "M", role: "Member", online: false },
    { id: 4, name: "Sara Wilson", avatar: "S", role: "Member", online: true },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "100vw", // Increased from sm to md for wider chat panel
        mx: "auto",
        width: "100%",
      }}
    >
      {/* Forum header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button
            onClick={() => setMemberDialogOpen(true)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              textTransform: "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {forumName}
              </Typography>

              <Badge
                badgeContent={membersList.filter((m) => m.online).length}
                color="success"
                sx={{ ml: 1 }}
              >
                <People />
              </Badge>
            </Box>

            <ChevronRight />
          </Button>
        </Toolbar>
      </AppBar>

      {/* Messages container with flex-grow */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 2,
          backgroundImage: img1,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <List>
          {organizedMessages.map((msg, index) => (
            <Box key={msg._id || index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  position: "relative",
                  "&:hover .message-actions": { opacity: 1 },
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    {msg.username
                      ? msg.username[0]
                      : index % 2 === 0
                      ? "U"
                      : "A"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography component="span">{msg.text}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(msg.timestamp)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      {/* Render different content types */}
                      {msg.type === "poll"
                        ? renderPoll(msg.poll, msg._id)
                        : msg.file
                        ? renderFileContent(msg.file)
                        : msg.fileUrl
                        ? renderFileContent({
                            url: msg.fileUrl,
                            name: msg.fileName,
                            type: msg.fileType,
                          })
                        : msg.audio
                        ? renderFileContent({
                            url: msg.audio,
                            name: "Audio message",
                            type: "audio/mpeg",
                          })
                        : null}

                      {/* Always show replies if available */}
                      {msg.replies && msg.replies.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            startIcon={
                              expandedReplies[msg.id] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            }
                            onClick={() => toggleReplies(msg.id)}
                          >
                            {msg.replies.length}{" "}
                            {msg.replies.length === 1 ? "reply" : "replies"}
                          </Button>

                          <Collapse in={expandedReplies[msg.id] || false}>
                            <List disablePadding>
                              {msg.replies.map((reply, replyIndex) => (
                                <ListItem
                                  key={reply.id || `reply-${replyIndex}`}
                                  alignItems="flex-start"
                                  sx={{
                                    pl: 2,
                                    mt: 1,
                                    borderLeft: "2px solid #eee",
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar>
                                      {reply.username
                                        ? reply.username[0]
                                        : (index + replyIndex + 1) % 2 === 0
                                        ? "U"
                                        : "A"}
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <Typography component="span">
                                          {reply.text}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {formatTimestamp(reply.timestamp)}
                                        </Typography>
                                      </Box>
                                    }
                                    secondary={
                                      reply.type === "poll"
                                        ? renderPoll(
                                            reply.poll,
                                            reply.id,
                                            true,
                                            msg.id
                                          )
                                        : reply.file
                                        ? renderFileContent(reply.file)
                                        : reply.fileUrl
                                        ? renderFileContent({
                                            url: reply.fileUrl,
                                            name: reply.fileName,
                                            type: reply.fileType,
                                          })
                                        : reply.audio
                                        ? renderFileContent({
                                            url: reply.audio,
                                            name: "Audio reply",
                                            type: "audio/mpeg",
                                          })
                                        : null
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Collapse>
                        </Box>
                      )}
                    </>
                  }
                />

                {/* Message action buttons */}
                <Box
                  className="message-actions"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    opacity: 0,
                    transition: "opacity 0.2s",
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 1,
                    display: "flex",
                  }}
                >
                  <Tooltip title="Reply">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setReplyingTo(msg.id);
                        document.getElementById("message-input").focus();
                      }}
                    >
                      <ReplyOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="More options">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMessageMenu(e, index)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
              {index < organizedMessages.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </Box>
          ))}
          <div ref={endOfMessagesRef} />
        </List>
      </Box>

      {/* Fixed bottom message input area */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Replying to indicator */}
        {replyingTo !== null && getReplyingToMessage() && (
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "action.hover",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}
            >
              <ReplyOutlined
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" noWrap>
                Replying to: {getReplyingToMessage().text}
              </Typography>
            </Box>
            <IconButton size="small" onClick={cancelReply}>
              <Close fontSize="small" />
            </IconButton>
          </Paper>
        )}

        {/* File/Audio Preview before sending */}
        {(file || audio) && (
          <Paper variant="outlined" sx={{ p: 2, mb: 2, position: "relative" }}>
            <IconButton
              size="small"
              sx={{ position: "absolute", top: 4, right: 4 }}
              onClick={clearAttachment}
            >
              <Close fontSize="small" />
            </IconButton>

            <Typography variant="subtitle2" gutterBottom>
              Preview attachment:
            </Typography>
            {file && renderFilePreview(file)}
            {audio && renderFilePreview(audio)}
          </Paper>
        )}

        <TextField
          id="message-input"
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isSending) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={isSending}
        />

        <Box sx={{ display: "flex", mt: 1, justifyContent: "space-between" }}>
          <Box>
            <input
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              style={{ display: "none" }}
              id="file-upload"
              onChange={handleFileChange}
              disabled={isSending}
            />
            <label htmlFor="file-upload">
              <IconButton component="span" disabled={isSending}>
                <AttachFile />
              </IconButton>
            </label>

            <input
              type="file"
              accept="audio/*"
              style={{ display: "none" }}
              id="audio-upload"
              onChange={handleAudioChange}
              disabled={isSending}
            />
            <label htmlFor="audio-upload">
              <IconButton component="span" disabled={isSending}>
                <Mic />
              </IconButton>
            </label>

            <IconButton
              onClick={() => setPollDialogOpen(true)}
              disabled={isSending}
            >
              <PollOutlined />
            </IconButton>
          </Box>

          <IconButton
            onClick={sendMessage}
            color="primary"
            disabled={isSending}
          >
            {isSending ? <CircularProgress size={24} /> : <Send />}
          </IconButton>
        </Box>
      </Box>

      {/* Message menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={closeMessageMenu}
      >
        <MenuItem onClick={handleReply}>
          <ReplyOutlined fontSize="small" sx={{ mr: 1 }} />
          Reply
        </MenuItem>
      </Menu>

      {/* Poll Creation Dialog */}
      <Dialog
        open={pollDialogOpen}
        onClose={() => !isSending && setPollDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {replyingTo !== null ? "Reply with a Poll" : "Create a Poll"}
        </DialogTitle>
        <DialogContent>
          {replyingTo !== null && getReplyingToMessage() && (
            <Paper
              variant="outlined"
              sx={{ p: 1, mb: 2, bgcolor: "action.hover" }}
            >
              <Typography variant="body2" color="text.secondary">
                Replying to: {getReplyingToMessage().text}
              </Typography>
            </Paper>
          )}

          <TextField
            fullWidth
            label="Question"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            margin="normal"
            disabled={isSending}
          />

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Poll Type</FormLabel>
            <RadioGroup
              row
              value={pollType}
              onChange={(e) => setPollType(e.target.value)}
            >
              <FormControlLabel
                value="single"
                control={<Radio disabled={isSending} />}
                label="Single Choice"
              />
              <FormControlLabel
                value="multi"
                control={<Radio disabled={isSending} />}
                label="Multiple Choice"
              />
            </RadioGroup>
          </FormControl>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Options
          </Typography>

          {pollOptions.map((option, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
            >
              <TextField
                fullWidth
                value={option}
                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                disabled={isSending}
              />
              {pollOptions.length > 2 && (
                <IconButton
                  size="small"
                  onClick={() => removePollOption(index)}
                  disabled={isSending}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            variant="outlined"
            onClick={addPollOption}
            disabled={isSending}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPollDialogOpen(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={createPoll}
            color="primary"
            disabled={isSending || !pollQuestion.trim()}
          >
            {isSending ? <CircularProgress size={24} /> : "Create Poll"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Members Dialog */}
      <Dialog
        open={memberDialogOpen}
        onClose={() => setMemberDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{forumName} Members</Typography>
            <Badge
              badgeContent={membersList.filter((m) => m.online).length}
              color="success"
            >
              <Typography variant="body2">Online</Typography>
            </Badge>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List sx={{ width: "100%" }}>
            {membersList.map((member) => (
              <ListItem key={member.id} sx={{ borderBottom: "1px solid #eee" }}>
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color={member.online ? "success" : "default"}
                  >
                    <Avatar>{member.avatar}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={member.name} secondary={member.role} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
