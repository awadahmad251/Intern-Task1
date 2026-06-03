import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";

const PageLoader = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [location]);

  return loading ? <Loader /> : children;
};

export default PageLoader;