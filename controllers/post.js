import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { tokenIsValid } from "../utils/tokenIsValid.js";
import moment from "moment";

export const addPost = (req, res) => {
  const token = tokenIsValid(req.headers.cookies, res);

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO posts(desc,img,createdAt,userId) VALUES(?,?,?,?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id
    ];

    db.query(q, [...values], (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created!");
    });
  })
};

export const deletePost = (req, res) => {
  const token = tokenIsValid(req.headers.cookies, res);

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json(err);

    const getPostsFromUser = "SELECT * FROM posts WHERE idUser=?";
    db.query(getPostsFromUser, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(201).json("Post deleted!")
      return res.status(403).json("You can delete only your post!")
    });

    const q = "DELETE FROM posts WHERE id=?";
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(201).json("Post deleted!")
      return res.status(403).json("You can delete only your post!")
    });
  });
}

export const getPosts = (req, res) => {
  //  SELECT * FROM posts AS p JOIN users AS u ON (u.id = p.userId)
  //  Modo simplificado:
  //  
  //  SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId);
  //
  //
  const token = tokenIsValid(req.headers.cookies, res);
  const userId = req.query.userId;

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const getTimelinePosts = 'SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC';  
    const getSpecificUserPost = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
    ORDER BY p.createdAt DESC`;

    const q = (userId !== "undefined" ? getTimelinePosts : getSpecificUserPost);
    const values = (userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id]);

    db.query(q, [...values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}
