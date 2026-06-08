import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageLoader.css";

const PageLoader = ({ children }) => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(0);

    // Fast ramp to 80%, then wait for content
    const t1 = setTimeout(() => setProgress(30), 50);
    const t2 = setTimeout(() => setProgress(60), 150);
    const t3 = setTimeout(() => setProgress(80), 300);

    // Complete and hide
    const t4 = setTimeout(() => setProgress(100), 500);
    const t5 = setTimeout(() => setVisible(false), 700);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [location]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>
      {visible && (
        <div className="page-loader-bar">
          <div className="page-loader-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
      {children}
    </div>
  );
};

export default PageLoader;
