import Cookies from "js-cookie";
import { createApi } from "./axios-service";
import { getTokenFromCookie } from "./get-token-from-cookie";

type Credential = {
  email: string
  password: string
}

export const loginUser = async (credentials: Credential) => {
  const c_token = await getTokenFromCookie()
  const api = createApi(c_token);

  const response = await api.post(`/api/login`, credentials);
  const { token, user } = response.data.data;

  if (token) {
    Cookies.set("_token_", token);
  }

  return { token, user };
};
