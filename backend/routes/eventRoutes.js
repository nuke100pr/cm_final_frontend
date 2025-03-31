// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Event routes
router.post("/events", eventController.createEvent);
router.get("/events", eventController.getAllEvents);
router.get("/events/:id", eventController.getEventById);
router.put("/events/:id", eventController.updateEvent);
router.delete("/events/:id", eventController.deleteEvent);

// Event Coordinator routes
router.post("/coordinators", eventController.createEventCoordinator);
router.get("/coordinators", eventController.getAllEventCoordinators);
router.get(
  "/events/:eventId/coordinators",
  eventController.getCoordinatorsByEventId
);
router.put("/coordinators/:id", eventController.updateEventCoordinator);
router.delete("/coordinators/:id", eventController.deleteEventCoordinator);

// Event Type routes
router.post("/types", eventController.createEventType);
router.get("/types", eventController.getAllEventTypes);
router.get("/types/:id", eventController.getEventTypeById);
router.put("/types/:id", eventController.updateEventType);
router.delete("/types/:id", eventController.deleteEventType);

module.exports = router;
