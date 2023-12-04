import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { tokenIsValid } from "../utils/tokenIsValid.js";

export const getRelationships = (req, res) => {
  // Busca todos os seguidores que seguem o ID solicitado na query
  const q = "SELECT followerUserId FROM relationships WHERE followedUseriD = ?";

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(relationship => relationship.followerUserId));
  })
}

export const addRelationship = (req, res) => {
  const token = tokenIsValid(req.headers.cookie, res);
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT into relationships(followerUserId,followedUserId) VALUES (?,?)";

    const values = [
      userInfo.id,
      req.body.userId
    ];

    db.query(q, [...values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following!");
    });
  });
} 

export const deleteRelationships = (req, res) => {
  const token = tokenIsValid(req.headers.cookie, res);

  jwt.verify(token, "secretkey", (err, userInfo) => {
    // Apaga, na tabela relationships, a aligação entre seguidor e seguido
    const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow!");
    });
  });

};