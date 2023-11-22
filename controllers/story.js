import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { tokenIsValid } from "../utils/tokenIsValid.js";
import moment from "moment";

export const getStories = (req, res) => {
  const token = tokenIsValid(req.cookies.accessToken, res);

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    // Separa os usuarios que tem stories e da um LEFT JOIN com relacionamentos, para saber se é amigo ou nao
    const q = "SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId) LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId=?) LIMIT 4";

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  })
};

export const addStory = (req, res) => {
  const token = tokenIsValid(req.headers.cookie, res);
  
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token invalid!");

    const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?, ?, ?)";
    const values = [
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id
    ];

    db.query(q, [...values], (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Story has been added!");
    })
  })
};

export const deleteStory = (req, res) => {
  const token = tokenIsValid(req.cookies.accessToken, res);

  const q = "DELETE FROM stories WHERE id`=? AND `userId` = ?";

  db.query(q, [req.params.id, userInfo.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows > 0) return res.status(200).json("Story has been deleted!");

    return res.status(403).json("You can delete only your storie!");
  })
};