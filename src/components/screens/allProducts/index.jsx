import "./styles.scss";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserDispatchContext } from "../../context/userProvider.jsx";
import Footer from "../../footer/index.jsx";
import Header from "../../header/index.jsx";
import { getMediaFile } from "../../../utilities/utili";
import ProductsView from "../../products/ProductsView.jsx"

const AllProducts = ({ product_categories_json }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const { category_id } = location.state || "";
  const [singleProductData, setSingleProductData] = useState({});
  const [currentCategory, setCurrentCategory] = useState("");
  const [quantity, setQuantity] = useState(1);

  const setCart = useContext(UserDispatchContext);
  useEffect(() => {
    if (category_id) {
      setCurrentCategory(category_id);
    }
  }, [category_id]);

  const handleChangeCategory = (categoryId) => {
    setCurrentCategory(parseInt(categoryId));
  };

  const handleCloseModal = () => {
    setSingleProductData({});
    setQuantity(1);
  };

  return (
    <div>
      <Header pathname={pathname} />
      <div className="pb-14 pt-5 mt-20 bg-white products">
        <div className="container mx-auto">
          <section>
            <div className="container mx-auto product-cards">
              <div className="text-center py-3">
                <h3 className="text-4xl font-bold mb-8 relative main-h">
                  Products
                </h3>
              </div>
              {product_categories_json && !!product_categories_json.length > 1 && (
                <div className="text-right">
                  <select
                    defaultValue={category_id}
                    onChange={(e) => handleChangeCategory(e.target.value)}
                    className="w-44 input-style mb-2 ml-auto border-2 border-black"
                  >
                    <option value="">All products</option>
                    {product_categories_json && product_categories_json.map((category, idx) => (
                      <option key={idx} value={category.category_id}>
                        {category.category.charAt(0).toUpperCase() +
                          category.category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid lg:grid-cols-3 mg:grid-cols-2 sm:grid-cols-1 box-gap mb-2">
                {currentCategory && product_categories_json
                  ? product_categories_json
                    .filter((ct) => ct.category_id === currentCategory)
                    .map((category) => {
                      return category.products.map((product, idx) => (
                        <ProductsView
                          key={idx}
                          product={product}
                          category={category}
                        />
                      ));
                    })
                  : product_categories_json && product_categories_json.map((category) => {
                    return category.products.map((product, idx) => (
                      <ProductsView
                        key={idx}
                        product={product}
                        category={category}
                      />
                    ));
                  })}
              </div>
            </div>
          </section>
          {/* Product view Modal */}
          <div
            className={`modal fade ${Object.keys(singleProductData).length ? "" : "hidden"
              }`}
            id="ProductModal"
            aria-labelledby="ProductModalTitle"
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog">
              <div className="modal-content border-4 border-black">
                <div className="modal-header">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => handleCloseModal()}
                  ></button>
                </div>
                <div className="modal-body relative p-4 pt-0">
                  {Object.keys(singleProductData).length && (
                    <div className="grid lg:grid-cols-2 mg:grid-cols-2 sm:grid-cols-1 box-gap">
                      <section>
                        <div className="container mx-auto product-cards">
                          <div className="product-box">
                            <div className="relative">
                              <div
                                id="product-slider"
                                className="carousel slide carousel-fade relative"
                                data-bs-ride="carousel"
                              >
                                <div className="carousel-inner relative w-full overflow-hidden">
                                  {singleProductData.media.map(
                                    (productImg, idx) => (
                                      <div
                                        className={`${idx === 0
                                          ? "carousel-item active relative float-left w-full"
                                          : "carousel-item"
                                          } `}
                                        key={idx}
                                      >
                                        <img
                                          src={`https://${productImg.link}`}
                                          className="img-fluid w-100"
                                          alt=""
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                      <div className="pl-5">
                        <h6 className="mb-2 font-bold text-2xl">{singleProductData.product}</h6>
                        <div className="border-b-4 border-black py-2">
                          <span className="pricing font-bold text-xl">
                            ${singleProductData.price}
                          </span>
                        </div>

                        <div className="flex-container mt-3">
                          <p className="mr-2 font-bold text-lg">QUANTITY</p>
                          <input
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            type="number"
                            min="1"
                            className="w-16 input-style border-2 border-black"
                          />
                        </div>
                        <div className="mt-8 mb-5">

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;