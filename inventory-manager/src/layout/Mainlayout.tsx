import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar/SideBar";
import TopBar from "../components/TopBar/TopBar";

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 overflow-y-auto">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}
