import axios from "axios";
import { useMemo, useState } from "react";
import "./Issuance.css";
import Input from "../../components/Input/input";
import { Search, ListFilter } from "lucide-react";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import type { Column } from "../../components/Table/Table";
import { useIssuances } from "../../hooks/useIssuances";
import { useDebounce } from "../../hooks/useDebounce";
import type { IssuanceUI, IssuanceDTO } from "../../types/issuances.types";
import toast from "react-hot-toast";

function Issuance() {
  const [sortModal, setSortModal] = useState(false);
  const [sortBy, setSortBy] = useState<
    "Recipient's Name" | "Issuer's Name" | "Issue Date" | null
  >(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [selectedIssuance, setSelectedIssuance] = useState<IssuanceDTO | null>(
    null,
  );
  const [isModalLoading, setIsModalLoading] = useState(false);
  const { fetchIssuanceById, issuances, totalItems, loading } = useIssuances(
    page,
    pageSize,
    debouncedSearch,
  );

  function formatLocalDate(dateString: string): string {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  const columns: Column<IssuanceUI>[] = [
    { key: "recipientName", label: "Recipient" },
    { key: "issuedByUserName", label: "Issuer" },
    {
      key: "issuedAt",
      label: "Issue Date",
      render: (value) => formatLocalDate(String(value)),
    },
    { key: "totalItems", label: "No. of Items" },
  ];

  const sortedIssuances = useMemo(() => {
    const sorted = [...issuances];

    switch (sortBy) {
      case "Recipient's Name":
        sorted.sort((a, b) => a.recipientName.localeCompare(b.recipientName));
        break;

      case "Issuer's Name":
        sorted.sort((a, b) =>
          a.issuedByUserName.localeCompare(b.issuedByUserName),
        );
        break;

      case "Issue Date":
        sorted.sort(
          (a, b) =>
            new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime(),
        );
        break;
    }

    return sorted;
  }, [issuances, sortBy]);

  const handleViewIssuance = async (issuance: IssuanceUI) => {
    try {
      setIsModalLoading(true);

      const fullIssuance = await fetchIssuanceById(issuance.id);

      setSelectedIssuance(fullIssuance);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to fetch issuance details.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occured.");
      }
    } finally {
      setIsModalLoading(false);
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
            placeholder="Search..."
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

          <div className="absolute top-[140px] left-[850px] z-50 w-[250px] bg-white rounded-[10px] shadow-lg p-2">
            <button
              className="w-full text-left p-2 flex justify-between btnn"
              onClick={() => {
                setSortBy("Recipient's Name");
                setSortModal(false);
              }}
            >
              Sort by Recipient's Name
            </button>

            <button
              className="w-full text-left p-2 flex justify-between btnn"
              onClick={() => {
                setSortBy("Issuer's Name");
                setSortModal(false);
              }}
            >
              Sort by Issuer's Name
            </button>

            <button
              className="w-full text-left p-2 flex justify-between btnn"
              onClick={() => {
                setSortBy("Issue Date");
                setSortModal(false);
              }}
            >
              Sort by Issue Date
            </button>
          </div>
        </>
      )}

      {/* TABLE */}
      <div className="overflow-visible">
        <Table<IssuanceUI>
          data={sortedIssuances}
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
          actionsRender={(issuance) => (
            <div className="flex items-center gap-2 justify-end">
              <button
                className="text-sm text-[#141414CC] font-medium border border-[#711460] px-4 py-2.5 rounded-lg cursor-pointer"
                onClick={() => void handleViewIssuance(issuance)}
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
          onClick={() => setSelectedIssuance(null)}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <p className="rounded-lg bg-white p-5">
              Loading issuance details...
            </p>
          </div>
        </div>
      )}
      {selectedIssuance && (
        <div
          className="fixed inset-0 bg-black/80 z-40"
          onClick={() => setSelectedIssuance(null)}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
              {/* Scrollable Container */}
              <div className="p-6 overflow-y-auto max-h-[80vh] space-y-5">
                {/* Info Details Form Fields */}
                <h1 className="text-[#711460]">ISSUANCE DETAILS</h1>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedIssuance.recipientName}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Issuer
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedIssuance.issuesByUserName}
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
                        value={selectedIssuance.totalItems}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Issued At
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formatLocalDate(selectedIssuance.issuedAt)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden shadow-2xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">
                      Notes
                    </label>
                    <textarea
                      readOnly
                      value={selectedIssuance.notes}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">
                      Description
                    </label>

                    {/* Issuance Items */}
                    <div className="space-y-3 pt-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Issuance Items
                      </h3>

                      {selectedIssuance.items?.length ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left border-collapse">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600">
                                <th className="px-3 py-2">Product Name</th>
                                <th className="px-3 py-2">Barcode</th>
                                <th className="px-3 py-2">Serial Number</th>
                              </tr>
                            </thead>

                            <tbody>
                              {selectedIssuance.items.map((item) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-gray-200"
                                >
                                  <td className="px-3 py-3">
                                    {item.productName}
                                  </td>

                                  <td className="px-3 py-3">{item.barcode}</td>

                                  <td className="px-3 py-3">
                                    {item.serialNumber}
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
                onClick={() => setSelectedIssuance(null)}
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

export default Issuance;
