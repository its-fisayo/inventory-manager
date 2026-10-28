import axios from "axios";
import "../NewProduct/newProduct.css";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/input";
import Button from "../../components/Button/Button";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  ImageUp,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCategory } from "../../hooks/useCategory";
import { useBrand } from "../../hooks/useBrand";
import type { CategoryUI } from "../../types/category.types";
import type { BrandUI } from "../../types/brand.types";
import { useProducts } from "../../hooks/useProduct";
import { useFiles } from "../../hooks/useFile";

export default function Information() {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { categories, addCategory } = useCategory();
  const { brands, addBrand } = useBrand();
  const { addProduct } = useProducts(1, 10, "");
  const { uploadFile, isUploading } = useFiles();

  const [bSearch, setBSearch] = useState("");
  const [cSearch, setCSearch] = useState("");
  const [isCOpen, setIsCOpen] = useState(false);
  const [isBOpen, setIsBOpen] = useState(false);
  const [cSelected, setCSelected] = useState<CategoryUI | null>(null);
  const [bSelected, setBSelected] = useState<BrandUI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const categoryOptions = categories;
  const brandOptions = brands;

  const [bName, setBName] = useState("");
  const [cName, setCName] = useState("");
  const [isBLoading, setIsBLoading] = useState(false);
  const [isCLoading, setIsCLoading] = useState(false);
  const [addBModal, setAddBModal] = useState(false);
  const [addCModal, setAddCModal] = useState(false);

  function closeBModal() {
    setAddBModal(false);
  }

  function closeCModal() {
    setAddCModal(false);
  }

  const filteredCategoryOptions = categoryOptions.filter((categoryOption) =>
    categoryOption.name.toLowerCase().includes(cSearch.toLowerCase()),
  );
  const filteredBrandOptions = brandOptions.filter((brandOption) =>
    brandOption.name.toLowerCase().includes(bSearch.toLowerCase()),
  );

  const categoryRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProductData, setNewProductData] = useState({
    name: "",
    brandId: "",
    categoryId: "",
    description: "",
  });

  useEffect(() => {
    // Create URLs only when the images array actually changes
    const newUrls = images.map((img) => URL.createObjectURL(img));
    setImageUrls(newUrls);

    // Cleanup function: Revoke old URLs when images change or component unmounts
    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCOpen(false);
      }

      if (
        brandRef.current &&
        !brandRef.current.contains(event.target as Node)
      ) {
        setIsBOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleNewBrand(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsBLoading(true);
    try {
      if (!bName.trim()) {
        toast.error("Please enter a brand name.");
        return;
      }
      await addBrand({ name: bName });
      setBName("");
      setAddBModal(false);
      setIsBLoading(false);
      toast.success("Brand created successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Adding brand failed.";

        toast.error(message);
      } else {
        toast.error("An unexpected error occured.");
      }
    }
  }

  async function handleNewCategory(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsCLoading(true);
    try {
      if (!cName.trim()) {
        toast.error("Please enter a category name.");
        return;
      }
      await addCategory({ name: cName });
      setCName("");
      setAddCModal(false);
      setIsCLoading(false);
      toast.success("Category created successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Adding category failed.";

        toast.error(message);
      } else {
        toast.error("An unexpected error occured.");
      }
    }
  }

  async function handleAddProduct(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newProductData.name.trim()) {
      toast.error("Please enter a product name.");
      return;
    }
    if (!cSelected) {
      toast.error("Please select a valid category.");
      return;
    }
    if (!bSelected) {
      toast.error("Please select a valid brand.");
      return;
    }
    if (!newProductData.description.trim()) {
      toast.error("Please enter a product description.");
      return;
    }
    if (images.length < 1) {
      toast.error("Please upload some images.");
      return;
    }
    setIsLoading(true);

    try {
      const productPayload = {
        ...newProductData,
        name: newProductData.name.trim(),
        description: newProductData.description.trim(),
        categoryId: cSelected.id,
        brandId: bSelected.id,
      };
      const createdProduct = await addProduct(productPayload);

      const productId = createdProduct.id;
      if (images.length > 0) {
        await Promise.all(
          images.map((image) =>
            uploadFile({
              productId: productId,
              file: image,
            }),
          ),
        );
      }
      toast.success("Product successfully added");
      handleDiscard();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Adding product failed";

        toast.error(message);
      } else {
        toast.error("An unexpected error occured.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleDiscard() {
    setNewProductData({
      name: "",
      brandId: "",
      categoryId: "",
      description: "",
    });
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setBSearch("");
    setCSearch("");
    setCSelected(null);
    setBSelected(null);
  }
  return (
    <div className="bg-[#EBEBEB] min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full mb-8">
        <div className="flex gap-3 w-90 ml-auto">
          <Button
            onClick={() => {
              setAddBModal(true);
            }}
          >
            Add Brand
          </Button>
          <Button onClick={() => {
            setAddCModal(true);
          }}>Add Category</Button>
        </div>
      </div>
      <form onSubmit={handleAddProduct} className="max-w-[1400px] mx-auto">
        <div className="flex justify-between text-[20px] text-[#141414CC]">
          <button type="button" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-6 h-6 cursor-pointer text-[#7d126d] stroke-[3]" />
          </button>
          <div className="w-[360px] img-gallery">
            <h1>Asset Image Gallery</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="lower-div-l flex-1">
            <Card className="lower-div-l1 inner-divs">
              <div className="card-header">
                <p className="text-[#777376] text-[0.6875rem] font-medium">
                  CORE DETAILS
                </p>
                <hr />
              </div>

              <div className="mt-[1.375rem]">
                <h2 className="product-name">Product Name</h2>

                <Input
                  className="product-input"
                  placeholder="e.g MacBook Air M1 (13.3 inches,2020)"
                  value={newProductData.name}
                  onChange={(e) => {
                    setNewProductData({
                      ...newProductData,
                      name: e.target.value,
                    });
                  }}
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-6 mt-[1.375rem]">
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
                        setNewProductData((prev) => ({
                          ...prev,
                          categoryId: "",
                        }));
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
                                setNewProductData({
                                  ...newProductData,
                                  categoryId: categoryOption.id,
                                });
                                setCSearch(categoryOption.name);
                                setIsCOpen(false);
                              }}
                            >
                              {categoryOption.name}
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
                </div>

                <div className="flex-1">
                  <label className="product-name">Brand Name</label>

                  <div
                    ref={brandRef}
                    className="relative drop-down bg-white flex items-center justify-between"
                  >
                    <input
                      type="text"
                      value={bSearch}
                      placeholder="Search..."
                      onFocus={() => setIsBOpen(true)}
                      onChange={(e) => {
                        setBSearch(e.target.value);
                        setBSelected(null);
                        setNewProductData((prev) => ({
                          ...prev,
                          brandId: "",
                        }));
                      }}
                      className="w-full h-full outline-none"
                    />

                    <button type="button">
                      {isBOpen ? (
                        <ChevronUp onClick={() => setIsBOpen(false)} />
                      ) : (
                        <ChevronDown onClick={() => setIsBOpen(true)} />
                      )}
                    </button>

                    {isBOpen && (
                      <div className="absolute left-0 top-full mt-1 z-20 w-full border rounded bg-white shadow max-h-60 overflow-y-auto">
                        {filteredBrandOptions.length > 0 ? (
                          filteredBrandOptions.map((brandOption) => (
                            <button
                              key={brandOption.id}
                              type="button"
                              className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                              onClick={() => {
                                setBSelected(brandOption);
                                setBSearch(brandOption.name);
                                setNewProductData({
                                  ...newProductData,
                                  brandId: brandOption.id,
                                });
                                setIsBOpen(false);
                              }}
                            >
                              {brandOption.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2">No results</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="lower-div-l4 inner-divs">
              <div className="card-header">
                <p className="text-[#777376] text-[0.6875rem] font-medium">
                  DESCRIPTION
                </p>
                <hr />
              </div>

              <textarea
                className="description-div"
                placeholder="Write Description..."
                value={newProductData.description}
                onChange={(e) => {
                  setNewProductData({
                    ...newProductData,
                    description: e.target.value,
                  });
                }}
              />
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className=" w-full lg:max-w-[360px]">
            <div className="w-[360px] text-[20px] text-[#141414CC] mb-4 opp-img-gallery">
              <h1>Asset Image Gallery</h1>
            </div>

            <Card className="lower-div-r1 inner-divs">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  id="picture-upload"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;

                    if (!files) return;

                    const newImages = Array.from(files).filter((file) =>
                      file.type.startsWith("image/"),
                    );

                    setImages((prev) => {
                      const combined = [...prev, ...newImages];

                      const uniqueImages = combined.filter(
                        (file, index, allFiles) =>
                          allFiles.findIndex(
                            (item) =>
                              item.name === file.name &&
                              item.size === file.size &&
                              item.lastModified === file.lastModified,
                          ) === index,
                      );
                      if (uniqueImages.length > 4) {
                        toast.error("You can upload a maximum of 4 images.");
                      }
                      return uniqueImages.slice(0, 4);
                    });

                    e.target.value = "";
                  }}
                />

                <label htmlFor="picture-upload">
                  <Card className="right-inner-divs cursor-pointer">
                    <div className="flex flex-col justify-center items-center">
                      <ImageUp className="text-[#711460]" />
                      <p>Select your images here</p>
                    </div>
                  </Card>
                </label>
              </div>

              <div className="picture-slots-div mt-4">
                {[0, 1, 2, 3].map((index) => (
                  <Card key={index} className="right-inner-bottom">
                    {imageUrls[index] && (
                      <img
                        src={imageUrls[index]}
                        alt=""
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <Button type="button" className="discard-btn" onClick={handleDiscard}>
            Discard
          </Button>

          <Button
            type="submit"
            disabled={isLoading || isUploading}
            className="save-btn"
          >
            <Check />
            {isLoading || isUploading ? "Saving" : "Save"}
          </Button>
        </div>
      </form>

      {/* Add Brand Modal */}
      {addBModal && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-40"
            onClick={() => closeBModal()}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="w-[412px] h-[250px] bg-white p-6 rounded-lg">
              <div className="flex justify-between">
                <h2 className="text-[#711460] font-bold font-700 text-[32px] mb-4">
                  Add Brand
                </h2>
                <Button className="x-button" onClick={() => closeBModal()}>
                  <X />
                </Button>
              </div>
              <form className="new-order-form" onSubmit={handleNewBrand}>
                <label htmlFor="quantity">Brand Name</label>
                <Input
                  type="text"
                  className="form-input"
                  id="bName"
                  name="bName"
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                ></Input>
                <div className="w-full flex justify-end">
                  <Button
                    type="submit"
                    className="submit-btn"
                    disabled={isBLoading}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Add Category Modal */}
      {addCModal && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-40"
            onClick={() => closeCModal()}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="w-[412px] h-[250px] bg-white p-6 rounded-lg">
              <div className="flex justify-between">
                <h2 className="text-[#711460] font-bold font-700 text-[32px] mb-4">
                  Add Category
                </h2>
                <Button className="x-button" onClick={() => closeCModal()}>
                  <X />
                </Button>
              </div>
              <form className="new-order-form" onSubmit={handleNewCategory}>
                <label htmlFor="quantity">Category Name</label>
                <Input
                  type="text"
                  className="form-input"
                  id="cName"
                  name="cName"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                ></Input>
                <div className="w-full flex justify-end">
                  <Button
                    type="submit"
                    className="submit-btn"
                    disabled={isCLoading}
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
