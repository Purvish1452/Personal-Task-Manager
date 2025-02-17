const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const tasksFilePath = path.join(__dirname, 'tasks.json');

const readTasks = () => {
  if (fs.existsSync(tasksFilePath)) {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const writeTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

app.post('/tasks', (req, res) => {
  const { title, status = 'pending' } = req.body;
  const tasks = readTasks();
  const newTask = { id: tasks.length + 1, title, status };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.status(200).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const { title, status } = req.body;
  const tasks = readTasks();
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.title = title || task.title;
  task.status = status || task.status;
  writeTasks(tasks);
  res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  writeTasks(tasks);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
