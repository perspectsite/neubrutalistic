import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserDispatchContext } from "../context/userProvider.jsx";

const OrderSuccess = () => {
  const setCart = useContext(UserDispatchContext);

  useEffect(() => {
    localStorage.removeItem("cartProducts-live");
    setCart({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="success-page">
      <div className="pt-20">
        <div className="container mx-auto pb-6 pt-3 mt-5 text-center">
          <div className="page-card relative bg-white mx-auto px-5 py-8 max-w-2xl border-4 border-black">
            <div className="text-left z-10">
              <h3 className="text-4xl font-bold mb-4">
                Order Successfully Placed!
              </h3>
              <p className="text-2xl mb-3">
                <i className="far fa-envelope mr-2 w-5"></i>We
                received your order.
              </p>
              <span className="text-2xl">
                <i className="fas fa-question mr-2 w-5"></i> If you
                have any questions, please email{" "}
                <Link to="/" className=" underline">
                  hello@example.com
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;