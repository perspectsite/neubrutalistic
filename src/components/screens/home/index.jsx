import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserDispatchContext } from "../../context/userProvider.jsx";
import Footer from "../../footer/index.jsx";
import Header from "../../header/index.jsx";
import { getMediaFile } from "../../../utilities/utili";
import ProductsView from "../../products/ProductsView.jsx"
import "./styles.scss";

const Home = ({ product_categories_json }) => {
  const setCart = useContext(UserDispatchContext);
  const [singleProductData, setSingleProductData] = useState({});
  const [quantity, setQuantity] = useState(1);

  const location = useLocation();
  const pathname = location.pathname;
  // Check if product_categories_json is valid and has the expected structure
  const getRandomProducts = (products) => {
    let result = [];
    let len = products.length;
    const usedIndexes = new Set();
    while (result.length < 3 && result.length < len) {
      let randomIndex = Math.floor(Math.random() * len);
      if (!usedIndexes.has(randomIndex)) {
        result.push(products[randomIndex]);
        usedIndexes.add(randomIndex);
      }
    }
    return result;
  };

  let content;
  if (Array.isArray(product_categories_json) && product_categories_json.every(cat => Array.isArray(cat.products))) {
    // Filter products where media array is not empty
    const allProducts = product_categories_json.reduce((acc, category) => {
      const filteredProducts = category.products.filter(product => product.media && product.media.length > 0);
      return acc.concat(filteredProducts);
    }, []);
    console.log("allProducts: ", allProducts);
    const randomProducts = getRandomProducts([...allProducts]);
    console.log("randomProducts: ", randomProducts);
    content = randomProducts;

  } else {
    content = [];
  }


  const perspect = window.perspect;
  const getStripeProductId = (product) => {
    let stripeProductId;
    if (perspect.site_env === "test") {
      stripeProductId = product.stripe_product_id_test;
    } else {
      stripeProductId = product.stripe_product_id_live;
    }
    return stripeProductId;
  };

  const addProductToCart = (
    productStripeId,
    productName,
    productPrice,
    productMedia,
    count
  ) => {
    let cartProducts =
      JSON.parse(localStorage.getItem("cartProducts-live")) || {};

    if (Object.keys(cartProducts).includes(productStripeId)) {
      const currentCount = cartProducts[productStripeId].count;
      const currentProduct = cartProducts[productStripeId];
      cartProducts = {
        ...cartProducts,
        [productStripeId]: {
          ...currentProduct,
          count: currentCount + count,
        },
      };
    } else {
      cartProducts = {
        ...cartProducts,
        [productStripeId]: {
          count: count,
          product: productName,
          productPrice,
          productMedia,
        },
      };
    }
    localStorage.setItem("cartProducts-live", JSON.stringify(cartProducts));
    setCart(cartProducts);
  };

  const handleCloseModal = () => {
    setSingleProductData({});
    setQuantity(1);
  };



  return (
    <div>
      <Header pathname={pathname} />

      <div className="page-content">
        <div className="relative">
          <div className="flex-container justify-center bg-white py-20">
            <div className="text-center z-10">
              <h1 className="text-4xl font-bold mb-4">
                Hey! Welcome to{" "}
                {perspect ? <span>{perspect.site_name}</span> : null}
              </h1>
              <h2 className="text-2xl font-bold">
                {perspect ? <span>{perspect.site_description}</span> : null}
              </h2>
            </div>
          </div>
        </div>

        <section className="">
          <div className="container mx-auto product-cards mt-10 mb-20 pb-8">
            <div className="text-center py-3">
              <h3 className="text-4xl font-bold mb-8 relative main-h">FEATURED PRODUCTS</h3>
            </div>
            <div className="grid lg:grid-cols-3 mg:grid-cols-2 sm:grid-cols-1 box-gap mb-2">
              {Array.isArray(content) && content.map((product, idx) => (
                <ProductsView key={idx} product={product} category={product.product_category_id} />
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to="/products" className="mt-4 primary-clr pb-6 site-btn view-btn bg-black text-white font-bold py-2 px-4 border-2 border-black">
                View All
              </Link>
            </div>
          </div>
        </section>

        <div
          className={`modal fade ${Object.keys(singleProductData).length ? "" : "hidden"}`}
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
                                {singleProductData.media.map((productImg, idx) => (
                                  <div
                                    className={`${idx === 0
                                      ? "carousel-item active relative float-left w-full"
                                      : "carousel-item"
                                      } `}
                                    key={idx}
                                  >
                                    <img
                                      src={`https://${productImg.link}`}
                                      className="img-fluid w-100 border-2 border-black"
                                      alt=""
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <div className="pl-5">
                      <h6 className="mb-2 font-bold text-2xl">{singleProductData.product}</h6>
                      <div className="border-b-4 border-black py-2">
                        <span className="pricing font-bold text-xl">${singleProductData.price}</span>
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
                        <button
                          type="button"
                          className="site-btn mr-3 w-44 bg-black text-white font-bold py-2 px-4 border-2 border-black"
                          onClick={() =>
                            addProductToCart(
                              singleProductData.stripe_product_id_test,
                              singleProductData.product,
                              singleProductData.price,
                              singleProductData.media,
                              parseInt(quantity)
                            )
                          }
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;