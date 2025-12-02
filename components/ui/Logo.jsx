import React from "react";

const Logo = () => {
  return (
    <section className="flex justify-start items-center border-b p-4 h-16">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 text-white text-xl font-bold shadow-sm">
          I
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-wide text-gray-800">
            An-Nahdah
          </h1>
          <p>Islamic Academy</p>
        </div>
      </div>
    </section>
  );
};

export default Logo;
