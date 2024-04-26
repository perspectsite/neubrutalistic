
import { Link } from "react-router-dom";
import { getMediaFile } from "../../utilities/utili";


const ProductsView = ({ product, category }) => {
    return (
        <div>
            <div className="product-box border-4 border-black p-4" key={product.product_id}>
                <Link to={`/product/${product.slug}`}>
                    <div className="relative">
                        <div
                            id={product.slug + "-" + category.category}
                            className="carousel slide carousel-fade relative"
                            data-bs-ride="carousel"
                        >
                            <div className="carousel-inner relative w-full overflow-hidden">
                                {product.media.map((items, idx) => {
                                    const mediaFile = getMediaFile(product.media);
                                    const mediaUrl = mediaFile ? `https://${mediaFile.link}` : '/assets/dummy-post.jpg';
                                    return (
                                        <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                            <img src={mediaUrl} className="img-fluid w-100" alt="" />
                                        </div>
                                    );
                                })}

                                {product.media.length > 1 ? (
                                    <>
                                        <button
                                            className="carousel-control-prev"
                                            type="button"
                                            data-bs-target={`#${product.slug + "-" + category.category}`}
                                            data-bs-slide="prev"
                                        >
                                            <span aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button
                                            className="carousel-control-next"
                                            type="button"
                                            data-bs-target={`#${product.slug + "-" + category.category}`}
                                            data-bs-slide="next"
                                        >
                                            <span aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="product-content px-0">
                    <div className="w-full flex items-start justify-between my-4 product-card">
                        <Link to={`/product/${product.slug}`}>
                            <h6 className="mb-0 font-bold text-xl">{product.product}</h6>
                        </Link>
                        <span className="pricing font-bold text-xl">{`$${product.price}`}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsView;
