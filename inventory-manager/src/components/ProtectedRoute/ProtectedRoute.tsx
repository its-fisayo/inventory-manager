import { Navigate, Outlet } from "react-router-dom";
import IdleTimer from "../IdleTimer/IdleTimer";

function ProtectedRoute() {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if(!token) {
        return <Navigate to="/" replace/>;
    }

    return (
    <>
        <IdleTimer />
        <Outlet />
    </>
);
}

export default ProtectedRoute;