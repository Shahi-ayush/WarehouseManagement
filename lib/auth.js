import jwt from "jsonwebtoken";

export function verifyCustomerToken(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("NO_TOKEN");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("INVALID_TOKEN_FORMAT");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}
