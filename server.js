// ============================================================
//  STUDENT CRUD API - Backend
//  Based on our two demos:
//   1 - our Express demo (routes, HTTP methods, express.json)
//   2 - our Mongoose demo (connect, schema, model)
//  Now the routes SAVE to MongoDB instead of an array.
// ============================================================

const express = require("express");
const mongoose = require("mongoose");

// gawan ng server
const app = express();

// middleware - read JSON sent to the request body (same as our Express demo)
app.use(express.json());

// serve the frontend files inside the "public" folder
// this lets http://localhost:3000 open our index.html
app.use(express.static("public"));

// ------------------------------------------------------------
// 1 - CONNECT to MongoDB (same as our Mongoose demo)
// ------------------------------------------------------------
mongoose.connect("mongodb://127.0.0.1:27017/classdemo")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Connection error", err));

// ------------------------------------------------------------
// 2 - SCHEMA and MODEL (same as our Mongoose demo)
// ------------------------------------------------------------
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: String,
  year: Number,
  enrolled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model("Student", studentSchema);

// ------------------------------------------------------------
// ROUTES (same idea as our Express demo, now using MongoDB)
// Each route sends back JSON.
// ------------------------------------------------------------

// GET all students
app.get("/students", async (req, res) => {
  const students = await Student.find();   // Mongoose find, like our demo
  res.json(students);
});

// GET one student by id
app.get("/students/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json(student);
});

// POST - add a new student
app.post("/students", async (req, res) => {
  try {
    const newStudent = new Student({
      name: req.body.name,
      course: req.body.course,
      year: req.body.year,
      enrolled: req.body.enrolled
    });
    const saved = await newStudent.save();   // .save(), like our Mongoose demo
    res.status(201).json(saved);             // 201 = created, like our Express demo
  } catch (err) {
    // this runs when a required field is missing (validation)
    res.status(400).json({ error: err.message });
  }
});

// PUT - update a student by id
app.put("/students/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      course: req.body.course,
      year: req.body.year,
      enrolled: req.body.enrolled
    },
    { new: true }   // return the updated document, not the old one
  );
  res.json(updated);
});

// DELETE - remove a student by id
app.delete("/students/:id", async (req, res) => {
  const deleted = await Student.findByIdAndDelete(req.params.id);
  res.json(deleted);
});

// ------------------------------------------------------------
// server port 3000 (same as our Express demo)
// ------------------------------------------------------------
app.listen(3000, () => {
  console.log("port 3000 is running...");
});
