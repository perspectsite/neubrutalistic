import "./styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserDispatchContext } from "../../context/userProvider.jsx";
import { getMediaFile, formatDateFromString } from "../../../utilities/utili";
import Header from "../../header/index.jsx";
import { useLocation } from "react-router-dom";

const Product = ({ product_categories_json }) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [singleProductData, setSingleProductData] = useState();
  const setCart = useContext(UserDispatchContext);
  const [quantity, setQuantity] = useState(1);
  const [buttonState, setButtonState] = useState();
  const [buttonText, setButtonText] = useState();
  const [isAdding, setIsAdding] = useState();

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (product_categories_json && slug) {
      const currentProduct = product_categories_json
        .flatMap((category) => category.products)
        .filter((product) => product.slug === slug);
      console.log("currentProduct: ", currentProduct);
      if (currentProduct) {
        setSingleProductData(currentProduct);
        if (currentProduct[0].quantity_available === 0) {
          setButtonState("disabled");
          setButtonText("SOLD OUT");
        } else {
          setButtonState("");
          setButtonText("ADD TO CART");
        }
      } else {
        redirectToAllProducts();
      }
    } else {
      redirectToAllProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_categories_json, slug]);

  const redirectToAllProducts = () => {
    navigate("/products");
  };

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

  const regex = /(<([^>]+)>)/gi;

  const addProductToCart = async (
    productStripeId,
    productName,
    productPrice,
    productMedia,
    count
  ) => {
    setIsAdding(true);
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

    // Wait for 4 seconds before setting isAdding back to false
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsAdding(false);
  };

  return (
    <div>
      <Header pathname={pathname} />
      <div className="pt-20 pb-6 my-10 product-page">
        <div className="container mx-auto mt-18">
          <div className="grid lg:grid-cols-2 mg:grid-cols-2 sm:grid-cols-1 box-gap">
            <section>
              <div className="container mx-auto product-cards lg:px-10">
                <div className="product-box border-4 border-black p-4">
                  <div className="relative">
                    <div
                      id="product"
                      className="carousel slide carousel-fade relative"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner relative w-full overflow-hidden">
                        {singleProductData &&
                          singleProductData.map((items) =>
                            items.media.map((productImg, idx) => {
                              const mediaFile = getMediaFile(productImg);
                              const mediaUrl = mediaFile
                                ? `https://${mediaFile.link}`
                                : "/assets/dummy-image.jpg";
                              return (
                                <div
                                  key={idx}
                                  className={`${idx === 0
                                    ? "carousel-item active relative float-left w-full"
                                    : "carousel-item"
                                    }`}
                                >
                                  <img
                                    src={mediaUrl}
                                    className="img-fluid w-100 border-2 border-black"
                                    alt=""
                                  />
                                </div>
                              );
                            })
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {singleProductData &&
              singleProductData.map((items, idx) => (
                <div key={idx} className="pl-5">
                  <h2 className="mb-2 text-4xl font-bold">{items.product}</h2>
                  <div className="border-b-4 border-black py-2">
                    <span className="pricing font-bold text-xl">
                      ${items.price}
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
                    <button
                      type="button"
                      className="relative inline-block px-4 py-2 font-bold text-white bg-black border-4 border-black hover:bg-gray-900 mr-3 w-54"
                      onClick={() =>
                        addProductToCart(
                          getStripeProductId(items),
                          items.product,
                          items.price,
                          items.media,
                          parseInt(quantity)
                        )
                      }
                      disabled={isAdding}
                    >
                      <div className="absolute top-0 left-0 w-full h-full border-2 border-white"></div>
                      {isAdding ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-3 text-white inline-block"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            style={{ width: "1.25rem", height: "1.25rem" }}
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-2c0 3.309-2.691 6-6 6-3.309 0-6-2.691-6-6H6c0 4.411 3.589 8 8 8z"
                            />
                          </svg>
                          <span className="inline-block align-middle">Adding</span>
                        </>
                      ) : (
                        "Add to cart"
                      )}
                    </button>
                  </div>
                  <div className="border-t-4 border-black py-4">
                    <p className="mb-3 font-bold text-lg">
                      {items.description.replace(regex, "")}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;