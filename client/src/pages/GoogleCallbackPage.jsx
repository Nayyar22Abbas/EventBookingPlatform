const GoogleCallbackPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white py-8 px-6 shadow-md rounded-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold mb-2">Google OAuth Callback</h1>
          <p className="text-gray-600">Processing Google authentication...</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;