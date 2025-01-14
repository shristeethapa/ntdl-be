// const express = require('express')
import express from "express";
import path from "path";
import fs from "fs-extra";
import mongoose from "mongoose";
import { type } from "os";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//allow cors
app.use(cors());
// middleware to populate req.body
app.use(express.json());

// RESTFul APIS
// tasks

// endpoint : localhost:5000/api/v1/tasks

// CRUD
// CREATE a task
// POST

mongoose.connect(process.env.MONGO_URL);

const taskSchema = new mongoose.Schema({
  task: String,
  hr: Number,
  type: String,
});

const Task = mongoose.model("task", taskSchema);

app.get("/home", (req, res) => {
  res.send("Welcome to the Home Page!");
});

app.post("/api/v1/tasks", async (request, response) => {
  console.log("CREATE TASK APIS");
  console.log(request);
  const task = request.body;

  // const data = await fs.readFile("./data/tasks.json", "utf8");
  // const taskData = JSON.parse(data);
  // console.log(taskData);
  // task.id = taskData[taskData.length - 1]?.id ?? 0 + 1;
  // taskData.push(task);

  // await fs.writeFile("./data/tasks.json", JSON.stringify(taskData));

  //to write in the data base

  const taskDataToDb = new Task(task);
  const newData = await taskDataToDb.save();
  console.log(newData);

  const responseObject = {
    status: "success",
    message: "task Created",
    task: newData,
  };

  response.send(201, responseObject);
});

// READING tasks
app.get("/api/v1/tasks", async (request, response) => {
  // read tasks.json
  // Use fs.readFile() method to read the file
  // console.log(request);

  // const data = await fs.readFile("./data/tasks.json", "utf8");
  // const taskData = JSON.parse(data);

  const allTaskData = await Task.find();

  const responseObject = {
    status: "success",
    message: "task Listed",
    task: allTaskData,
  };

  response.send(responseObject);
});

// READING tasks
app.get("/api/v1/tasks/:id", async (request, response) => {
  const id = request.params.id;
  const { randomVariable } = request.query;

  console.log(randomVariable);

  const data = await fs.readFile("./data/tasks.json", "utf8");
  const taskData = JSON.parse(data);

  const task = taskData.find((task) => task.id == id);

  let responseObject = {};
  let serverCode = 200;
  if (task) {
    responseObject = {
      status: "success",
      message: "task Found",
      task,
    };
  } else {
    responseObject = {
      status: "error",
      message: "task not found",
    };

    serverCode = 404;
  }
  response.send(serverCode, responseObject);
});

// updating tasks
// app.put("/api/v1/tasks/:id", async (request, response) => {
//   const id = request.params.id;
//   const newData = request.body;

//   //db update

//   const taskData = Task.findByIdAndUpdate(id,{ $set: newData});

//   // read tasks.json
//   // Use fs.readFile() method to read the file
//   // const data = await fs.readFile("./data/tasks.json", "utf8");
//   // const taskData = JSON.parse(data);

//   const task = taskData.find((item) => item.id == id);

//   if (task) {
//     task.task = newData.task;
//     task.hr = parseInt(newData.hr);
//     task.type = newData.type;

//     await fs.writeFile("./data/tasks.json", JSON.stringify(taskData));

//     const responseObject = {
//       status: "success",
//       message: "Task Updated",
//     };
//     response.send(200, responseObject);
//   } else {
//     const responseObject = {
//       status: "error",
//       message: "Task Not Found",
//     };
//     response.send(404, responseObject);
//   }
// });

//updating the data using mongodb

app.put("/api/v1/tasks/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const newData = request.body;

    //db update

    const taskData = await Task.findByIdAndUpdate(
      id,
      { $set: newData },
      { new: true }
    );

    const sucessObject = {
      status: "Success",
      message: "task Updated",
      task: taskData,
    };

    response.send(200, sucessObject);
  } catch (err) {
    console.log(err);
    const errorObject = {
      status: "error",
      message: "Error Updating Task",
    };
    response.send(404, errorObject);
  }
});

//update certain data using mongo db

app.patch("/api/v1/tasks/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const newData = request.body;

    //db update

    const taskData = await Task.findByIdAndUpdate(
      id,
      { $set: newData },
      { new: true }
    );

    const sucessObject = {
      status: "Success",
      message: "task Updated",
      task: taskData,
    };

    response.send(200, sucessObject);
  } catch (err) {
    console.log(err);
    const errorObject = {
      status: "error",
      message: "Error Updating Task",
    };
    response.send(404, errorObject);
  }
});

// update certain data of a task
// app.patch("/api/v1/tasks/:id", async (request, response) => {
//   const id = request.params.id;
//   const newData = request.body;
//   // read tasks.json
//   // Use fs.readFile() method to read the file
//   const data = await fs.readFile("./data/tasks.json", "utf8");
//   const taskData = JSON.parse(data);
//   const task = taskData.find((item) => item.id == id);

//   if (task) {
//     Object.keys(newData).forEach((key) => {
//       task[key] = newData[key];
//     });

//     await fs.writeFile("./data/tasks.json", JSON.stringify(taskData));
//     const responseObject = {
//       status: "success",
//       message: "Task Updated",
//     };
//     response.send(200, responseObject);
//   } else {
//     const responseObject = {
//       status: "error",
//       message: "Task Not Found",
//     };
//     response.send(404, responseObject);
//   }
// });

// deleting task
// app.delete("/api/v1/tasks/:id", async (request, response) => {
//   const id = request.params.id;
//   // read tasks.json
//   // Use fs.readFile() method to read the file
//   const data = await fs.readFile("./data/tasks.json", "utf8");
//   const taskData = JSON.parse(data);

//   const filteredtask = taskData.filter((task) => task.id != id);

//   await fs.writeFile("./data/tasks.json", JSON.stringify(filteredtask));
//   const responseObject = {
//     status: "success",
//     message: "Task Deleted",
//   };
//   response.send(200, responseObject);
// });

// delete with mongodb

app.delete("/api/v1/tasks/:id", async (request, response) => {
  try {
    const id = request.params.id;

    await Task.findByIdAndDelete(id);

    //db update

    const responseObject = {
      status: "Success",
      message: "task Deleted",
    };

    response.send(200, responseObject);
  } catch (err) {
    console.log(err);
    const responseObject = {
      status: "error",
      message: "Error deleting Task",
    };
    response.send(404, responseObject);
  }
});

// do not change
// to start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
