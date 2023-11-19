import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = ({ username, email, password, name }, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPasword = bcrypt.hashSync(password, salt);
  const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE(?, ?, ?, ?)";

  const registerData = [
    username,
    email, 
    hashedPasword,
    name
  ];

  db.query(q, [...registerData], (err, data) => {
    console.log(err, data);
    if (err) return res.status(500).json("Error in data insertion!");
    return res.status(200).json("User has been created!");
  })
}

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  const { username, email, password, name } = req.body;
  
  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already registered!")

    createUser({username, email, password, name}, res);
  })
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found.");
    
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword) return res.status(400).json("Incorrect password!");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res.
      cookie("accessToken", token, {
        httpOnly: true
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    secure: true,
    sameSite: "none"
  }).status(200).json("User has been logged out!")
};