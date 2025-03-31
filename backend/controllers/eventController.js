// controllers/eventController.js
const eventService = require("../services/eventService");

class EventController {
  // Event controllers
  async createEvent(req, res) {
    try {
      const event = await eventService.createEvent(req.body);
      res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: event,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllEvents(req, res) {
    try {
      const events = await eventService.getAllEvents(req.query);
      res.status(200).json({
        success: true,
        count: events.length,
        data: events,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getEventById(req, res) {
    try {
      const event = await eventService.getEventById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateEvent(req, res) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: event,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteEvent(req, res) {
    try {
      const event = await eventService.deleteEvent(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Event Coordinator controllers
  async createEventCoordinator(req, res) {
    try {
      const coordinator = await eventService.createEventCoordinator(req.body);
      res.status(201).json({
        success: true,
        message: "Event coordinator created successfully",
        data: coordinator,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllEventCoordinators(req, res) {
    try {
      const coordinators = await eventService.getAllEventCoordinators(
        req.query
      );
      res.status(200).json({
        success: true,
        count: coordinators.length,
        data: coordinators,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCoordinatorsByEventId(req, res) {
    try {
      const coordinators = await eventService.getCoordinatorsByEventId(
        req.params.eventId
      );
      res.status(200).json({
        success: true,
        count: coordinators.length,
        data: coordinators,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateEventCoordinator(req, res) {
    try {
      const coordinator = await eventService.updateEventCoordinator(
        req.params.id,
        req.body
      );

      if (!coordinator) {
        return res.status(404).json({
          success: false,
          message: "Event coordinator not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event coordinator updated successfully",
        data: coordinator,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteEventCoordinator(req, res) {
    try {
      const coordinator = await eventService.deleteEventCoordinator(
        req.params.id
      );

      if (!coordinator) {
        return res.status(404).json({
          success: false,
          message: "Event coordinator not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event coordinator deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Event Type controllers
  async createEventType(req, res) {
    try {
      const eventType = await eventService.createEventType(req.body);
      res.status(201).json({
        success: true,
        message: "Event type created successfully",
        data: eventType,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllEventTypes(req, res) {
    try {
      const eventTypes = await eventService.getAllEventTypes();
      res.status(200).json({
        success: true,
        count: eventTypes.length,
        data: eventTypes,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getEventTypeById(req, res) {
    try {
      const eventType = await eventService.getEventTypeById(req.params.id);

      if (!eventType) {
        return res.status(404).json({
          success: false,
          message: "Event type not found",
        });
      }

      res.status(200).json({
        success: true,
        data: eventType,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateEventType(req, res) {
    try {
      const eventType = await eventService.updateEventType(
        req.params.id,
        req.body
      );

      if (!eventType) {
        return res.status(404).json({
          success: false,
          message: "Event type not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event type updated successfully",
        data: eventType,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteEventType(req, res) {
    try {
      const eventType = await eventService.deleteEventType(req.params.id);

      if (!eventType) {
        return res.status(404).json({
          success: false,
          message: "Event type not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event type deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new EventController();
