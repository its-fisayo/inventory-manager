export function logout(){
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/";
}