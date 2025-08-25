import React from "react";

function Loading() {
  return (
    <div className="animate-pulse space-y-6 p-10 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <div className="h-12 rounded-lg bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
      <div className="h-8 rounded-md bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
      <div className="h-8 rounded-md bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
      <div className="h-8 rounded-md w-5/6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
    </div>
  );
}

export default Loading;

