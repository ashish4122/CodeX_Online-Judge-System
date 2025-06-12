const express = require("express");
const router = express.Router();
const problemController = require("../Controllers/problemController");

// RESTful API routes
router.get("/", problemController.getAllProblems);
router.get("/:id", problemController.getProblemById);
router.post("/", problemController.createProblem);
router.put("/:id", problemController.updateProblem);
router.delete("/:id", problemController.deleteProblem);

module.exports = router;
