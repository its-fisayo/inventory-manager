import { useState } from "react";
import { Search, Plus, MoreHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/input";
import { useVendors } from "../../hooks/useVendor";
import { useDebounce } from "../../hooks/useDebounce";
import Table from "../../components/Table/Table";
import type { Column } from "../../components/Table/Table";
import axios from "axios";

type Vendor = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  primaryContact: string;
  isActive: boolean;
};

export default function VendorManagement() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [menuVendorId, setMenuVendorId] = useState<string | number | null>(
    null,
  );
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { vendors, totalItems, addVendor, editVendor, loading } = useVendors(
    page,
    pageSize,
    debouncedSearch,
  );

  const [newModal, setNewModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    primaryContact: "",
    isActive: true,
  });

  const columns: Column<Vendor>[] = [
    { key: "name", label: "Vendor" },
    { key: "primaryContact", label: "Primary Contact" },
    { key: "phoneNumber", label: "Phone" },
    { key: "email", label: "Email" },
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

  const [eMessage, setEMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation Logic
  const validateForm = () => {
    const errors: string[] = [];
    // 1. Vendor Name Rules
    const vendorNameLen = formData.name.trim().length;
    if (vendorNameLen < 3) {
      errors.push("Minimum character is 3 for Vendor Name.");
    }
    if (vendorNameLen > 20) {
      errors.push("Maximum characters exceeded for Vendor Name.");
    }
    // 2. Email Pattern Rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.push(
        "Please enter a valid email address (e.g., example@gmail.com).",
      );
    }
    // 3. Phone Number Length Rules
    const phoneRegex = /^\d{11,13}$/;

    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      errors.push("Phone number must contain 11-13 digits.");
    }
    // 4. Primary Contact Rules
    const contactLen = formData.primaryContact.trim().length;
    if (contactLen < 3) {
      errors.push("Minimum character is 3 for Primary Contact.");
    }
    if (contactLen > 20) {
      errors.push("Maximum characters exceeded for Primary Contact.");
    }

    setEMessage(errors.join("\n"));
    return errors.length === 0;
  };

  async function handleAdd(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    setIsLoading(true);
    try {
      await addVendor(formData);
      toast.success("Vendor succesfully added");
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        primaryContact: "",
        isActive: true,
      });
      setEMessage("");
      setNewModal(false);
    } catch (error: unknown) {
      toast.error("Failed to add vendor");
    } finally {
      setIsLoading(false);
    }
  }

  function closeModal() {
    setNewModal(false);
    setFormData({
      name: "",
      phoneNumber: "",
      email: "",
      primaryContact: "",
      isActive: true,
    });
    setEMessage("");
  }

  const handleSaveStatus = async () => {
    if (!selectedVendor) return;

    try {
      setIsSaving(true);
      await editVendor({
        id: selectedVendor.id,
        data: {
          name: selectedVendor.name,
          phoneNumber: selectedVendor.phoneNumber,
          primaryContact: selectedVendor.primaryContact,
          email: selectedVendor.email,
          isActive: selectedStatus,
        },
      });
      toast.success("Vendor status updated successfully.");
      setSelectedVendor(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to update vendor status. Please try again.";
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
      {/* TOOLBAR */}
      <div className="flex items-center justify-between">
        {/* SEARCH */}
        <div className="flex relative">
          <Search className="text-[#711460] w-[15px] h-[15px] absolute top-1/2 left-2.5 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search"
            className="input-field pl-7 py-2 border"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <button
          className="flex items-center gap-2 bg-[#711460] text-white px-4 py-2 rounded-lg"
          onClick={() => setNewModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add New Vendor
        </button>
      </div>

      {/* TABLE */}
      <Table<Vendor>
        data={vendors}
        columns={columns}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        actionsRender={(vendor) => (
          <div className="relative flex justify-center">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={() =>
                setMenuVendorId((current) =>
                  current === vendor.id ? null : vendor.id,
                )
              }
            >
              <MoreHorizontal size={20} />
            </button>

            {menuVendorId === vendor.id && (
              <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setSelectedStatus(vendor.isActive);
                    setMenuVendorId(null);
                  }}
                >
                  Edit vendor status
                </button>
              </div>
            )}
          </div>
        )}
      />

      {/* ADD MODAL */}
      {newModal && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-40"
            onClick={() => closeModal()}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="w-[400px] bg-white p-6 rounded-lg">
              <h2 className="text-[#711460] font-bold text-xl mb-4">
                Add Vendor
              </h2>

              <form onSubmit={handleAdd} className="flex flex-col gap-3">
                <Input
                  placeholder="Vendor Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <Input
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                />

                <Input
                  placeholder="Primary Contact"
                  value={formData.primaryContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryContact: e.target.value,
                    })
                  }
                  required
                />

                <pre className="text-red-500 text-[12px] whitespace-pre-wrap">
                  {eMessage}
                </pre>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding" : "Add Vendor"}
                </Button>
              </form>
            </div>
          </div>
        </>
      )}

      {selectedVendor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedVendor(null)}
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
                Edit vendor status
              </h2>

              <button
                type="button"
                className="rounded-lg p-2 hover:bg-gray-100"
                onClick={() => setSelectedVendor(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 space-y-1">
              <p className="text-sm text-gray-500">User</p>
              <p className="font-medium text-gray-900">{selectedVendor.name}</p>
              <p className="text-sm text-gray-500">{selectedVendor.email}</p>
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
                onClick={() => setSelectedVendor(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isSaving || selectedStatus === selectedVendor.isActive
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
