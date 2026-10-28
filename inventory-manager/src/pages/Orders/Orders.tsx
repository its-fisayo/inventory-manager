import axios from "axios";
import { useEffect, useRef, useState, useMemo } from "react";
import Input from "../../components/Input/input";
import Button from "../../components/Button/Button";
import { Search, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useOrders } from "../../hooks/useOrder";
import { useVendors } from "../../hooks/useVendor";
import { useDebounce } from "../../hooks/useDebounce";
import Table from "../../components/Table/Table";
import type { Column } from "../../components/Table/Table";
import type { OrderUI, OrderDTO } from "../../types/orders.types";
import type { VendorUI } from "../../types/vendor.types";
import toast from "react-hot-toast";

function Orders() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);

  const [search, setSearch] = useState("");
  const [vSearch, setVSearch] = useState("");
  const [isVOpen, setIsVOpen] = useState(false);
  const [vSelected, setVSelected] = useState<VendorUI | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const { fetchOrderById, orders, totalItems, loading } = useOrders(
    page,
    pageSize,
    debouncedSearch,
  );
  const { vendors } = useVendors(1, 100, "");

  const filteredVendor = vendors.filter((vendor) =>
    vendor.name.toLocaleLowerCase().includes(vSearch.toLowerCase()),
  );

  const columns: Column<OrderUI>[] = [
    { key: "orderNumber", label: "Order No." },
    { key: "vendorName", label: "Vendor" },

    {
      key: "totalItems",
      label: "No. of Items",
    },

    {
      key: "totalQuantity",
      label: "Quantity",
    },

    {
      key: "totalPrice",
      label: "Amount (₦)",
    },

    {
      key: "orderDate",
      label: "Date",
      render: (value) =>
        value
          ? new Date(value).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
          : "-",
    },
  ];

  // Filtered orders to be displayed
  const displayedOrders = useMemo(() => {
    let result = orders;

    // vendor filter
    if (vSelected) {
      result = result.filter((order) => order.vendorName === vSelected.name);
    }

    // date filter
    if (selectedDate) {
      result = result.filter((order) => {
        const orderDate = new Date(order.orderDate).toISOString().split("T")[0];

        return orderDate === selectedDate;
      });
    }

    return result;
  }, [orders, vSelected, selectedDate]);

  const vendorRef = useRef<HTMLDivElement>(null);

  // Close vendor dropdown onclick outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        vendorRef.current &&
        !vendorRef.current.contains(event.target as Node)
      ) {
        setIsVOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewOrder = async (order: OrderUI) => {
    try {
      setIsModalLoading(true);

      const fullOrder = await fetchOrderById(order.id);

      setSelectedOrder(fullOrder);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to fetch order details.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occured.");
      }
    } finally {
      setIsModalLoading(false);
    }
  };

  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen p-5 flex flex-col gap-5">
      {/* TOOL BAR */}
      <div className="bg-white flex items-end gap-5 p-5">
        {/* SEARCH */}
        <div className="flex flex-col w-60">
          <h3 className="mb-2">Search</h3>
          <div className="relative">
            <Search className="text-[#711460] w-[15px] h-[15px] absolute top-1/2 left-2.5 -translate-y-1/2" />
            <Input
              className="pl-7 py-2 catty"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* VENDOR DROPDOWN */}
        <div className="flex flex-col w-60">
          <label className="mb-2">Vendor</label>

          <div
            ref={vendorRef}
            className="catty relative w-full h-[42px] rounded-[10px] border border-[#777376] rounded outline-none focus-within:border-[#711460] focus-within:border-2 px-2 bg-white flex items-center justify-between"
          >
            <Input
              type="text"
              value={vSearch}
              onFocus={() => setIsVOpen(true)}
              onChange={(e) => {
                setVSearch(e.target.value);
                setVSelected(null);
              }}
              className="w-full h-full py-2 border-none outline-none"
              placeholder="All Vendor"
            />
            <button type="button">
              {!isVOpen ? (
                <ChevronDown onClick={() => setIsVOpen(true)} />
              ) : (
                <ChevronUp onClick={() => setIsVOpen(false)} />
              )}
            </button>

            {/* VENDORS OPTIONS */}
            {isVOpen && (
              <div className="absolute left-0 top-full mt-1 w-full border rounded bg-white shadow max-h-60 overflow-y-auto z-10">
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setVSelected(null);
                    setVSearch("");
                    setIsVOpen(false);
                  }}
                >
                  All Vendors
                </button>
                {filteredVendor.length > 0 ? (
                  filteredVendor.map((vendor) => (
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setVSelected(vendor);
                        setVSearch(vendor.name);
                        setIsVOpen(false);
                      }}
                    >
                      {vendor.name}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">No results</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DATE FILTER */}
        <div className="flex flex-col w-60">
          <h3 className="mb-2">Date</h3>
          <div className="relative">
            <Calendar className="text-[#711460] w-[15px] h-[15px] absolute top-1/2 left-2.5 -translate-y-1/2" />
            <Input
              type="date"
              className="pl-7 py-2 catty"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <Link to="/supply-management/new-orders" className="ml-auto">
          <Button className="bn2 whitespace-nowrap">New Orders</Button>
        </Link>
      </div>

      {/* TABLE */}
      <div>
        <Table<OrderUI>
          data={displayedOrders}
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
          actionsRender={(order) => (
            <div className="flex items-center gap-2 justify-end">
              <button
                className="text-sm text-[#141414CC] font-medium border border-[#711460] px-4 py-2.5 rounded-lg cursor-pointer"
                onClick={() => void handleViewOrder(order)}
              >
                View
              </button>
            </div>
          )}
        />
      </div>

      {isModalLoading && (
        <div
          className="fixed inset-0 bg-black/80 z-40"
          onClick={() => setSelectedOrder(null)}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <p className="rounded-lg bg-white p-5">Loading order details...</p>
          </div>
        </div>
      )}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/80 z-40"
          onClick={() => setSelectedOrder(null)}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
              {/* Scrollable Container */}
              <div className="p-6 overflow-y-auto max-h-[80vh] space-y-5">
                {/* Info Details Form Fields */}
                <h1 className="text-[#711460]">ORDER DETAILS</h1>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Order Number
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedOrder.orderNumber}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Vendor Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedOrder.vendorName}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Total Items
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedOrder.totalItems}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Total Quantity
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedOrder.totalQuantity}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">
                      Total Price
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedOrder.totalPrice}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Order Date
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formatDate(selectedOrder.orderDate)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Created At
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formatDate(selectedOrder.createdAt)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden shadow-2xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">
                      Created By
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedOrder.createdByUserName}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">
                      Description
                    </label>

                    {/* Order Items */}
                    <div className="space-y-3 pt-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order Items
                      </h3>

                      {selectedOrder.orderItems?.length ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left border-collapse">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600">
                                <th className="px-3 py-2">Product</th>
                                <th className="px-3 py-2">Quantity</th>
                                <th className="px-3 py-2">Unit Price</th>
                                <th className="px-3 py-2">Subtotal</th>
                              </tr>
                            </thead>

                            <tbody>
                              {selectedOrder.orderItems.map((item) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-gray-200"
                                >
                                  <td className="px-3 py-3">
                                    {item.productName}
                                  </td>

                                  <td className="px-3 py-3">{item.quantity}</td>

                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {item.unitPrice.toLocaleString("en-NG", {
                                      style: "currency",
                                      currency: "NGN",
                                    })}
                                  </td>

                                  <td className="px-3 py-3 whitespace-nowrap">
                                    {(
                                      item.quantity * item.unitPrice
                                    ).toLocaleString("en-NG", {
                                      style: "currency",
                                      currency: "NGN",
                                    })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No items found for this order.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50/50 px-6 py-4 flex justify-end border-t border-gray-100">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-[#711460] hover:bg-[#590f4b] text-white font-bold px-8 py-2.5 rounded-xl transition duration-150 active:scale-98 shadow-md"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
