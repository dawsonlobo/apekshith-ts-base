import express from 'express';
import dotenv from 'dotenv';
import greeting from "./routes/greetingRoutes";
import { TwilioService } from '../src/services/twilio/twilio';
import message from "./routes/twilioRoutes";
import user from "./routes/userRoutes";
import otp from "./routes/otpRoutes";
import chat from "./routes/openAIRoutes";
import './models/userModels';
import { WebSocketServer } from "ws";
import { fetchChatCompletion } from "../src/services/openAI/ai"; // Import your fetch function
import http from "http";
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const server = http.createServer(app);  // Ensure server uses Express app
const wss = new WebSocketServer({ server });

app.use("/v1",message);
app.use("/v1",user);



const mongoUrl = process.env.mongo_url || "mongodb://localhost:27017/user-otp";

async function connectToDatabase() {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB with Mongoose");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);  
    }
}

connectToDatabase();

wss.on("connection", (ws) => {
    console.log("Client connected");

    // Listen for incoming messages (questions from client)
    ws.on("message", async (message) => {
        console.log(`Received question: ${message}`);
        try {
            // Use your existing function to fetch the response from OpenRouter (ChatGPT)
            const answer = await fetchChatCompletion(message.toString());
            console.log(`Sending answer: ${answer}`);

            // Send the answer back to the client
            ws.send(answer);
        } catch (error) {
            console.error("Error while fetching answer:", error);
            ws.send("Sorry, there was an error processing your question.");
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});




server.listen(3000, () => {
    console.log("WebSocket server running on port 3000");
});
