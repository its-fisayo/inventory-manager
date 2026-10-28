import { useMemo, useState } from "react";
import "./stockMovement.css";
import Input from "../../components/Input/input";
import { ListFilter, Search } from "lucide-react";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import type { Column } from "../../components/Table/Table";
import { useSTockMovements } from "../../hooks/useStockMovement";
import { useDebounce } from "../../hooks/useDebounce";
import type { StockMovementUI } from "../../types/stocks.types";

export default function StockMovement() {
  const [sortModal, setSortModal] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "movementType" | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { stockMovements, totalItems, loading } = useSTockMovements(
    page,
    pageSize,
    debouncedSearch,
  );

  const columns: Column<StockMovementUI>[] = [
    { key: "productName", label: "Name" },
    { key: "quantityChange", label: "Quantity Change" },
    { key: "movementType", label: "Movement Type" },
    { key: "orderNumber", label: "Order No" },
    { key: "recipientName", label: "Recipient" },
    { key: "performedByUserName", label: "Performed By" },
    {
      key: "createdAt",
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

  const sortedMovements = useMemo(() => {
    const sorted = [...stockMovements];

    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        break;

      case "movementType":
        sorted.sort((a, b) => a.movementType.localeCompare(b.movementType));
        break;
    }
    return sorted;
  }, [stockMovements, sortBy]);

  return (
    <div className="bg-[#f3f3f3] min-h-screen p-5 flex flex-col gap-5">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
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

        <div className="flex">
          <Button
            className="btn1 btn-border"
            onClick={() => setSortModal(true)}
          >
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

          <div className="absolute top-[140px] left-[850px] z-50 w-[250px] bg-white rounded-[10px] shadow-lg p-2">
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
                setSortBy("movementType");
                setSortModal(false);
              }}
            >
              Sort by Movement Type
            </button>
          </div>
        </>
      )}

      {/* TABLE */}
      <div>
        <Table<StockMovementUI>
          data={sortedMovements}
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
    </div>
  );
}
