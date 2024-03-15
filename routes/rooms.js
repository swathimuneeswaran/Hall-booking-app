import express from "express";
import { toCreateRoom, getRoomById } from "../helper.js";
import { client } from "../index.js";
const router = express.Router();

router.post("/createroom", async (req, res) => {
  const rooms = req.body;
  console.log(rooms);
  const result = await toCreateRoom(rooms);
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await getRoomById(id);
  result
    ? res.status(200).send(result)
    : res.status(400).send({ message: `No room found on this id = ${id}` });
});

router.get("/", async (req, res) => {
  const cursor = await client.db("room").collection("room_info").find();
  const use = await cursor.toArray();
  res.send(use);
});

export const roomRoute = router;
