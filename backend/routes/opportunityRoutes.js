const express = require("express");
const router = express.Router();
const opportunityController = require("../controllers/opportunityController");
const multer = require('multer');

const upload = multer({
storage: multer.memoryStorage(),
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Opportunity Routes
router.post("/",upload.single('image'), opportunityController.createOpportunity);
router.get("/", opportunityController.getAllOpportunities);
router.get("/:id", opportunityController.getOpportunityById);
router.put("/:id",upload.single('image'), opportunityController.updateOpportunity);
router.delete("/:id", opportunityController.deleteOpportunity);

// Application Routes
router.post(
  "/:opportunityId/applications",
  opportunityController.createApplication
);
router.get(
  "/:opportunityId/applications",
  opportunityController.getApplicationsByOpportunity
);
router.get("/applications/:id", opportunityController.getApplicationById);
router.put("/applications/:id", opportunityController.updateApplication);
router.delete("/applications/:id", opportunityController.deleteApplication);

// User Applications Route
router.get("/user/applications", opportunityController.getUserApplications);

module.exports = router;
