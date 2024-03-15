import express from "express";
import {
  AddRoomBooking,
  updateRoom,
  checkRoom,
  checkUser,
  checkHowManyTimeBooked,
} from "../helper.js";
import { client } from "../index.js";
const router = express.Router();

router.post("/bookroom", async (req, res) => {
  const newRoomBooking = req.body;
  const booking = newRoomBooking;
  const result = await AddRoomBooking(newRoomBooking);
  //    console.log(newRoomBooking.room_id);
  //    console.log(result.room_id)
  if (result) {
    await roomCheckById(booking, req, res);
  }
  res.send(result);
});

// router.post("/bookroom",async(req,res)=>
// {
//     const newRoomBooking=req.body;
// //    console.log(newRoomBooking);
//    const result=await AddRoomBooking(newRoomBooking)
// //    console.log(newRoomBooking.room_id);
// //    console.log(result.room_id)
//     if(result)
//     {
//         await customerExist(newRoomBooking,req,res);

//     }
//    res.send(result)
// })
async function roomCheckById(booking, req, res) {
  const { room_id } = booking.room_id;
  const roomExists = await checkRoom(room_id);
  console.log(roomExists);
  if (roomExists && roomExists.status === "Booked") {
    res
      .status(400)
      .send({ message: "You can't book this room. It is already booked." });
  }
}

// async function customerExist(newRoomBooking,req,res)
// {
//     const customer_name =newRoomBooking.customer_name;
//         console.log(customer_name)
//         const isUserExists =await checkUser(customer_name)
//         console.log(isUserExists.customer_name)
//         if(customer_name===isUserExists.customer_name)
//         {
//             res.status(400).send({message:"Customer name already exists.Provide extra information to book the room"})
//         }
// }

router.get("/bookroom", async (req, res) => {
  const cursor = await client.db("room").collection("bookroom").find();
  const use = await cursor.toArray();
  res.send(use);
});

router.get("/bookroom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const roomExists = await checkRoom(id);
    console.log(roomExists);
    if (roomExists) {
      // If the room exists, you can proceed to update it
      await updateRoomHandler(req, res);
      // await roomOccupied(req,res);
    } else {
      // If the room doesn't exist, send an error response
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.error("Error checking room:", error);
    res.status(500).json({ error: "Failed to check room" });
  }
});

async function updateRoomHandler(req, res) {
  try {
    const { id } = req.params;
    const updatedRoom = { status: "Booked" };

    const result = await updateRoom(id, updatedRoom);

    res.send(result);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
}

router.get("/customercheck", async (req, res) => {
  const { customer } = req.query;
  console.log(customer);
  const result = await checkHowManyTimeBooked(customer);
  console.log(result);
  result
    ? res.status(200).send(result)
    : res
        .status(400)
        .send({ message: `User does not found.please book the room` });
});

export const bookingRoute = router;
