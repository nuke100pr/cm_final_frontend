const messageService = require('../services/messageService');

module.exports = {
  async getMessages(req, res) {
    try {
      const { forumId } = req.params;
      const { page, limit } = req.query;
      
      const result = await messageService.getMessages(forumId, parseInt(page), parseInt(limit));
      
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  async createMessage(req, res) {
    try {
      const messageData = req.body;
      const files = req.files;
      
      const newMessage = await messageService.createMessage(messageData, files);

      
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  async updatePollVote(req, res) {
    try {
      const { messageId } = req.params;
      const { userId, optionIndex, voteType } = req.body;
      
      const updatedMessage = await messageService.updatePollVote(messageId, userId, optionIndex, voteType);
      
      res.status(200).json(updatedMessage);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const { userId } = req.body;
      
      const result = await messageService.deleteMessage(messageId, userId);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getReplies(req, res) {
    try {
      const { messageId } = req.params;
      const { page, limit } = req.query;
      
      const replies = await messageService.getReplies(messageId, parseInt(page), parseInt(limit));
      
      res.status(200).json(replies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  async createReply(req, res) {
    try {
      const { messageId } = req.params;
      const replyData = req.body;
      const files = req.files;
      
      console.log("dvlanjdnvanvalnvdnd");
      const newReply = await messageService.addDirectReply(messageId, replyData, files);
      
      res.status(201).json({
        success: true,
        message: "Reply added successfully",
        data: newReply
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Failed to add reply" 
      });
    }
  }
};