"use server";
import { cookies } from "next/headers"

export const getTokenFromCookie = async () => {
  const s_token = await cookies()
  return s_token.get("_token_")?.value
}