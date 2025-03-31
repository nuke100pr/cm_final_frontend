import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  AccessTime,
  LocationOn,
  People,
  Close,
  FilterAlt,
} from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: "Technical Workshop",
    time: "10:00 AM - 12:00 PM",
    location: "Lab 101",
    type: "workshop",
    day: 15,
    month: 1, // February (0-based)
    year: 2025,
    attendees: 45,
  },
  {
    id: 2,
    title: "Project Meeting",
    time: "2:00 PM - 3:00 PM",
    location: "Meeting Room 2",
    type: "meeting",
    day: 15,
    month: 1, // February
    year: 2025,
    attendees: 12,
  },
  {
    id: 3,
    title: "Cultural Night",
    time: "6:00 PM - 9:00 PM",
    location: "Main Auditorium",
    type: "event",
    day: 18,
    month: 1, // February
    year: 2025,
    attendees: 150,
  },
];

// Event Modal Component
const EventModal = ({ open, onClose, selectedDate, events }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">
          Events for {selectedDate?.month} {selectedDate?.day}, {selectedDate?.year}
        </Typography>
        <IconButton edge="end" onClick={onClose} aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {events.length > 0 ? (
          <Stack spacing={2}>
            {events.map((event) => (
              <Paper
                key={event.id}
                sx={{
                  p: 2,
                  bgcolor: 
                    event.type === "workshop" ? "primary.lighter" : 
                    event.type === "meeting" ? "success.lighter" : 
                    "secondary.lighter"
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium">{event.title}</Typography>
                <Stack spacing={1} mt={1}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{event.time}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{event.location}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <People fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{event.attendees} attendees</Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="text.secondary">No events scheduled for this day</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} fullWidth variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Calendar Component
const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(1); // 0-based (1 = February)
  const [currentYear, setCurrentYear] = useState(2025);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentView, setCurrentView] = useState("month");
  const [events] = useState(mockEvents);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  // Filter states
  const [filters, setFilters] = useState({
    myClubs: true,
    myEvents: true,
    myRegisteredEvents: true
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Calculate actual weeks needed for the month to avoid unnecessary empty rows
  const totalDaysDisplayed = daysInMonth + firstDayOfMonth;
  const weeksNeeded = Math.ceil(totalDaysDisplayed / 7);
  
  const calendarDays = Array.from({ length: weeksNeeded * 7 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    if (day <= 0 || day > daysInMonth) return null;
    return day;
  });

  // Get current day of week (0-6, Sunday is 0)
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  
  // Create array of days for the week view
  const createWeekDays = () => {
    const now = new Date(currentYear, currentMonth, selectedDay);
    const day = now.getDay(); // 0-6, Sunday is 0
    const weekDays = [];
    
    // Calculate the start of the week (Sunday)
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - day);
    
    // Create 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      weekDays.push({
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === currentMonth
      });
    }
    
    return weekDays;
  };

  const weekDays = createWeekDays();

  // Handle filter changes
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked
    });
  };

  // Get events for a specific day
  const getEventsForDay = (day, month = currentMonth, year = currentYear) => {
    return events.filter(
      (event) =>
        event.day === day &&
        event.month === month &&
        event.year === year
    );
  };

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
      setSelectedDate({
        day,
        month: months[currentMonth],
        year: currentYear,
      });
      
      if (currentView === "day") {
        // For day view, update the selected day but don't open modal
        setSelectedDay(day);
      } else {
        // For other views, open the modal with events
        setIsModalOpen(true);
      }
    }
  };

  const handlePrev = () => {
    if (currentView === "month") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (currentView === "week") {
      // Move back one week
      const newDate = new Date(currentYear, currentMonth, selectedDay - 7);
      setSelectedDay(newDate.getDate());
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    } else if (currentView === "day") {
      // Move back one day
      const newDate = new Date(currentYear, currentMonth, selectedDay - 1);
      setSelectedDay(newDate.getDate());
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
  };

  const handleNext = () => {
    if (currentView === "month") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else if (currentView === "week") {
      // Move forward one week
      const newDate = new Date(currentYear, currentMonth, selectedDay + 7);
      setSelectedDay(newDate.getDate());
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    } else if (currentView === "day") {
      // Move forward one day
      const newDate = new Date(currentYear, currentMonth, selectedDay + 1);
      setSelectedDay(newDate.getDate());
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
  };

  const handleViewChange = (_, newView) => {
    if (newView !== null) {
      setCurrentView(newView);
    }
  };

  // Get upcoming events
  const getUpcomingEvents = () => {
    const today = new Date();
    const currentDay = today.getDate();

    return events
      .filter(
        (event) =>
          (event.month === currentMonth &&
            event.year === currentYear &&
            event.day >= currentDay) ||
          (event.month > currentMonth && event.year === currentYear) ||
          event.year > currentYear
      )
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
      })
      .slice(0, 5);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "workshop": return "primary";
      case "meeting": return "success";
      default: return "secondary";
    }
  };

  // Calculate appropriate cell height based on available space and number of weeks
  const calculateDayCellHeight = () => {
    if (currentView === "day") return "auto";
    if (isSmall) return 60;
    if (isMobile) return 70;
    
    // Adjust height based on weeks needed
    return weeksNeeded <= 5 ? 100 : 80;
  };

  const dayCellHeight = calculateDayCellHeight();

  // Get title based on current view
  const getViewTitle = () => {
    if (currentView === "month") {
      return `${months[currentMonth]} ${currentYear}`;
    } else if (currentView === "week") {
      const firstDay = weekDays[0];
      const lastDay = weekDays[6];
      
      if (firstDay.month === lastDay.month) {
        return `${months[firstDay.month]} ${firstDay.day} - ${lastDay.day}, ${firstDay.year}`;
      } else {
        return `${months[firstDay.month]} ${firstDay.day} - ${months[lastDay.month]} ${lastDay.day}, ${firstDay.year}`;
      }
    } else if (currentView === "day") {
      return `${months[currentMonth]} ${selectedDay}, ${currentYear}`;
    }
  };

  const renderMonthView = () => (
    <Grid container spacing={0.5}>
      {calendarDays.map((day, index) => (
        <Grid item xs={12/7} key={index}>
          {day ? (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                height: dayCellHeight,
                p: 0.5,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
                overflow: "hidden",
                bgcolor: day === selectedDay ? "action.selected" : "background.paper"
              }}
              onClick={() => handleDayClick(day)}
            >
              <Typography 
                variant={isSmall ? "caption" : "body2"} 
                fontWeight="medium" 
                mb={0.5}
              >
                {day}
              </Typography>
              <Stack spacing={0.5}>
                {getEventsForDay(day).slice(0, isSmall ? 1 : isMobile ? 2 : 3).map((event) => (
                  <Chip
                    key={event.id}
                    label={isSmall ? "" : event.title}
                    size="small"
                    color={getEventTypeColor(event.type)}
                    variant="outlined"
                    sx={{ 
                      height: "auto", 
                      py: 0.2, 
                      px: isSmall ? 0.5 : 1,
                      maxWidth: "100%",
                      "& .MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        padding: isSmall ? 0 : undefined,
                        fontSize: isSmall ? '0.6rem' : isMobile ? '0.7rem' : '0.75rem'
                      }
                    }}
                    icon={isSmall ? null : <AccessTime fontSize="small" />}
                  />
                ))}
                {getEventsForDay(day).length > (isSmall ? 1 : isMobile ? 2 : 3) && (
                  <Typography variant="caption" color="text.secondary">
                    +{getEventsForDay(day).length - (isSmall ? 1 : isMobile ? 2 : 3)} more
                  </Typography>
                )}
              </Stack>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ 
                height: dayCellHeight, 
                p: 0.5, 
                bgcolor: "action.disabledBackground" 
              }}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );

  const renderWeekView = () => (
    <Grid container spacing={0.5}>
      {weekDays.map((dayInfo, index) => (
        <Grid item xs={12/7} key={index}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              height: isMobile ? 120 : 150,
              p: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              overflow: "hidden",
              bgcolor: dayInfo.day === selectedDay && dayInfo.month === currentMonth 
                ? "action.selected" 
                : dayInfo.isCurrentMonth ? "background.paper" : "action.disabledBackground",
              borderLeft: index === 0 ? 2 : 1,
              borderColor: index === 0 ? "primary.main" : "divider"
            }}
            onClick={() => {
              setSelectedDay(dayInfo.day);
              if (dayInfo.month !== currentMonth) {
                setCurrentMonth(dayInfo.month);
                setCurrentYear(dayInfo.year);
              }
              setIsModalOpen(true);
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography 
                variant="body2" 
                fontWeight={dayInfo.isCurrentMonth ? "medium" : "normal"}
                color={dayInfo.isCurrentMonth ? "text.primary" : "text.secondary"}
              >
                {dayInfo.day}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}
              </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <Stack spacing={1} sx={{ mt: 1 }}>
              {getEventsForDay(dayInfo.day, dayInfo.month, dayInfo.year).map((event) => (
                <Box 
                  key={event.id}
                  sx={{ 
                    p: 0.5,
                    fontSize: "0.75rem",
                    bgcolor: 
                      event.type === "workshop" ? "primary.lighter" : 
                      event.type === "meeting" ? "success.lighter" : 
                      "secondary.lighter",
                    borderRadius: 0.5,
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {event.title}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderDayView = () => {
    const dayEvents = getEventsForDay(selectedDay);
    
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {months[currentMonth]} {selectedDay}, {currentYear}
        </Typography>
        
        {dayEvents.length > 0 ? (
          <Stack spacing={2}>
            {dayEvents.map((event) => (
              <Paper
                key={event.id}
                sx={{
                  p: 2,
                  bgcolor: 
                    event.type === "workshop" ? "primary.lighter" : 
                    event.type === "meeting" ? "success.lighter" : 
                    "secondary.lighter"
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium">{event.title}</Typography>
                <Stack spacing={1} mt={1}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{event.time}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{event.location}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <People fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{event.attendees} attendees</Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="text.secondary">No events scheduled for this day</Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={() => {/* Add event functionality would go here */}}
            >
              Add Event
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const renderCalendarContent = () => {
    switch (currentView) {
      case "week":
        return renderWeekView();
      case "day":
        return renderDayView();
      case "month":
      default:
        return renderMonthView();
    }
  };

  return (
    <Box sx={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      overflow: "hidden" // Prevent outer scrollbar
    }}>
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl" sx={{ py: 2, height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
            
            {/* Filter checkboxes - Replacing the Add Event button */}
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              border: "1px solid", 
              borderColor: "divider", 
              borderRadius: 1, 
              px: 1.5, 
              py: 0.5 
            }}>
              <FilterAlt fontSize="small" color="action" sx={{ mr: 1 }} />
              <FormGroup row sx={{ gap: isMobile ? 0 : 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small" 
                      checked={filters.myClubs} 
                      onChange={handleFilterChange} 
                      name="myClubs" 
                    />
                  }
                  label={<Typography variant="body2">My Clubs</Typography>}
                  sx={{ mr: isMobile ? 0.5 : 1 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={filters.myEvents} 
                      onChange={handleFilterChange} 
                      name="myEvents" 
                    />
                  }
                  label={<Typography variant="body2">My Events</Typography>}
                  sx={{ mr: isMobile ? 0.5 : 1 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={filters.myRegisteredEvents} 
                      onChange={handleFilterChange} 
                      name="myRegisteredEvents" 
                    />
                  }
                  label={<Typography variant="body2">My Registered Events</Typography>}
                />
              </FormGroup>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ height: "calc(100% - 60px)" }}>
            <Grid item xs={12} lg={9} sx={{ height: isMobile ? "auto" : "100%" }}>
              <Card sx={{ 
                height: "100%",
                display: "flex", 
                flexDirection: "column" 
              }}>
                <CardHeader
                  sx={{ py: 1 }}
                  title={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton onClick={handlePrev} size={isMobile ? "small" : "medium"}>
                        <ChevronLeft />
                      </IconButton>
                      <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mx: 1 }}>
                        {getViewTitle()}
                      </Typography>
                      <IconButton onClick={handleNext} size={isMobile ? "small" : "medium"}>
                        <ChevronRight />
                      </IconButton>
                    </Box>
                  }
                  action={
                    <ToggleButtonGroup
                      value={currentView}
                      exclusive
                      onChange={handleViewChange}
                      size="small"
                    >
                      <ToggleButton value="month">Month</ToggleButton>
                      <ToggleButton value="week">Week</ToggleButton>
                      <ToggleButton value="day">Day</ToggleButton>
                    </ToggleButtonGroup>
                  }
                />
                <Divider />
                <CardContent sx={{ 
                  p: 1, 
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column"
                }}>
                  {currentView === "month" && (
                    <Grid container spacing={0.5} sx={{ mb: 1 }}>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <Grid item xs={12 / 7} key={day}>
                          <Typography 
                            align="center" 
                            variant={isSmall ? "caption" : "body2"}
                            color="text.secondary"
                          >
                            {isSmall ? day.charAt(0) : day}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    {renderCalendarContent()}
                  </Box>
                </CardContent>
                {currentView !== "day" && (
                  <>
                    <Divider />
                    <Box sx={{ p: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: "primary.light" }} />
                        <Typography variant="caption" color="text.secondary">Workshop</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: "success.light" }} />
                        <Typography variant="caption" color="text.secondary">Meeting</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: "secondary.light" }} />
                        <Typography variant="caption" color="text.secondary">Event</Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Card>
            </Grid>
            
            <Grid item xs={12} lg={3} sx={{ height: isMobile ? "auto" : "100%" }}>
              <Card sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column" 
              }}>
                <CardHeader 
                  title="Upcoming Events" 
                  titleTypographyProps={{ variant: isMobile ? "subtitle1" : "h6" }} 
                  sx={{ py: 1 }} 
                />
                <Divider />
                <CardContent sx={{ 
                  p: 1, 
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto" 
                }}>
                  <Stack spacing={1.5}>
                    {getUpcomingEvents().map((event) => (
                      <Box key={event.id} sx={{ display: "flex", gap: 1 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            width: 35, 
                            height: 35, 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            bgcolor: "primary.lighter",
                            color: "primary.main",
                            fontWeight: "bold",
                            fontSize: "0.875rem"
                          }}
                        >
                          {event.day}
                        </Paper>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" noWrap>{event.title}</Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {event.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {event.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <EventModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        events={selectedDate ? getEventsForDay(selectedDate.day) : []}
      />
    </Box>
  );
};

export default CalendarView;