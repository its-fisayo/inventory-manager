import Card from "../../components/Card/Card";
import {
  CircleUserRound,
  Box,
  ArchiveX,
  ArchiveRestore,
  Wrench,
} from "lucide-react";
import "../DashBoard/Dashboard.css";
import { NavLink } from "react-router-dom";
export type Range = "l3m" | "l6m" | "l12m";
import { useProducts } from "../../hooks/useProduct";
import { useCategory } from "../../hooks/useCategory";
import { useBrand } from "../../hooks/useBrand";
import { useUsers } from "../../hooks/useUsers";
import { useStocks } from "../../hooks/useStocks";
import { useOrders } from "../../hooks/useOrder";
import { getUser } from "../../auth/getUser";

function Dashboard() {
  const { totalItems } = useProducts(1, 100, "");
  const { categories } = useCategory();
  const { brands } = useBrand();
  const oStocks = useStocks(1, 100, "", true);
  const { stocks } = useStocks(1, 100, "", false);
  const { orders } = useOrders(1, 100, "");
  const { users } = useUsers(1, 100, "");
  const {products} = useProducts(1, 100, "");
  const activeUser = getUser();

  const iStocks = stocks.length - oStocks.totalItems;
  const firstName = activeUser?.fullName?.split(" ")[0] || "";

  return (
    <div>
      <div className="flex-1">
        {/*Body*/}
        <div className="bg-[#EBEBEB] cards-body h-screen">
          <div className="h-[9.9375rem] pl-[1.5625rem] pr-[0.625rem] pt-[0.9375rem] overview1-div">
            <div className="flex justify-between">
              <p className="text-[#141414CC] text-[1.375rem] font-bold font-[700] pb-[0.3125rem]">
                Welcome, {firstName}
              </p>
            </div>

            {/*4 white cards*/}
            <div className="flex justify-between pr-[0.625rem] overview1-cards-div">
              <Card className="overview1">
                <NavLink to="/inventory/asset-management">
                  <div className="overview-1-inside">
                    <div className="w-[14.0625rem] h-[3.1875rem] flex justify-start items-center">
                      <Box
                        className="text-[#711460] w-[2.5rem] h-[2.5rem] mr-[1.0625rem]"
                        strokeWidth={1}
                      />
                      <div>
                        <h1 className="text-[#141414CC] text-[1.5rem] font-bold font-[700]">
                          {totalItems}
                        </h1>
                        <p>Total Products</p>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </Card>

              <Card className="overview1">
                <NavLink to="/supply-management/stocks">
                  <div className="overview-1-inside">
                    <div className="w-[14.0625rem] h-[3.1875rem] flex justify-start items-center">
                      <ArchiveX
                        className="text-[#711460] w-[2.5rem] h-[2.5rem] mr-[1.0625rem]"
                        strokeWidth={1}
                      />
                      <div>
                        <h1 className="text-[#141414CC] text-[1.5rem] font-bold font-[700]">
                          {oStocks.totalItems}
                        </h1>
                        <p>Out Of Stock</p>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </Card>

              <Card className="overview1">
                <NavLink to="/supply-management/stocks">
                  <div className="overview-1-inside">
                    <div className="w-[14.0625rem] h-[3.1875rem] flex justify-start items-center">
                      <ArchiveRestore
                        className="text-[#711460] w-[2.5rem] h-[2.5rem] mr-[1.0625rem]"
                        strokeWidth={1}
                      />
                      <div>
                        <h1 className="text-[#141414CC] text-[1.5rem] font-bold font-[700]">
                          {iStocks}
                        </h1>
                        <p>In Stock</p>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </Card>

              <Card className="overview1">
                <NavLink to="/supply-management/orders">
                  <div className="overview-1-inside">
                    <div className="w-[14.0625rem] h-[3.1875rem] flex justify-start items-center">
                      <Wrench
                        className="text-[#711460] w-[2.5rem] h-[2.5rem] mr-[1.0625rem]"
                        strokeWidth={1}
                      />
                      <div>
                        <h1 className="text-[#141414CC] text-[1.5rem] font-bold font-[700]">
                          {orders.length}
                        </h1>
                        <p>Total Orders</p>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </Card>
            </div>
          </div>

          {/*second row of cards*/}
          <div className="h-[17.25rem] w-full pl-[1.5625rem] pt-[1rem] flex justify-between gap-5 pr-[0.625rem] overview-div2">
            {/* number of users card */}
            <Card className="overview2-1">
              <NavLink to="/user-management">
                <div className="overview-2-inside">
                  <p className="text-[#141414CC] text-[1rem] font-bold font-[700]">
                    No. of Users
                  </p>
                  <div className="h-[9.375rem] flex flex-col justify-around items-center mb-[1.25rem]">
                    <CircleUserRound className="text-[#711460] w-12 h-12" />
                    <h1 className="text-[#141414CC] text-[2rem] font-bold font-[900]">
                      {users.length}
                    </h1>
                    <p className="text-[#711460] text-[0.9375rem] font-regular font-[400]">
                      Total Users
                    </p>
                  </div>
                </div>
              </NavLink>
            </Card>

            {/*Brands card*/}
            <Card className="overview2-3 overflow-hidden">
              <NavLink to="/inventory/asset-management">
                <div className="overview-2-3-inside">
                  <p className="text-[#711460] text-[1rem] font-bold font-[700] mb-[0.875rem]">
                    BRANDS
                  </p>

                  <div className="request-bar-out">
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <div className="request-text-bars" key={brand.id}>
                          <p className="request-text">{brand.name}</p>
                        </div>
                      ))
                    ) : (
                      <div className="request-text-bars">No Brands</div>
                    )}
                  </div>
                </div>
              </NavLink>
            </Card>

            <Card className="overview2-2">
              <NavLink to="/inventory/asset-management">
                <div className="overview-2-2-inside">
                  <p className="text-[#141414CC] text-[1rem] font-bold font-[700] mb-[0.875rem]">
                    PRODUCTS
                  </p>
                 <div className="request-bar-out">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <div className="request-text-bars" key={product.id}>
                          <p className="request-text">{product.name}</p>
                        </div>
                      ))
                    ) : (
                      <div className="request-text-bars">No Products</div>
                    )}
                  </div>
                </div>
              </NavLink>
            </Card>

            {/*Categories card*/}
            <Card className="overview2-3 overflow-hidden">
              <NavLink to="/inventory/asset-management">
                <div className="overview-2-3-inside">
                  <p className="text-[#711460] text-[1rem] font-bold font-[700] mb-[0.875rem]">
                    CATEGORIES
                  </p>

                  <div className="request-bar-out">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <div className="request-text-bars" key={category.id}>
                          <p className="request-text">{category.name}</p>
                        </div>
                      ))
                    ) : (
                      <div className="request-text-bars">No Categories</div>
                    )}
                  </div>
                </div>
              </NavLink>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
