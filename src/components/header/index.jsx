import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext, UserDispatchContext } from "../context/userProvider.jsx";
import "./styles.scss";
import { loadStripe } from "@stripe/stripe-js";
import { getMediaFile } from "../../utilities/utili";


const Header = ({ pathname }) => {
  const [sticky, setSticky] = useState("");
  const cart = useContext(UserContext);
  const setCart = useContext(UserDispatchContext);
  const [stateChange, setStateChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [userClosedModal, setUserClosedModal] = useState(false);
  const location = useLocation();
  const modalRef = useRef(null);
  const perspect = window.perspect;

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, []);

  const isSticky = () => {
    const scrollTop = window.scrollY;
    const stickyClass = scrollTop >= 10 ? "is-sticky" : "";
    setSticky(stickyClass);
  };

  function getProductsInCartToCheckout() {
    var checkoutOrder = [];
    var productsInCart = JSON.parse(localStorage.getItem("cartProducts-live"));

    for (var key in productsInCart) {
      var item = {};
      item["stripe_product_id"] = key;
      item["quantity"] = productsInCart[key]["count"];
      checkoutOrder.push(item);
    }
    return checkoutOrder;
  }
  async function checkout() {
    setIsLoading(true);
    let sk = "";
    const perspect = window.perspect;
    if (perspect.site_env === "test") {
      sk = perspect.spkt;
    } else {
      sk = perspect.spkl;
    }
    let said = perspect.said;
    var stripe = await loadStripe(sk, { stripeAccount: said });

    // Make a GET request to /csrf to obtain the CSRF token
    const csrfResponse = await fetch("/csrf");
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrf_token;

    const headers = new Headers({
      "content-type": "application/json",
      "x-csrf-token": csrfToken, // Include the CSRF token in the headers
    });

    fetch("/checkout", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ products: getProductsInCartToCheckout() }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        if (session.id) {
          setIsLoading(false);
        }
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function (result) {
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.error("Error:", error);
      });
  }

  const handleQuantity = (type, productStripeId) => {
    let cartProducts = cart;
    if (Object.keys(cartProducts).includes(productStripeId)) {
      const currentProduct = cartProducts[productStripeId];
      const count = cartProducts[productStripeId].count;
      if (type === "increment") {
        cartProducts = {
          ...cartProducts,
          [productStripeId]: {
            ...currentProduct,
            count: count + 1,
          },
        };
      } else {
        let updatedCount = count - 1;
        if (updatedCount === 0) {
          delete cartProducts[productStripeId];
        } else {
          cartProducts = {
            ...cartProducts,
            [productStripeId]: {
              ...currentProduct,
              count: count - 1,
            },
          };
        }
      }
    }
    localStorage.setItem("cartProducts-live", JSON.stringify(cartProducts));
    setCart(cartProducts);
    setStateChange(!stateChange);
  };

  const handleRemoveProduct = (productStripeId) => {
    const cartProducts = cart;
    delete cartProducts[productStripeId];
    if (Object.keys(cartProducts).length === 0) {
      localStorage.removeItem("cartProducts-live");
    } else {
      localStorage.setItem("cartProducts-live", JSON.stringify(cartProducts));
    }
    setCart(cartProducts);
    setStateChange(!stateChange);
  };

  const getSubTotal = () => {
    let subTotal = 0,
      total = 0;
    for (const key in cart) {
      if (Object.hasOwnProperty.call(cart, key)) {
        const count = cart[key].count;
        const productPrice = cart[key].productPrice;
        subTotal = subTotal + productPrice * count;
      }
    }
    total = subTotal;
    return { subTotal, total };
  };

  const classes = `page-navbar navbar bg-white py-0 ${sticky}`;

  const getQuantity = () => {
    let quantity = 0;
    for (const key in cart) {
      if (Object.hasOwnProperty.call(cart, key)) {
        const count = cart[key].count;
        quantity = quantity + count;
      }
    }
    return quantity;
  };

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const cartVisible = params.get("cart") === "visible";

    if (pathname.includes("/products") && cartVisible && !userClosedModal) {
      setIsCartModalVisible(true);
    }

    const handleClickOutsideModal = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsCartModalVisible(false);
        setUserClosedModal(true);
      }
    };

    if (isCartModalVisible) {
      fetch("/checkout", {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          console.log("Checkout endpoint warmed up", data);
        })
        .catch(error => {
          console.error("/checkout endpoint may not be configured as the respose is not valid JSON");
        });

      document.addEventListener("mousedown", handleClickOutsideModal);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [isCartModalVisible, location, userClosedModal]);


  return (
    <div className="header-content">
      <header>
        {pathname === "/checkout/success" ? null : (
          <div className="text-center top-nav-alert bg-gray-900 py-3 text-white border-b-4 border-black">
            <p className="font-bold tracking-widest uppercase">Free shipping on all orders!</p>
          </div>
        )}
        <nav className="flex items-center bg-white p-4 border-b-4 border-black">
          <a href="/" className="flex-1 flex items-center justify-start gap-2">
            <img src="/assets/img/logo.png" alt="Example Co, Inc" className="h-20" />
            <span className="font-bold text-2xl tracking-tighter leading-none hidden sm:inline">{perspect ? <span>{perspect.site_name}</span> : null}
            </span>
          </a>
          <div className="flex-1 flex justify-center space-x-8">
            <a
              href="/products"
              className="nav-text hover:underline mx-2 font-bold uppercase tracking-wider text-xl"
            >
              Products
            </a>
            <a
              href="/blog"
              className="nav-text hover:underline mx-2 font-bold uppercase tracking-wider text-xl"
            >
              Blog
            </a>
            <a
              href="/contact"
              className="nav-text hover:underline mx-2 font-bold uppercase tracking-wider text-xl"
            >
              Contact
            </a>
          </div>
          <div
            className="flex-1 flex items-center justify-end gap-4"
            onClick={() => {
              setIsCartModalVisible(!isCartModalVisible);
              setUserClosedModal(false);
            }}
          >
            <div className="relative">
              <i className="fa-solid fa-cart-arrow-down text-2xl mr-2"></i>
              {cart && Object.keys(cart).length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full">
                  {getQuantity()}
                </span>
              )}
            </div>
          </div>
        </nav>
      </header>




      {/* Cart view Modal */}
      <div
        className={`modal ${isCartModalVisible ? "flex" : "hidden"} fixed w-full h-full top-0 left-0 z-50 overflow-hidden`}
        aria-labelledby="CartModalTitle"
        role="dialog"
      >
        <div className="modal-dialog border-4 border-black">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <button
                type="button"
                className="btn-close ml-0 flex items-center justify-center p-1"
                aria-label="Close"
                onClick={() => {
                  setIsCartModalVisible(false);
                  setUserClosedModal(true);
                }}
                style={{ background: 'transparent', border: 'none' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="font-bold text-2xl">Cart</div>
              <p className="item-pricing font-bold text-lg">{getQuantity()} Item(s)</p>
            </div>
            <div className="modal-body bg-white relative p-4 pt-2">
              {cart && Object.keys(cart).length > 0 && (
                Object.keys(cart).map((key, index) => {
                  const product = cart[key];
                  console.log("product: ", product);
                  return (
                    <div key={index} className="border-b-2 border-black">
                      <div className="flex justify-between pt-4 pb-2">
                        <div className="flex items-center">
                          <img
                            src={`https://${getMediaFile(product.productMedia).link}`}
                            className="img-fluid w-14 h-14 mr-3 border-2 border-black"
                            alt=""
                          />
                          <div>
                            <p className="font-bold">{product.product}</p>
                          </div>
                        </div>
                        <div>
                          <i
                            onClick={() => handleRemoveProduct(key)}
                            className="fa-solid fa-xmark cursor-pointer text-lg"
                          ></i>
                        </div>
                      </div>
                      <div className="flex-container justify-between pt-3 pb-5 item-pricing">
                        <p className="font-bold text-lg">${product.productPrice}</p>
                        <div className="quantity flex-container h-8">
                          <button
                            type="button"
                            className="mr-1 bg-black text-white font-bold py-1 px-2"
                            aria-hidden="true"
                            onClick={() => handleQuantity("decrement", key)}
                          >
                            &minus;
                          </button>
                          <span className="flex items-center justify-center input-style item-quantity border-2 border-black">
                            {product.count}
                          </span>
                          <button
                            type="button"
                            className="ml-1 bg-black text-white font-bold py-1 px-2"
                            aria-hidden="true"
                            onClick={() => handleQuantity("increment", key)}
                          >
                            &#x2b;
                          </button>
                        </div>
                        <p className="font-bold text-lg">
                          ${parseInt(product.productPrice) * parseInt(product.count)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

              <div className="mt-12">
                <div className="flex justify-between mt-5 border-b-2 border-black py-2">
                  <p className="font-bold text-lg">Subtotal</p>
                  <p className="item-pricing font-bold text-lg">${getSubTotal().subTotal}</p>
                </div>
                <div className="flex justify-between py-2">
                  <p className="font-bold text-lg">Total</p>
                  <p className="item-pricing font-bold text-lg">${getSubTotal().total}</p>
                </div>
                {cart && Object.keys(cart).length > 0 && (
                  <div className="text-right mt-6">
                    <button
                      disabled={isLoading}
                      type="button"
                      className="relative inline-block px-4 py-2 font-bold text-white bg-black border-4 border-black hover:bg-gray-900 mr-3 w-54"
                      onClick={() => checkout()}
                    >
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-black"></div>
                      <div className="relative z-10">
                        Checkout
                        {isLoading && (
                          <svg
                            className="inline-block ml-2 animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
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
                        )}
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Header;