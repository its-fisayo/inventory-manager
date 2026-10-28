import { useMemo, useState, useRef, useEffect } from "react";
import "./AssetManagement.css";
import Table from "../../components/Table/Table";
import type { Column } from "../../components/Table/Table";
import { Search, ListFilter, Plus, CloudDownload } from "lucide-react";
import Input from "../../components/Input/input";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProduct";
import { useDebounce } from "../../hooks/useDebounce";
import { useFiles } from "../../hooks/useFile";
import type { FileDTO } from "../../types/file.types";
import axios from "axios";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  // Mock tracking fields requested by the visual structure
  productAmount?: number;
  noIssued?: number;
  availUnit?: number;
  imageUrls?: string[];
};

export default function AssetManagement() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { fetchFilesByProductId } = useFiles();
  const { products, totalItems, loading } = useProducts(
    page,
    pageSize,
    debouncedSearch,
  );

  // Modal tracking state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortModal, setSortModal] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "category" | "brand" | null>(
    null,
  );
  const [productImages, setProductImages] = useState<FileDTO[]>([]);
  const [activeImage, setActiveImage] = useState<FileDTO | null>(null);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesError, setImagesError] = useState("");
  const columns: Column<Product>[] = [
    { key: "name", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "brand", label: "Brand" },
  ];

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "category":
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;

      case "brand":
        sorted.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
    }

    return sorted;
  }, [products, sortBy]);

  const sortModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortModalRef.current &&
        !sortModalRef.current.contains(event.target as Node)
      ) {
        setSortModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExport = () => {
    if (!products.length) return;

    const headers = ["Product Name", "Category", "Brand"];

    const rows = products.map((product) => [
      product.name,
      product.category,
      product.brand,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const API_BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost:5271";

  function getImageUrl(filePath: string): string {
    if (/^https?:\/\//i.test(filePath)) {
      return filePath;
    }

    return `${API_BASE_URL.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`;
  }

  const handleViewProduct = async (product: Product) => {
    setSelectedProduct(product);
    setProductImages([]);
    setActiveImage(null);
    setImagesError("");
    setImagesLoading(true);

    try {
      const images = await fetchFilesByProductId(product.id);

      setProductImages(images);
      setActiveImage(images[0] ?? null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to fetch product images.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occured.");
      }
      setImagesError("Unable to load product images.");
    } finally {
      setImagesLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F3F3] min-h-screen p-5 flex flex-col gap-5">
      {/* TOOLBAR */}
      <div>
        <div className="flex items-center justify-between gap-6">
          {/* Search */}
          <div className="flex relative sm:w-[350px]">
            <Search className="text-[#711460] w-[15px] h-[15px] absolute top-1/2 left-2.5 -translate-y-1/2" />
            <Input
              className="pl-7 py-2 border input-field"
              placeholder="Search by name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={sortModalRef}>
              <Button
                className="btn1 flex items-center gap-2 px-4 py-2"
                onClick={() => setSortModal((prev) => !prev)}
              >
                <ListFilter className="w-4 h-4" />
                Sort By
              </Button>

              {sortModal && (
                <div className="absolute top-12 right-0 w-48 bg-white shadow-lg rounded-lg border z-50">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSortBy("name");
                      setSortModal(false);
                    }}
                  >
                    Sort by Name
                  </button>

                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSortBy("category");
                      setSortModal(false);
                    }}
                  >
                    Sort by Category
                  </button>

                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSortBy("brand");
                      setSortModal(false);
                    }}
                  >
                    Sort by Brand
                  </button>
                </div>
              )}
            </div>

            <Button
              className="btn1 flex items-center px-7"
              onClick={handleExport}
            >
              <CloudDownload className="w-[15px] h-[15px]" />
              Export
            </Button>

            <Link to="/inventory/new-product">
              <Button className="bn2 flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                <Plus className="w-4 h-4" />
                Add New Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div>
        <Table<Product>
          data={Array.isArray(sortedProducts) ? sortedProducts : []}
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
          actionsRender={(asset) => (
            <div className="relative">
              <button
                className="text-sm text-[#141414CC] font-medium border border-[#711460] px-4 py-2.5 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                onClick={() => void handleViewProduct(asset)}
              >
                View
              </button>
            </div>
          )}
        />
      </div>

      {/* DETAILED PRODUCT VIEW MODAL */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
            {/* Scrollable Container */}
            <div className="p-6 overflow-y-auto max-h-[80vh] space-y-5">
              {/* Main Display Feature Image */}

              {/* Main product image */}
              <div className="aspect-[4/3] rounded-xl border bg-gray-50 flex items-center justify-center overflow-hidden">
                {imagesLoading ? (
                  <p className="text-gray-500">Loading images...</p>
                ) : activeImage ? (
                  <img
                    src={getImageUrl(activeImage.filePath)}
                    alt={activeImage.fileName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500">
                    {imagesError || "No images available for this product."}
                  </p>
                )}
              </div>

              {/* Image thumbnails */}
              {!imagesLoading && productImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      title={image.fileName}
                      className={`aspect-square rounded-lg border p-1 ${
                        activeImage?.id === image.id
                          ? "border-[#711460] ring-1 ring-[#711460]"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={getImageUrl(image.filePath)}
                        alt={image.fileName}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Info Details Form Fields */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedProduct.name}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedProduct.category}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedProduct.brand}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden shadow-2xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedProduct.description}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-[15px] focus:outline-hidden font-medium shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="bg-gray-50/50 px-6 py-4 flex justify-end border-t border-gray-100">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-[#711460] hover:bg-[#590f4b] text-white font-bold px-8 py-2.5 rounded-xl transition duration-150 active:scale-98 shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
