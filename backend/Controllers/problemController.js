const Problem = require("../Models/Problem");

// GET all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}, 'title difficulty');
    res.json({ problems });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// GET single problem
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE problem
exports.createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      constraints,
      example_cases,
      test_cases,
      input_format,
      output_format,
    } = req.body;
    const problemExists = await Problem.findOne({title});
    if(problemExists)
      return res
        .status(400)
        .json({ message: "Problem with this title already exists", success: false });

    const problem = new Problem({
      title,
      description,
      difficulty,
      constraints,
      example_cases,
      test_cases,
      input_format,
      output_format,
    });
    const savedProblem = await problem.save();
    if (!savedProblem)
      return res
        .status(500)
        .json({ message: "Problem not created", success: false });
    return res
      .status(200)
      .json({
        message: "Problem created successfully",
        success: true,
        problem: savedProblem,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false, err });
  }
};

// UPDATE problem
exports.updateProblem = async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProblem) return res.status(404).json({ message: "Problem not found" });
    res.json(updatedProblem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE problem
exports.deleteProblem = async (req, res) => {
  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
    if (!deletedProblem) return res.status(404).json({ message: "Problem not found" });
    res.json({ message: "Problem deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
