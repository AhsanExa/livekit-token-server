import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AccessToken } from "livekit-server-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

app.post("/get-token", async (req, res) => {
  try {
    const { roomName, participantName } = req.body;

    const token = new AccessToken(API_KEY, API_SECRET, {
      identity: participantName,
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    res.json({
      token: jwt,
      url: LIVEKIT_URL,
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      error: e.toString(),
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});