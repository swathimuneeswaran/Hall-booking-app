import { client } from "./index.js";

async function toCreateRoom(room) {
  return await client.db("room").collection("room_info").insertMany(room);
}

async function getRoomById(id) {
  return await client
    .db("room")
    .collection("room_info")
    .findOne({ room_id: id });
}
// async function getAllRooms(queryParams){

//     return await client.db("room").collection("room_info").find(req.query).toArray()
// }

async function AddRoomBooking(newRoomBooking) {
  return await client
    .db("room")
    .collection("bookroom")
    .insertOne(newRoomBooking);
}

async function checkRoom(id) {
  return await client
    .db("room")
    .collection("bookroom")
    .findOne({ room_id: id });
}

async function checkHowManyTimeBooked(customer) {
  return await client
    .db("room")
    .collection("bookroom")
    .aggregate([
      { $match: { customer_name: customer } }, // Match documents with the given customer_name
      { $group: { _id: "$customer_name", count: { $sum: 1 } } }, // Group by customer_name and count occurrences
    ])
    .toArray();
}

async function updateRoom(id, updatedRooms) {
  return await client
    .db("room")
    .collection("room_info")
    .updateOne({ room_id: id }, { $set: updatedRooms });
}

async function checkUser(customer_name) {
  return await client
    .db("room")
    .collection("bookroom")
    .find({ customer_name: customer_name });
}

export {
  toCreateRoom,
  getRoomById,
  AddRoomBooking,
  checkRoom,
  updateRoom,
  checkUser,
  checkHowManyTimeBooked,
};
