const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-4 border-black">
      <div className="container-fluid px-6 py-4 md:flex justify-between items-center text-center">
        <p className="font-bold text-lg mb-2 md:mb-0">
          © {currentYear} {window.perspect ? <span>{window.perspect.site_title}</span> : null}
        </p>
        <a className="font-bold text-lg" href="https://perspect.com">
          Powered by Perspect Ecommerce
        </a>
      </div>
    </footer>
  );
};

export default Footer;