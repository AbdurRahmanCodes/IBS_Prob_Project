import jwt, { JsonWebTokenError, type JwtPayload } from "jsonwebtoken";
import { InvalidAccessTokenError } from "./errors";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  return secret;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({}, getJwtSecret(), { subject: userId, expiresIn: "1h" });
}

export function verifyAccessToken(token: string): string {
  let payload: string | JwtPayload;

  try {
    payload = jwt.verify(token, getJwtSecret());
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
