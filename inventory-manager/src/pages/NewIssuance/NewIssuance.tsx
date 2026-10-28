import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import Card from "../../components/Card/Card";
import type { Column } from "../../components/Table/Table";
import Input from "../../components/Input/input";
import "./NewIssuance.css";
import { useProducts } from "../../hooks/useProduct";
import type { ProductUI } from "../../types/products.types";
import type { CreateIssuanceItemRequest } from "../../types/issuances.types";
import toast from "react-hot-toast";
import { useIssuances } from "../../hooks/useIssuances";

type IssuanceLineItem = {
  id: string | number;
  number: string | number;
  productName: string;
  barcode: string;
  serialNumber: string;
  isTotalRow?: boolean;
};

export default function NewIssuances() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [addModal, setAddModal] = useState(false);

  function closeModal() {
    setAddModal(false);
  }

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<ProductUI | null>(null);
  const [items, setItems] = useState<CreateIssuanceItemRequest[]>([]);

  const [isNewLoading, setIsNewLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);

  const { products } = useProducts(1, 100, "");
  const { addIsuance, loading } = useIssuances(1, 100, "");

  const [recipient, setRecipient] = useState("");
  const [notes, setNotes] = useState("");

  const options = products;

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

  const [barcode, setBarcode] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const [itemRows, setItemRows] = useState<IssuanceLineItem[]>([]);

  const totalItems = itemRows.length;
  const columns: Column<IssuanceLineItem>[] = [
    {
      key: "number",
      label: "Number",
      render: (value, row) =>
        row.isTotalRow ? <strong>{value}</strong> : value,
    },
    { key: "productName", label: "Product Name" },
    { key: "barcode", label: "Barcode" },
    {
      key: "serialNumber",
      label: "Serial Number",
    },
  ];
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        productRef.current &&
        !productRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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
      if (!barcode.trim()) {
        toast.error("Please enter the barcode.");
      }
      if (!serialNumber.trim()) {
        toast.error("Please enter the serial number.");
      }

      const newRow: IssuanceLineItem = {
        id: Date.now(),
        number: `${itemRows.length + 1}.`,
        productName: selected.name,
        barcode,
        serialNumber,
      };

      setItemRows((prev) => [...prev, newRow]);

      setItems((prev) => [
        ...prev,
        {
          productId: selected.id,
          barcode: barcode,
          serialNumber: serialNumber,
        },
      ]);

      setSearch("");
      setSelected(null);
      setBarcode("");
      setSerialNumber("");

      closeModal();
    } finally {
      setIsNewLoading(false);
    }
  }

  async function handleAddOrder() {
    if (!recipient.trim()) {
      toast.error("Please enter the Recipient's name.");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item.");
      return;
    }

    setIsAddLoading(true);

    try {
      await addIsuance({
        recipientName: recipient,
        notes: notes,
        items: items,
      });

      toast.success("Items issued successfully!");

      setItemRows([]);
      setPage(1);
      setItems([]);
      setRecipient("");
      setNotes("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Issuance failed. Please try again.";

        toast.error(message);
      } else {
        toast.error("An unexpected error occured");
      }
    } finally {
      setIsAddLoading(false);
    }
  }

  function handleCancel() {
    setItemRows([]);
    setPage(1);
    setItems([]);
    setRecipient("");
    setNotes("");
  }

  return (
    <div className="bg-[#F4F3F3] min-h-screen p-5 flex flex-col gap-5 overflow-x-hidden">
      {/* TOOL BAR */}
      <div className="p-5 flex items-end gap-5 bg-white rounded-lg">
        <Input
          className=""
          label="Recipient's Name"
          type="text"
          placeholder="name..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
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
            Add Item
          </Button>
        </div>

        <Table<IssuanceLineItem>
          data={itemRows}
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
      <Card className="lower-div-l4 inner-divs">
        <div className="card-header">
          <p className="text-[#777376] text-[0.6875rem] font-medium">
            NOTES (Optional)
          </p>
          <hr />
        </div>

        <textarea
          className="description-div"
          placeholder="Write Notes..."
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
          }}
        />
      </Card>
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
          Submit Issuance
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
                  Add Item
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
                <label htmlFor="quantity">Barcode</label>
                <Input
                  type="text"
                  className="form-input"
                  id="barcode"
                  name="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                ></Input>

                <label htmlFor="unit-price">Serial Number</label>
                <Input
                  type="text"
                  className="form-input"
                  id="serialNumber"
                  name="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
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
