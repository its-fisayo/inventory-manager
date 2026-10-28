import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import "./Stocks.css";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/input";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  X,
} from "lucide-react";
import type { Column } from "../../components/Table/Table";
import { useStocks } from "../../hooks/useStocks";
import { useDebounce } from "../../hooks/useDebounce";
import type { CategoryUI } from "../../types/category.types";
import { useCategory } from "../../hooks/useCategory";
import type { StocksUI } from "../../types/stocks.types";
import toast from "react-hot-toast";

function Stocks() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { editStockThreshold, stocks, totalItems, loading } = useStocks(
    page,
    pageSize,
    debouncedSearch,
    false,
  );
  const { categories } = useCategory();

  const [menuStockId, setMenuStockId] = useState<string | number | null>(null);
  const [selectedStock, setSelectedStock] = useState<StocksUI | null>(null);
  const [newThreshold, setNewThreshold] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [cSearch, setCSearch] = useState("");
  const [isCOpen, setIsCOpen] = useState(false);
  const [cSelected, setCSelected] = useState<CategoryUI | null>(null);
  const categoryOptions = categories;

  const filteredCategoryOptions = categoryOptions.filter((categoryOption) =>
    categoryOption.name.toLowerCase().includes(cSearch.toLowerCase()),
  );

  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const tableData = stocks.map((stock, index) => ({
    ...stock,
    sn: (page - 1) * pageSize + index + 1,
  }));

  const columns: Column<StocksUI>[] = [
    { key: "productName", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "brand", label: "Brand" },
    { key: "quantityAvailable", label: "Quantity" },
    { key: "lowStockThreshold", label: "Low Stock Threshold" },
    {
      key: "isLowStock",
      label: "Status",
      render: (value, stock) => {
        if (stock.quantityAvailable === 0) {
          return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              Out of Stock
            </span>
          );
        }
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              value === true
                ? "bg-orange-100 text-orange-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {value === true ? "Low Stock" : "In Stock"}
          </span>
        );
      },
    },
  ];

  const displayedStocks = useMemo(() => {
    let result = tableData;

    if (cSelected) {
      result = result.filter((stock) => stock.category === cSelected.name);
    }

    return result;
  }, [tableData, cSelected]);

  const handleSaveThreshold = async () => {
    if (
      !selectedStock ||
      !Number.isInteger(newThreshold) ||
      newThreshold <= 0
    ) {
      toast.error("Enter a valid positive whole number.");
      return;
    }

    try {
      setIsSaving(true);
      await editStockThreshold({
        id: selectedStock.productId,
        data: { lowStockThreshold: newThreshold },
      });
      toast.success("Low stock threshold updated successfully.");
      setSelectedStock(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to update threshold. Please try again.";
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
      <div className="bg-white flex gap-[20px] pl-[20px] py-[20px] rounded-xl">
        <div className="search-category">
          <h3>Search</h3>
          <div className="flex relative">
            <Search className="text-[#711460] w-[15px] h-[15px] absolute top-1/2 left-2.5 -translate-y-1/2" />
            <Input
              className="w-[270px] pl-7 py-2 border categories"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="search-category">
          <div className="flex-1">
            <label className="product-name">Category</label>

            <div
              ref={categoryRef}
              className="relative drop-down bg-white flex items-center justify-between"
            >
              <input
                type="text"
                value={cSearch}
                placeholder="Search..."
                onFocus={() => setIsCOpen(true)}
                onChange={(e) => {
                  setCSearch(e.target.value);
                  setCSelected(null);
                }}
                className="w-full h-full outline-none"
              />

              <button type="button">
                {isCOpen ? (
                  <ChevronUp onClick={() => setIsCOpen(false)} />
                ) : (
                  <ChevronDown onClick={() => setIsCOpen(true)} />
                )}
              </button>

              {isCOpen && (
                <div className="absolute left-0 top-full mt-1 z-20 w-full border rounded bg-white shadow max-h-60 overflow-y-auto">
                  {filteredCategoryOptions.length > 0 ? (
                    filteredCategoryOptions.map((categoryOption) => (
                      <button
                        key={categoryOption.id}
                        type="button"
                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          setCSelected(categoryOption);
                          setCSearch(categoryOption.name);
                          setIsCOpen(false);
                        }}
                      >
                        {categoryOption.name}
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
      </div>

      {/* TABLE */}
      <Table<StocksUI>
        data={displayedStocks}
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
        actionsRender={(stock) => (
          <div className="relative flex justify-center">
            <button
              type="button"
              aria-label={`Actions for ${stock.productName}`}
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={() =>
                setMenuStockId((current) =>
                  current === stock.id ? null : stock.id,
                )
              }
            >
              <MoreHorizontal size={20} />
            </button>

            {menuStockId === stock.id && (
              <div className="absolute right-0 top-full z-30 mt-1 w-64 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setSelectedStock(stock);
                    setNewThreshold(stock.lowStockThreshold);
                    setMenuStockId(null);
                  }}
                >
                  Edit low stock threshold
                </button>
              </div>
            )}
          </div>
        )}
      />
      {selectedStock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedStock(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="edit-threshold-title"
                className="text-xl font-semibold text-[#3D0B34]"
              >
                Edit low stock threshold
              </h2>

              <button
                type="button"
                className="rounded-lg p-2 hover:bg-gray-100"
                onClick={() => setSelectedStock(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 space-y-1">
              <p className="text-sm text-gray-500">Product Stock</p>
              <p className="font-medium text-gray-900">
                {selectedStock.productName}
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="low-stock-threshold"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Low stock threshold
              </label>

              <input
                id="low-stock-threshold"
                type="number"
                min="1"
                step="1"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 outline-none focus:border-[#711460] focus:ring-1 focus:ring-[#711460]"
                value={newThreshold}
                onChange={(e) => {
                  setNewThreshold(Number(e.target.value));
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isSaving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setSelectedStock(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isSaving ||
                  newThreshold <= 0 ||
                  newThreshold === selectedStock?.lowStockThreshold
                }
                className="rounded-lg bg-[#711460] px-5 py-2 text-sm font-medium text-white hover:bg-[#5d0e4f] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  handleSaveThreshold();
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

export default Stocks;
