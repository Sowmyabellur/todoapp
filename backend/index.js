// server.js (updated)
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
const { toNodeHandler } = require('better-auth/node');
const { auth } = require('./lib/auth');
const { authMiddleware } = require('./lib/authMiddleware');
const { fromNodeHeaders } = require('better-auth/node');
require('dotenv').config();
const app = express();
const prisma = new PrismaClient();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Allow requests from this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);
app.use(express.urlencoded({ extended: true }));
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());

app.get('/todos', authMiddleware, async (req, res) => {
    const todos = await prisma.todo.findMany();
    res.json(todos);
});

app.post('/todos', authMiddleware, async (req, res) => {
    const { title, completed } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newTodo = await prisma.todo.create({
        data: { title, completed: completed || false },
    });
    res.status(201).json(newTodo);
});

app.put('/todos/:id', authMiddleware, async (req, res) => {
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

app.get('/todos/:id', authMiddleware, async (req, res) => {
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

app.delete('/todos/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.todo.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.get('/me', async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.json(session);
});

app.listen(8000, () =>
    console.log('✅ Server running on http://localhost:8000')
);