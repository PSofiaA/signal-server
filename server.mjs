import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

const allowedOrigins = ['http://localhost:5173'];  // Adjust if needed

const app = express();

app.use(cors({
    // origin: allowedOrigins,
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true
}));

app.use(express.json());

const httpServer = createServer(app);

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');

    ws.on('message', (message) => {
        console.log('Received WebSocket message:', message);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    setupWSConnection(ws, req);  // Set up y-websocket connection
});

function onError(error) {
    console.log('Server Error:', error);
}

function onListening() {
    console.log('Server is listening on port 4444');
}

httpServer.on('error', onError);
httpServer.on('listening', onListening);

httpServer.listen(4444, () => {
    console.log('Server running on port 4444');
});
