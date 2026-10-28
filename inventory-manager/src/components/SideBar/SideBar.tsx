import { useState } from "react";
import logo from "../../assets/images/Group-56.png";
import "./SideBar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { LucideIcon } from "lucide-react";
import { getUser } from "../../auth/getUser";
import { hasPermission } from "../../auth/hasPermissions";
import {
  Permission,
  type Permission as PermissionType,
} from "../../auth/permission";
import {
  House,
  UserPen,
  Store,
  ChevronRight,
  Tags,
  DoorOpen,
  User,
  Package,
} from "lucide-react";

type DropdownKey =
  | "inventory"
  | "issuance"
  | "supply";

type SubMenuItem = {
  title: string;
  path: string;
  permission?: PermissionType;
};

type BaseMenuItem = {
  title: string;
  icon: LucideIcon;
};

type LinkMenuItem = BaseMenuItem & {
  path: string;
  stateKey?: never;
  subMenu?: never;
  permission?: PermissionType;
};

type DropdownMenuItem = BaseMenuItem & {
  stateKey: DropdownKey;
  subMenu: SubMenuItem[];
  path?: never;
  permission?: PermissionType;
};

type MenuItem = LinkMenuItem | DropdownMenuItem;

/* ✅ TYPE GUARD (THIS FIXES YOUR ERROR) */
function isDropdownItem(item: MenuItem): item is DropdownMenuItem {
  return "subMenu" in item;
}

export default function SideBar() {
  const navigate = useNavigate();
  const user = getUser();
  const canAccess = (permission?: PermissionType) => {
    if (!permission) return true;

    if (!user) return false;

    return hasPermission(user.role, permission);
  };

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    navigate("/");
    toast.success("You have been logged out");
  }
  const [dropdowns, setDropdowns] = useState<Record<DropdownKey, boolean>>({
    inventory: false,
    issuance: false,
    supply: false,
  });

  const toggleDropdown = (key: DropdownKey) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-div active" : "nav-div";

  const subLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "submenu-link active" : "submenu-link";

  const generalMenuItems: MenuItem[] = [
    { title: "Dashboard Overview", path: "/dashboard", icon: House, permission: Permission.MANAGE_VENDORS },
    {
      title: "User Management",
      path: "/user-management",
      icon: UserPen,
      permission: Permission.MANAGE_USERS,
    },

    {
      title: "Issuance",
      icon: Tags,
      stateKey: "issuance",
      subMenu: [
        {
          title: "Issuances",
          path: "issuance/issuances",
          permission: Permission.MANAGE_ISSUANCE
        },
        {
          title: "Issue Item",
          path: "issuance/issue-item",
          permission: Permission.MANAGE_ISSUANCE
        }
      ]
    },

    {
      title: "Inventory",
      icon: Store,
      stateKey: "inventory",
      subMenu: [
        {
          title: "Asset Management",
          path: "/inventory/asset-management",
          permission: Permission.MANAGE_ASSETS,
        },
        {
          title: "Add New Product",
          path: "/inventory/new-product",
          permission: Permission.CREATE_ASSETS,
        },
      ],
    },

    {
      title: "Supply Management",
      icon: Package,
      stateKey: "supply",
      subMenu: [
        {
          title: "Orders",
          path: "/supply-management/orders",
          permission: Permission.MANAGE_ORDERS,
        },
        {
          title: "New Orders",
          path: "/supply-management/new-orders",
          permission: Permission.CREATE_ORDERS,
        },
        {
          title: "Stocks",
          path: "/supply-management/stocks",
          permission: Permission.MANAGE_STOCKS,
        },
        {
          title: "Stock Movement",
          path: "/supply-management/stock-movement",
          permission: Permission.VIEW_MOVEMENT,
        },
        {
          title: "Vendor Management",
          path: "/supply-management/vendor-management",
          permission: Permission.MANAGE_VENDORS,
        },
      ],
    },
  ];

  type otherMenuItem =
    | {
        title: string;
        path: string;
        icon: LucideIcon;
        onClick?: never;
      }
    | {
        title: string;
        icon: LucideIcon;
        onClick: () => void;
        path?: never;
      };
  const otherMenuItems: otherMenuItem[] = [
    { title: "Profile", path: "/profile", icon: User },
    { title: "Logout", icon: DoorOpen, onClick: handleLogout },
  ];

  return (
    <div className="SideBar">
      <div className="ogo">
        <Link to="/dashboard">
          {" "}
          <img src={logo} alt="Logo" className="Logo" />
        </Link>
      </div>

      <hr className="s" />

      <div className="general">
        <p className="pip">
          <strong>General</strong>
        </p>

        {generalMenuItems.map((item, index) => {
          const Icon = item.icon;

          /* ✅ SAFE NARROWING */
          if (!isDropdownItem(item)) {
            if (!canAccess(item.permission)) {
              return null;
            }
            return (
              <NavLink key={index} to={item.path} className={linkClass}>
                <Icon />
                <p className="nav-text">{item.title}</p>
              </NavLink>
            );
          }

          const isOpen = dropdowns[item.stateKey];
          const visibleSubMenus = item.subMenu.filter((subItem) =>
            canAccess(subItem.permission),
          );
          if (visibleSubMenus.length === 0) {
            return null;
          }
          return (
            <div className="inventory-container" key={index}>
              <div
                className="nav-div inventory-header"
                onClick={() => toggleDropdown(item.stateKey)}
              >
                <Icon />
                <p className="nav-text">{item.title}</p>
                <ChevronRight
                  className={`dropdown-icon ${isOpen ? "rotate" : ""}`}
                />
              </div>

              <ul className={`inventory-menu ${isOpen ? "open" : ""}`}>
                {visibleSubMenus.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <NavLink to={subItem.path} className={subLinkClass}>
                      {subItem.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <hr className="sss" />

      <div className="general">
        <p className="oth">Others</p>

        {otherMenuItems.map((item, index) => {
          const Icon = item.icon;

          if (item.path) {
            return (
              <NavLink key={index} to={item.path} className={linkClass}>
                <Icon />
                <p className="nav-text">{item.title}</p>
              </NavLink>
            );
          }

          return (
            <button
              key={index}
              onClick={item.onClick}
              className="nav-div w-full text-left"
            >
              <Icon />
              <p className="nav-text">{item.title}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
