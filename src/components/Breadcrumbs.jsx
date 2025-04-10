import React from "react";

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="flex items-center text-sm mb-6">
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="mx-2">›</span>}
          {index === paths.length - 1 ? (
            <span className="text-md font-poppins font-semibold">{path.label}</span>
          ) : (
            <a href={path.url} className="text-black font-semibold">
              {path.label}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
export default Breadcrumbs;