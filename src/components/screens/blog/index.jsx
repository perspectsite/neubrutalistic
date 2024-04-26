import Footer from "../../footer/index.jsx";
import Header from "../../header/index.jsx";
import { Link, useLocation } from "react-router-dom";
import { getMediaFile, formatDateFromString } from "../../../utilities/utili";


export default function Blog({ pages }) {
    const location = useLocation();
    const pathname = location.pathname;
    return (
        <div>
            <Header pathname={pathname} />
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-extrabold tracking-tighter text-gray-900 sm:text-4xl">Latest News and Resources</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                            Missives and News.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {pages && pages.map((page) => {
                            if (page.page_type !== 'post') {
                                return null;
                            }

                            const imageFile = getMediaFile(page.media);
                            const imageUrl = imageFile ? `https://${imageFile.link}` : '/assets/dummy-image.jpg';
                            const pageUrl = `/blog/${page.slug}`;
                            return (
                                <div key={page.page_id} className="max-w-sm mx-auto mb-8">
                                    <Link to={pageUrl}>
                                        <article className="border-4 border-black p-4 cursor-pointer transition duration-300 ease-in-out hover:shadow-xl">
                                            <img className="w-full border-b-4 border-black" src={imageUrl} alt="" />
                                            <div className="px-6 py-4">
                                                <div className="font-bold text-2xl mb-2">{page.title}</div>
                                                <p className="text-lg">{page.description}</p>
                                            </div>
                                            <div className="px-6 py-4 border-t-4 border-black">
                                                <div className="flex items-center">
                                                    <div className="text-sm">
                                                        <p className="font-bold">{formatDateFromString(page.date)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </div>
                            );
                        })}


                    </div>
                </div>
            </div>
        </div>
    )
}
