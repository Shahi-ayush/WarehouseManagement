import jwt from "jsonwebtoken";

export function verifyToken(token) {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // contains userId and whatever you put in the token
  } catch (err) {
    return null;
  }
}