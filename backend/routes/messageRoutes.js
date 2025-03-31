const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/:forumId", messageController.getMessages);
router.post(
  "/",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  messageController.createMessage
);
router.put("/:messageId/poll", messageController.updatePollVote);
router.delete("/:messageId", messageController.deleteMessage);

router.get("/:messageId/replies", messageController.getReplies);
router.post(
  "/:messageId/replies",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  messageController.createReply
);

module.exports = router;
