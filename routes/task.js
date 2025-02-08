const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Task
router.post('/create', async (req, res) => {
  try {
    const { title, desc, priority, deadline, is_done, created_by } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        desc,
        priority,
        deadline,
        is_done,
        created_by,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

// Read All Tasks
router.get('/get-all', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { is_deleted: false },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

// Read Task by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    if (!task || task.is_deleted) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch task.' });
  }
});

// Update Task
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, priority, deadline, is_done } = req.body;

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        desc,
        priority,
        deadline: deadline ? new Date(deadline) : undefined,
        is_done,
      },
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

// Delete Task (Soft Delete)
router.delete('/deletesoft/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });

    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

// Hard Delete by ID
router.delete('/delete/:id', async function (req, res) {
  const { id } = req.params;
  const task = await prisma.task.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.send(task);
});
module.exports = router;
