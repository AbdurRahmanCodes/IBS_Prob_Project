import type { Request } from "express";
import { verifyAccessToken } from "./jwt";
import { InvalidAccessTokenError, unauthenticated } from "./errors";

export type GraphQLContext = {
  userId?: string;
};

export function createContext(request: Request): GraphQLContext {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return {};
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new Error("Invalid authorization header");
  }

  try {
    return { userId: verifyAccessToken(token) };
  } catch (error) {
    if (error instanceof InvalidAccessTokenError) {
      throw unauthenticated("Invalid access token");
    }

    throw error;
  }
}
