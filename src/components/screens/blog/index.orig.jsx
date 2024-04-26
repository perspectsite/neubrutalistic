import { Link, useLocation } from "react-router-dom";
import { getFormattedDate } from "../../../utilities/utili";
import "./styles.scss";

import Footer from "../../footer/index.jsx";
import Header from "../../header/index.jsx";

const Blog = ({ blog_json }) => {

  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div>
      <Header pathname={pathname} />
      <div className="page-content blog mb-20">
        <div className="relative">
          <div
            className="flex-container justify-center bg-cover bg-no-repeat bg-fixed banner-bg"
            style={{
              backgroundImage: "url(../../../../assets/img/hero-bg.jpg)",
            }}
          >
            <div className="text-center z-10">
              <h1 className="text-white">
                Our <span className="primary-clr">Blog</span>
              </h1>
            </div>
          </div>
        </div>
        <section className="blog-section">
          <div className="container mx-auto py-8">
            <div className="md:mx-20 px-8">
              <div>
                <h3 className="text-[2rem] font-bold mb-8 border-b py-3">
                  {window.perspect ? <span>{window.perspect.site_title}</span> : null} Blog
                </h3>
              </div>
              {blog_json && blog_json
                .filter((blogs) => blogs.page_type === "post")
                .map((blog, idx) => (
                  <div
                    className="lg:flex justify-center items-center mt-8"
                    key={idx}
                  >
                    <div className="w-2/5 lg:mr-5">
                      <Link to={`/blogs/${blog.slug}`}>
                        <img
                          src={`https://${blog.media[0].link}`}
                          className="img-fluid w-full"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="lg:w-3/5">
                      <Link to={`/blogs/${blog.slug}`}>
                        <h2 className="text-lg font-semibold">
                          {blog.slug.toUpperCase().replace(/[-]/g, " ")}
                        </h2>
                      </Link>
                      <p className="my-3">
                        Posted on{" "}
                        {getFormattedDate(blog.date).replace(/[/]/g, "-")}
                      </p>
                      <p>
                        {blog.content.replace(/[<p></p>]/g, "").slice(0, 250)}...
                      </p>
                      <div className="mt-6 read-more">
                        <Link
                          to={`/blogs/${blog.slug}`}
                          className="font-semibold"
                        >
                          Read more{" "}
                          <i className="fa-solid fa-angles-right text-xs primary-clr"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;
