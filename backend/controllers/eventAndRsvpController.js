const {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    getAllEvents,
    addEventCoordinator,
    getEventCoordinators,
    removeEventCoordinator,
    createEventType,
    getAllEventTypes,
    updateEventType,
    deleteEventType,
    createRSVP,
    getRSVPsForEvent,
    getUserRSVPs,
    deleteRSVP
  } = require('../services/eventAndRsvpService');

  const RSVP = require("../models/RSVP");
  
  // Event Controllers
  const createEventController = async (req, res) => {
    try {
      const eventData = req.body;
      const imageFile = req.file; // Assuming you're using multer for file uploads
      console.log(imageFile);
      const newEvent = await createEvent(eventData, imageFile);
      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: newEvent
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const getEventByIdController = async (req, res) => {
    try {
      const event = await getEventById(req.params.id);
      res.status(200).json({
        success: true,
        data: event
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const updateEventController = async (req, res) => {
    try {
      const eventId = req.params.id;
      const updateData = req.body;
      const imageFile = req.file; // Get the uploaded file from multer
  
      const updatedEvent = await updateEvent(eventId, updateData, imageFile);
      
      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: updatedEvent
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const deleteEventController = async (req, res) => {
    try {
      await deleteEvent(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const getAllEventsController = async (req, res) => {
    try {
      const events = await getAllEvents(req.query);
      res.status(200).json({
        success: true,
        count: events.length,
        data: events
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Event Coordinators Controllers
  const addEventCoordinatorController = async (req, res) => {
    try {
      const newCoordinator = await addEventCoordinator(
        req.params.eventId,
        req.body.userId
      );
      res.status(201).json({
        success: true,
        message: 'Coordinator added successfully',
        data: newCoordinator
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const getEventCoordinatorsController = async (req, res) => {
    try {
      const coordinators = await getEventCoordinators(req.params.eventId);
      res.status(200).json({
        success: true,
        count: coordinators.length,
        data: coordinators
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const removeEventCoordinatorController = async (req, res) => {
    try {
      await removeEventCoordinator(
        req.params.eventId,
        req.params.userId
      );
      res.status(200).json({
        success: true,
        message: 'Coordinator removed successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Event Type Controllers
  const createEventTypeController = async (req, res) => {
    try {
      const newEventType = await createEventType(req.body.content);
      res.status(201).json({
        success: true,
        message: 'Event type created successfully',
        data: newEventType
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const getAllEventTypesController = async (req, res) => {
    try {
      const eventTypes = await getAllEventTypes();
      res.status(200).json({
        success: true,
        count: eventTypes.length,
        data: eventTypes
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const updateEventTypeController = async (req, res) => {
    try {
      const updatedEventType = await updateEventType(
        req.params.id,
        req.body.content
      );
      res.status(200).json({
        success: true,
        message: 'Event type updated successfully',
        data: updatedEventType
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const deleteEventTypeController = async (req, res) => {
    try {
      await deleteEventType(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Event type deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // RSVP Controllers
  const createRSVPController = async (req, res) => {
    try {
      const newRSVP = await createRSVP(
        req.body.event_id,
        req.body.user_id // Assuming you have user info in req.user
      );
      res.status(201).json({
        success: true,
        message: 'RSVP created successfully',
        data: newRSVP
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const getRSVPsForEventController = async (req, res) => {
    try {
      const rsvps = await getRSVPsForEvent(req.params.eventId);
      res.status(200).json({
        success: true,
        count: rsvps.length,
        data: rsvps
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const getUserRSVPsController = async (req, res) => {
    try {
      const rsvps = await getUserRSVPs(req.params.userId);
      res.status(200).json({
        success: true,
        count: rsvps.length,
        data: rsvps
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const deleteRSVPController = async (req, res) => {
    try {
      await deleteRSVP(req.params.id);
      res.status(200).json({
        success: true,
        message: 'RSVP deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  const getAllEventsPaneDataController = async (req, res) => {
    try {
      // Get all data in parallel for better performance
      const [events, eventTypes, allRsvps] = await Promise.all([
        getAllEvents(req.query),
        getAllEventTypes(),
        RSVP.find().populate('event_id').populate('user_id') // Directly using the model for simplicity
      ]);
  
      // Structure the response
      const response = {
        success: true,
        data: {
          events: events,
          eventTypes: eventTypes,
          rsvps: allRsvps
        },
        counts: {
          events: events.length,
          eventTypes: eventTypes.length,
          rsvps: allRsvps.length
        }
      };
  
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  module.exports = {
    createEventController,
    getEventByIdController,
    updateEventController,
    deleteEventController,
    getAllEventsController,
    addEventCoordinatorController,
    getEventCoordinatorsController,
    removeEventCoordinatorController,
    createEventTypeController,
    getAllEventTypesController,
    updateEventTypeController,
    deleteEventTypeController,
    createRSVPController,
    getRSVPsForEventController,
    getUserRSVPsController,
    deleteRSVPController,
    getAllEventsPaneDataController
  };