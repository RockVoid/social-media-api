export const tokenIsValid = (token, res) => {
  if (!token) return res.status(401).json("Not logged in");
  return token;
}
