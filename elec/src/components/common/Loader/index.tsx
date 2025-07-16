const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative">
        <div className="loader bg-blue-500 rounded-full w-24 h-24 opacity-75 animate-pulse"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 w-24 h-24 rounded-full blur-2xl bg-blue-300 opacity-50 animate-ping"></div>
      </div>
    </div>
  );
};

export default Loader;
