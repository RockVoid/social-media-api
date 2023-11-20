import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];

    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = tokenIsValid(req.cookies.accessToken, res);

  const { name, city, website, coverPic, profilePic, id } = req.body;

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if(err) return res.status(403).json("Token Invalid!");

    const q =
    "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(q, [
      name,
      city,
      website,
      coverPic,
      profilePic,
      id
    ], 
    (err, data) => {
      if (err) res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Updated");
      return res.status(403).json("You can updated only your post!");
    });
  });
}