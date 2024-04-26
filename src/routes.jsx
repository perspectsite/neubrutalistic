import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Footer from "./components/footer";
import Home from "./components/screens/home/index.jsx";
import Contact from "./components/screens/contact/index.jsx";
import AllProducts from "./components/screens/allProducts/index.jsx";
import Product from "./components/screens/product/index.jsx";
import About from "./components/screens/about/index.jsx";
import OrderSuccess from "./components/orderSuccess/index.jsx";
import Blog from "./components/screens/blog/index.jsx";
import SingleBlog from "./components/screens/blog/singleBlog/index.jsx";
import NotFound from "./components/screens/NotFound/index.jsx";
import "./main.scss";

const AppRoutes = () => {

    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home product_categories_json={window.product_categories_json} />
                    }
                />
                <Route
                    path="/products"
                    element={
                        <AllProducts
                            product_categories_json={window.product_categories_json}
                        />
                    }
                />
                <Route path="/contact" element={<Contact />} />
                <Route
                    path="/product/:slug"
                    element={
                        <Product
                            product_categories_json={window.product_categories_json}
                        />
                    }
                />
                <Route path="/aboutus" element={<About />} />
                <Route path="/checkout/success" element={<OrderSuccess />} />
                <Route path="/checkout/test-success" element={<OrderSuccess />} />
                <Route path="/blog" element={<Blog pages={window.pages} />} />
                <Route
                    path="/blog/:blog_slug"
                    element={<SingleBlog blog_json={window.pages} />}
                />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;