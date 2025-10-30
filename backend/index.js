// server.js (updated)
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/todos', async (req, res) => {
    const todos = await prisma.todo.findMany();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const { title, completed } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newTodo = await prisma.todo.create({
        data: { title, completed: completed || false },
    });
    res.status(201).json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    try {
        const todo = await prisma.todo.update({
            where: { id: parseInt(id) },
            data: { title, completed },
        });
        res.json(todo);
    } catch (error) {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
        const todo = await prisma.todo.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        await prisma.todo.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.listen(8000, () =>
    console.log('✅ Server running on http://localhost:8000')
);