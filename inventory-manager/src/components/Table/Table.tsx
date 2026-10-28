import React from "react";
import "./Table.css";
import Skeleton from "../SkeletonLoading/Skeleton";

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};


type TableProps<T extends { id: string | number }> = {
  data: T[];
  columns: Column<T>[];

  loading?: boolean;

  page: number;
  pageNum?: number; // API fallback support
  pageSize: number;
  totalItems: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  className?: string;
  renderMobileItem?: (row: T) => React.ReactNode;
  actionsRender?: (row: T) => React.ReactNode;
};

export default function Table<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  page,
  pageNum,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  renderMobileItem,
  actionsRender,
}: TableProps<T>) {
  const currentData = data || [];

  // single source of truth for pagination
  const activePage = pageNum ?? page;

  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / pageSize));

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-2xl bg-white shadow-sm">
      {/* TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-225 border-collapse">
          {/* HEADER */}
          <thead className="bg-[#711460] text-white text-nowrap">
            <tr className="text-left text-sm">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-6 py-4 font-medium">
                  {col.label}
                </th>
              ))}
              {actionsRender && <th className="px-6 py-4"></th>}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading
              ? [...Array(10)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-100 h-14">
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        <Skeleton width="100%" height="16px" />
                      </td>
                    ))}

                    {actionsRender && (
                      <td className="px-6 py-4">
                        <Skeleton width="20px" height="20px" />
                      </td>
                    )}
                  </tr>
                ))
              : currentData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 text-sm hover:bg-[#faf5fb] h-14"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-6 py-4 max-w-45 break-words whitespace-normal"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key] ?? "")}
                      </td>
                    ))}

                    {actionsRender && (
                      <td className="px-6 py-4 text-right">
                        {actionsRender(row)}
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="block md:hidden p-4 space-y-3">
        {currentData.map((row) =>
          renderMobileItem ? (
            <div key={row.id}>{renderMobileItem(row)}</div>
          ) : (
            <div key={row.id} className="p-4 border rounded-xl">
              <p className="text-sm">No Mobile layout found</p>
            </div>
          ),
        )}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-sm text-gray-500">
          {(activePage - 1) * pageSize + 1} -{" "}
          {Math.min(activePage * pageSize, totalItems || 0)} of {totalItems}{" "}
          items
        </p>

        {/* PAGINATION */}
        {totalItems > pageSize && (
          <div className="flex items-center gap-2">
            {/* PREV */}
            <button
              disabled={activePage === 1}
              onClick={() => onPageChange(activePage - 1)}
              className="h-9 w-9 rounded-lg border border-[#711460] text-[#711460] disabled:opacity-40"
            >
              {"<"}
            </button>

            {/* PAGE NUMBERS */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`h-9 w-9 rounded-lg ${
                  activePage === i + 1
                    ? "border border-[#711460] text-[#711460]"
                    : "border border-[#BFBFBF4D] text-[#111111]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* NEXT */}
            <button
              disabled={activePage === totalPages}
              onClick={() => onPageChange(activePage + 1)}
              className="h-9 w-9 rounded-lg border border-[#711460] text-[#711460] disabled:opacity-40"
            >
              {">"}
            </button>
          </div>
        )}

        {/* ITEMS PER PAGE */}
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-[#711460] px-3 py-2 text-sm text-[#711460] outline-none"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={5}>5 items</option>
            <option value={10}>10 items</option>
            <option value={16}>16 items</option>
          </select>
          <span className="perpage">Items per page</span>
        </div>
      </div>
    </div>
  );
}
