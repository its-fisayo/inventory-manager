import "./TopBar.css";
import { useLocation } from "react-router-dom";
import { Bell, UserPen } from "lucide-react";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../auth/getUser";

function TopBar() {
  const location = useLocation();
  const user = getUser();

  const pageTitles: Record<string, ReactNode> = {
    "/dashboard": "Dashboard",
    "/user-management": "User Management",
    "/inventory/asset-management": (
      <span className="title-stuff">
        <span className="title-span">Inventory</span> &gt; Asset Management
      </span>
    ),
    "/inventory/new-product": (
      <span className="title-stuff">
        <span className="title-span">Inventory</span> &gt; New Product
      </span>
    ),
    "/issuance/issuances": (
      <span className="title-stuff">
        <span className="title-span">Issuance</span> &gt; Issuances
      </span>
    ),
    "/issuance/issue-item": (
      <span className="title-stuff">
        <span className="title-span">Issuance</span> &gt; Issue Item
      </span>
    ),
    "/supply-management/new-orders": (
      <span className="title-stuff">
        <span className="title-span">Supply Management</span> &gt; New Order
      </span>
    ),
    "/supply-management/orders": (
      <span className="title-stuff">
        <span className="title-span">Supply Management</span> &gt; Orders
      </span>
    ),
    "/supply-management/stocks": (
      <span className="title-stuff">
        <span className="title-span">Supply Management</span> &gt; Stocks
      </span>
    ),
    "/supply-management/vendor-management": (
      <span className="title-stuff">
        <span className="title-span">Supply Management</span> &gt; Vendor
        Management
      </span>
    ),
    "/stock-movement": "Stock Movement",
    "/issuance": "Issuance",
    "/profile": "",
  };

  const profileTitleP: Record<string, string> = {
    "/profile": "Account Settings",
  };

  const profileTitle: Record<string, string> = {
    "/profile": "Personal Information",
  };

  const profileP = profileTitleP[location.pathname];
  const title = pageTitles[location.pathname];
  const profile = profileTitle[location.pathname];

  return (
    <div>
      <div className="h-[60px] bg-white px-[25px] flex w-full justify-between items-center">
        <div>
          <p className="text-[#711460] text-[16px]">{profileP}</p>

          <h1 className="text-[#141414CC] text-[32px] font-bold">{profile}</h1>

          <div className="text-[#711460] text-[32px] font-bold">{title}</div>
        </div>

        <div className="flex items-center justify-between w-[auto] gap-[10px]">
          {location.pathname !== "/notification" && (
            <Link to="/notification">
              <Bell className="text-[#711460]" />
            </Link>
          )}

          {location.pathname !== "/profile" && (
            <Link to="/profile">
              <UserPen className="text-[#711460]" />
            </Link>
          )}

          <div className="flex gap-4">
            <p className="text-[20px] font-[500]">{user?.fullName}</p>
            <div className="border-2 border-[#711460] rounded-lg px-2">
              <p className="text-[18px] text-[#711460]">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
