const express = require("express");
const profiles = require("../controllers/profile-controller");
const technologies = require("../controllers/technology-controller");
const projects = require("../controllers/project-controller");
const feedback = require("../controllers/feedback-controller");
const {
  profileInput,
  technologyInput,
  projectInput,
  feedbackInput,
  idParam,
  projectIdParam,
  ratedFeedbackInput,
  projectListQuery,
} = require("../validators/schemas");

const router = express.Router();
router.post("/profiles", profileInput, profiles.create);
router.get("/profiles/:id", idParam, profiles.getById);
router.post("/technologies", technologyInput, technologies.create);
router.get("/technologies", technologies.list);
router.post("/projects", projectInput, projects.create);
router.get("/projects", projectListQuery, projects.list);
router.put("/projects/:id/upvote", idParam, projects.upvote);
router.post(
  "/projects/:id/feedbacks",
  idParam,
  ratedFeedbackInput,
  feedback.createRated,
);
router.get("/projects/:id/feedbacks", idParam, feedback.listRated);
router.post(
  "/projects/:projectId/feedback",
  projectIdParam,
  feedbackInput,
  feedback.create,
);
router.get("/projects/:projectId/feedback", projectIdParam, feedback.list);

module.exports = router;
