import jwt, { JsonWebTokenError, type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { InvalidAccessTokenError } from "./errors";

export function signAccessToken(userId: string): string {
  return jwt.sign({}, JWT_SECRET, { subject: userId, expiresIn: "1h" });
}

export function verifyAccessToken(token: string): string {
  let payload: string | JwtPayload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new InvalidAccessTokenError();
    }

    throw error;
  }

  if (typeof payload === "string" || !payload.sub) {
    throw new InvalidAccessTokenError();
  }

  return payload.sub;
}
