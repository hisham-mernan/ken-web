import React from "react";

const Arch_Wrapper = ({ children, image, alt = "vector", className = "" }) => {
  return (
    <div
      className={`hut_card w-full max-w-[360px] h-[511px] relative  ${className}`}
    >
      <img loading="lazy" decoding="async" src={image} alt={alt} className="w-full h-full object-cover" />
      {children}
    </div>
  );
};

export default Arch_Wrapper;
