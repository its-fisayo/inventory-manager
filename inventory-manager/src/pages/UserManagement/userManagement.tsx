import axios from "axios";
import { useMemo, useState } from "react";
import "./userManagement.css";
import Input from "../../components/Input/input";
import { Search, ListFilter, MoreHorizontal, X } from "lucide-react";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import type { Column } from "../../components/Table/Table";
import { useUsers } from "../../hooks/useUsers";
import { useDebounce } from "../../hooks/useDebounce";
import toast from "react-hot-toast";

type User = {
  id: string;
  fullName: string;
  email: string;
  staffId: string;
  role: string;
  isActive: boolean;
};

export default function User() {
  const [sortModal, setSortModal] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "role" | "staffId" | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [menuUserId, setMenuUserId] = useState<string | number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserS, setSelectedUserS] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { editUserRole, editUserStatus, users, totalItems, loading } = useUsers(
    page,
    pageSize,
    debouncedSearch,
  );

  const columns: Column<User>[] = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email address" },
    { key: "staffId", label: "Staff ID" },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <span
          className={
            value === "Admin"
              ? "text-[#711460] font-medium"
              : value === "User"
                ? "text-[#3D0B34] font-medium"
                : ""
          }
        >
          {value}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === true
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value === true ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const sortedUsers = useMemo(() => {
    const sorted = [...users];

    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;

      case "role":
        sorted.sort((a, b) => a.role.localeCompare(b.role));
        break;

      case "staffId":
        sorted.sort((a, b) => a.staffId.localeCompare(b.staffId));
        break;
    }

    return sorted;
  }, [users, sortBy]);

  const handleSaveRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      setIsSaving(true);
      await editUserRole({ id: selectedUser.id, data: { role: selectedRole } });
      toast.success("User role updated successfully.")
      setSelectedUser(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to update user role. Please try again.";
        toast.error(message);
      } else {
        toast.error("An uexpected error occured.");
      }
    } finally {
      setIsSaving(false);
    }
  };

   const handleSaveStatus = async () => {
    if (!selectedUserS) return;

    try {
      setIsSaving(true);
      await editUserStatus({ id: selectedUserS.id, data: { status: selectedStatus } });
      toast.success("User status updated successfully.")
      setSelectedUserS(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to update user status. Please try again.";
        toast.error(message);
      } else {
        toast.error("An uexpected error occured.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#F4F3F3] min-h-screen p-5 flex flex-col gap-5 overflow-x-hidden">
      {/* TOOL BAR */}
      <div className="flex items-center justify-between">
        {/* SEARCH */}
        <div className="flex relative">
          <Search className="text-[#711460] w-[15px] h-[15px] absolute top-1/2 left-2.5 -translate-y-1/2" />

          <Input
            className="input-field pl-7 py-2 border"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button className="btn1" onClick={() => setSortModal(true)}>
            <ListFilter className="icons" />
            Sort By
          </Button>
        </div>
      </div>

      {/* SORT MODAL */}
      {sortModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSortModal(false)}
          />

          <div className="absolute top-[140px] left-[850px] z-50 w-[232px] bg-white rounded-[10px] shadow-lg p-2">
            <button
              className="w-full text-left p-2 flex justify-between btnn"
              onClick={() => {
                setSortBy("name");
                setSortModal(false);
              }}
            >
              Sort by Name
            </button>

            <button
              className="w-full text-left p-2 flex justify-between btnn"
              onClick={() => {
                setSortBy("role");
                setSortModal(false);
              }}
            >
              Sort by Role
            </button>

            <button
              className="w-full text-left p-2 flex justify-between btnn"
              onClick={() => {
                setSortBy("staffId");
                setSortModal(false);
              }}
            >
              Sort by Staff ID
            </button>
          </div>
        </>
      )}

      {/* TABLE */}
      <div className="overflow-visible">
        <Table<User>
          data={sortedUsers}
          columns={columns}
          loading={loading}
          page={page}
          pageNum={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          actionsRender={(user) => (
            <div className="relative flex justify-center">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() =>
                  setMenuUserId((current) =>
                    current === user.id ? null : user.id,
                  )
                }
              >
                <MoreHorizontal size={20} />
              </button>

              {menuUserId === user.id && (
                <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedRole(user.role);
                      setMenuUserId(null);
                    }}
                  >
                    Edit user role
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setSelectedUserS(user);
                      setSelectedStatus(user.isActive);
                      setMenuUserId(null);
                    }}
                  >
                    Edit user status
                  </button>
                </div>
              )}
            </div>
          )}
        />
      </div>
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="edit-role-title"
                className="text-xl font-semibold text-[#3D0B34]"
              >
                Edit user role
              </h2>

              <button
                type="button"
                className="rounded-lg p-2 hover:bg-gray-100"
                onClick={() => setSelectedUser(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 space-y-1">
              <p className="text-sm text-gray-500">User</p>
              <p className="font-medium text-gray-900">
                {selectedUser.fullName}
              </p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="user-role"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Role
              </label>

              <select
                id="user-role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 outline-none focus:border-[#711460] focus:ring-1 focus:ring-[#711460]"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isSaving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isSaving ||
                  !selectedRole ||
                  selectedRole === selectedUser.role
                }
                className="rounded-lg bg-[#711460] px-5 py-2 text-sm font-medium text-white hover:bg-[#5d0e4f] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  // Call your backend update function here.
                  // See the save handler below.
                  void handleSaveRole();
                }}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

       {selectedUserS && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedUserS(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="edit-status-title"
                className="text-xl font-semibold text-[#3D0B34]"
              >
                Edit user status
              </h2>

              <button
                type="button"
                className="rounded-lg p-2 hover:bg-gray-100"
                onClick={() => setSelectedUserS(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 space-y-1">
              <p className="text-sm text-gray-500">User</p>
              <p className="font-medium text-gray-900">
                {selectedUserS.fullName}
              </p>
              <p className="text-sm text-gray-500">{selectedUserS.email}</p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="user-status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="user-status"
                value={String(selectedStatus)}
                onChange={(e) => setSelectedStatus(e.target.value === "true")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 outline-none focus:border-[#711460] focus:ring-1 focus:ring-[#711460]"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isSaving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setSelectedUserS(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isSaving  ||
                  selectedStatus === selectedUserS.isActive
                }
                className="rounded-lg bg-[#711460] px-5 py-2 text-sm font-medium text-white hover:bg-[#5d0e4f] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                   handleSaveStatus();
                }}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
