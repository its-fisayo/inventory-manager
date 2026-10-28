
import { jwtDecode } from "jwt-decode";
import { logout } from "./logout";

type JwtPayload = {
  exp: number;
};

let expiryTimer: number | undefined;

export function scheduleTokenExpiry(token: string) {
  if (expiryTimer !== undefined) {
    window.clearTimeout(expiryTimer);
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      logout();
      return;
    }

    const remainingTime = decoded.exp * 1000 - Date.now();

    if (remainingTime <= 0) {
      logout();
      return;
    }

    expiryTimer = window.setTimeout(() => {
      // Only log out if this token is still the active token.
      const activeToken =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (activeToken === token) {
        logout();
      }
    }, remainingTime);
  } catch {
    logout();
  }
}
