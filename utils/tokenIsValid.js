export const tokenIsValid = (cookie, res) => {
  const token = cookie.slice(12);
  if (!token) return res.status(401).json("Not logged in");
  return token;
}
