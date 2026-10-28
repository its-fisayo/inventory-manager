import api from "../api/client";

export const login = async (email: string, password: string) => {
  const response = await api.post("/api/Auth/login", {
    email,
    password,
  });

  return response.data;
};

export const signup = async (fullName: string, email: string, staffId: string, password: string ) => {
  const response = await api.post("/api/Auth/signup", {
    fullName,
    email,
    staffId,
    password
  });

  return response.data
}
