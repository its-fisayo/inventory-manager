import { useMemo, useState, useEffect, useRef } from "react";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import type { Column } from "../../components/Table/Table";
import Input from "../../components/Input/input";
import "./newOrders.css";
import { useProducts } from "../../hooks/useProduct";
import { useVendors } from "../../hooks/useVendor";
import type { ProductUI } from "../../types/products.types";
import type { VendorUI } from "../../types/vendor.types";
import type { CreateOrderItemRequest } from "../../types/orders.types";
import toast from "react-hot-toast";
import { useOrders } from "../../hooks/useOrder";
import axios from "axios";

type OrderLineItem = {
  id: string | number;
  number: string | number;
  category: string;
  productName: string;
  quantity: number;
  unitCost: number;
  lineCost: number;
  isTotalRow?: boolean;
};

export default function NewOrders() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [addModal, setAddModal] = useState(false);

  function closeModal() {
    setAddModal(false);
  }

  const [search, setSearch] = useState("");
  const [vSearch, setVSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVOpen, setIsVOpen] = useState(false);
  const [selected, setSelected] = useState<ProductUI | null>(null);
  const [vSelected, setVSelected] = useState<VendorUI | null>(null);
  const [vendorId, setVendorId] = useState("");
  const [supplyDate, setSupplyDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [items, setItems] = useState<CreateOrderItemRequest[]>([]);

  const [isNewLoading, setIsNewLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);

  const { products } = useProducts(1, 100, "");
  const { vendors } = useVendors(1, 100, "");
  const { addOrder, loading } = useOrders(1, 100, "");

  const options = products;
  const vendorOptions = vendors;

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredVendorOptions = vendorOptions.filter((vOption) =>
    vOption.name.toLowerCase().includes(vSearch.toLowerCase()),
  );

  const [quant, setQuant] = useState("");
  const [uPrice, setUPrice] = useState("");

  const [itemRows, setItemRows] = useState<OrderLineItem[]>([]);

  const totalQuantity = itemRows.reduce((sum, i) => sum + i.quantity, 0);
  const totalUnitCost = itemRows.reduce((sum, i) => sum + i.unitCost, 0);
  const totalLineCost = itemRows.reduce((sum, i) => sum + i.lineCost, 0);

  const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const pageRows = itemRows.slice(start, start + pageSize);
    return [
      ...pageRows,
      {
        id: "TOTAL",
        number: "TOTAL",
        category: "",
        productName: "",
        quantity: totalQuantity,
        unitCost: totalUnitCost,
        lineCost: totalLineCost,
        isTotalRow: true,
      },
    ];
  }, [page, pageSize, itemRows, totalQuantity, totalUnitCost, totalLineCost]);

  const totalItems = itemRows.length;
  const columns: Column<OrderLineItem>[] = [
    {
      key: "number",
      label: "Number",
      render: (value, row) =>
        row.isTotalRow ? <strong>{value}</strong> : value,
    },
    { key: "category", label: "Category" },
    { key: "productName", label: "Product Name" },
    {
      key: "quantity",
      label: "Quantity",
      render: (value, row) =>
        row.isTotalRow ? <strong>{value}</strong> : value,
    },
    {
      key: "unitCost",
      label: "Unit Cost",
      render: (value, row) => {
        const formatted =
          typeof value === "number" ? formatCurrency(value) : value;

        return row.isTotalRow ? <strong>{formatted}</strong> : formatted;
      },
    },
    {
      key: "lineCost",
      label: "Line Cost",
      render: (value, row) => {
        const formatted =
          typeof value === "number" ? formatCurrency(value) : value;

        return row.isTotalRow ? <strong>{formatted}</strong> : formatted;
      },
    },
  ];
  const productRef = useRef<HTMLDivElement>(null);
  const vendorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        productRef.current &&
        !productRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }

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

  function handleNewSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsNewLoading(true);

    try {
      if (!selected) {
        toast.error("Please select a valid product.");
        return;
      }

      const quantity = Number(quant);
      const unitCost = Number(uPrice);

      if (quantity <= 0) {
        toast.error("Quantity must be greater than zero.");
        return;
      }

      if (unitCost <= 0) {
        toast.error("Unit price must be greater than zero.");
        return;
      }

      const newRow: OrderLineItem = {
        id: Date.now(),
        number: `${itemRows.length + 1}.`,
        category: selected.category,
        productName: selected.name,
        quantity,
        unitCost,
        lineCost: quantity * unitCost,
      };

      setItemRows((prev) => [...prev, newRow]);

      setItems((prev) => [
        ...prev,
        { productId: selected.id, quantity, unitPrice: unitCost },
      ]);

      setSearch("");
      setSelected(null);
      setQuant("");
      setUPrice("");

      closeModal();
    } finally {
      setIsNewLoading(false);
    }
  }

  async function handleAddOrder() {
    if (!vSelected) {
      toast.error("Please select a valid vendor.");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one product.");
      return;
    }

    const now = new Date();

    const supplyDateTime =
      `${supplyDate}T` +
      now.toTimeString().split(" ")[0] +
      `.${String(now.getMilliseconds()).padStart(3, "0")}`;

    setIsAddLoading(true);

    try {
      await addOrder({
        vendorId: vendorId,
        orderDate: supplyDateTime,
        orderItems: items,
      });

      toast.success("Order created successfully!");

      setItemRows([]);
      setPage(1);
      setItems([]);
      setVSelected(null);
      setVSearch("");
      setSupplyDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to create order.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occured.");
      }
    } finally {
      setIsAddLoading(false);
    }
  }

  function handleCancel() {
    setItemRows([]);
    setPage(1);
    setItems([]);
    setVSelected(null);
    setVSearch("");
    setSupplyDate(new Date().toISOString().split("T")[0]);
  }

  return (
    <div className="bg-[#F4F3F3] min-h-screen p-5 flex flex-col gap-5 overflow-x-hidden">
      {/* TOOL BAR */}
      <div className="p-5 flex items-end gap-5 bg-white rounded-lg">
        <Input
          className="date-input"
          label="Order Date"
          type="date"
          value={supplyDate}
          onChange={(e) => setSupplyDate(e.target.value)}
        />

        <div className="flex flex-col gap-[5px] justify-end">
          <div ref={vendorRef} className="flex relative">
            <Input
              type="text"
              label="Vendor"
              value={vSearch}
              placeholder="Search..."
              onFocus={() => setIsVOpen(true)}
              onChange={(e) => {
                setVSearch(e.target.value);
                setVSelected(null);
              }}
              id="drop-down"
              name="drop-down"
              className="w-full h-full input-field py-2 border"
            />
            <button type="button">
              {!isVOpen ? (
                <ChevronDown
                  className="w-[15px] h-[15px] absolute top-5/7 right-2.5 -translate-y-1/2"
                  onClick={() => setIsVOpen(true)}
                />
              ) : (
                <ChevronUp
                  className="w-[15px] h-[15px] absolute top-5/7 right-2.5 -translate-y-1/2"
                  onClick={() => setIsVOpen(false)}
                />
              )}
            </button>
            {isVOpen && (
              <div className="absolute left-0 top-full mt-1 w-full border rounded bg-white shadow max-h-60 overflow-y-auto">
                {filteredVendorOptions.length > 0 ? (
                  filteredVendorOptions.map((vOption) => (
                    <button
                      key={vOption.id}
                      type="button"
                      className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setVSelected(vOption);
                        setVSearch(vOption.name);
                        setVendorId(vOption.id);
                        setIsVOpen(false);
                      }}
                    >
                      {vOption.name}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">No results</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="line-items-section-card bg-white p-5 rounded-lg">
        <div className="line-items-header">
          <h2 className="line-items-title">Line Items</h2>

          <Button
            className="add-product-btn"
            onClick={() => {
              setAddModal(true);
            }}
          >
            <Plus size={16} />
            Add Product
          </Button>
        </div>

        <Table<OrderLineItem>
          data={paginatedData}
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
        />
      </div>

      <div className="order-actions-footer">
        <Button
          className="btn-cancel"
          onClick={handleCancel}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          className="btn-submit"
          variant="primary"
          onClick={handleAddOrder}
          disabled={isAddLoading}
        >
          Submit Order
        </Button>
      </div>

      {/* Add Modal */}
      {addModal && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-40"
            onClick={() => closeModal()}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="w-[412px] h-[414px] bg-white p-6 rounded-lg">
              <div className="flex justify-between">
                <h2 className="text-[#711460] font-bold font-700 text-[32px] mb-4">
                  Add Product
                </h2>
                <Button className="x-button" onClick={() => closeModal()}>
                  <X />
                </Button>
              </div>
              <form className="new-order-form" onSubmit={handleNewSubmit}>
                <label htmlFor="drop-down">Select Product</label>
                <div
                  ref={productRef}
                  className="relative form-input w-full h-[42px] rounded-[10px] border border-[#777376] rounded outline-none focus-within:border-[#711460] focus-within:border-2 px-2 bg-white flex items-center justify-between"
                >
                  <input
                    type="text"
                    value={search}
                    placeholder="Search..."
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelected(null);
                    }}
                    id="drop-down"
                    name="drop-down"
                    className="w-full h-full outline-none"
                  />
                  <button type="button">
                    {!isOpen ? (
                      <ChevronDown onClick={() => setIsOpen(true)} />
                    ) : (
                      <ChevronUp onClick={() => setIsOpen(false)} />
                    )}
                  </button>
                  {isOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full border rounded bg-white shadow max-h-60 overflow-y-auto">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                            onClick={() => {
                              setSelected(option);
                              setSearch(option.name);
                              setIsOpen(false);
                            }}
                          >
                            {option.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">
                          No results
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <label htmlFor="quantity">Quantity</label>
                <Input
                  type="number"
                  className="form-input"
                  id="quantity"
                  name="quantity"
                  value={quant}
                  onChange={(e) => setQuant(e.target.value)}
                ></Input>

                <label htmlFor="unit-price">Unit Price</label>
                <Input
                  type="number"
                  className="form-input"
                  id="unit-price"
                  name="unit-price"
                  value={uPrice}
                  onChange={(e) => setUPrice(e.target.value)}
                ></Input>
                <div className="w-full flex justify-end">
                  <Button
                    type="submit"
                    className="submit-btn"
                    disabled={isNewLoading}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
