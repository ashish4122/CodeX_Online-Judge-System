const generateFile = require("../compiler/generateFile");
const generateInputFile = require("../compiler/generateInputFile");
const executeCode = require("../compiler/execute");
const Problem = require("../Models/Problem");
const fs = require("fs");

const runCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const results = [];
    const filePath = await generateFile(language, code);

    for( const example of problem.example_cases){
      const inputPath = await generateInputFile(example.input);

      try {
        const output = await executeCode({ filePath, inputPath });

        results.push({
          input: example.input,
          expected: example.output,
          output: output.trim(),
          passed: output.trim() === example.output.trim(),
        });
      } catch (err) {
        console.error("Execution error:", err);
        results.push({
          input: example.input,
          expected: example.output,
          output:
            err?.stderr?.toString() ||
            err?.error?.toString() ||
            "Execution failed",
          passed: false,
          error: true,
        });
      }
    }
    const passedAll = results.every((r) => r.passed && !r.error);

    return res
      .status(201)
      .json({ passedAll, results, success: true });
  } catch (error) {
    console.error("Error running problem:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const submitCode = async (req, res) => {
  const { id } = req.params;
  const { code, language } = req.body;

  try {
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const results = [];
    const filePath = await generateFile(language, code);

    for (const testCase of problem.test_cases) {
      const inputPath = await generateInputFile(testCase.input);

      try {
        const result = await executeCode({ filePath, inputPath });

        results.push({
          input: testCase.input,
          expected: testCase.output,
          output: result.trim(),
          passed: result.trim() === testCase.output.trim(),
        });
      } catch (err) {
        console.error("Execution error:", err);

        results.push({
          input: testCase.input,
          expected: testCase.output,
          output:
            err?.stderr?.toString() ||
            err?.error?.toString() ||
            "Execution failed",
          passed: false,
          error: true,
        });
      }
    }

    const passedAll = results.every((r) => r.passed && !r.error);
    res.json({ passedAll, results , success: true });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message , success: false });
  }
};

const runCustomInput = async (req, res) => {
  const { code, language, input } = req.body;
  if (!code || !language || !input) {
    return res.status(400).json({ error: "Code, language, and input are required" });
  }
  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);

    const output = await executeCode({ filePath, inputPath });

    return res.status(201).json({
      success: true,
      output: output.trim(),
    });
  } catch (error) {
    console.error("Error running custom input:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  runCode,
  submitCode,
  runCustomInput
};
