const GoogleCallbackPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#F5DEB3] to-[#FFD700] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-lg rounded-2xl border border-[#bfa544]/20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bfa544]/20 border-t-[#bfa544] mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-[#7a2222] mb-2">Google Authentication</h1>
          <p className="text-gray-700 text-sm">Verifying your credentials...</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;