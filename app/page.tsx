export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-600">Recensor</h1>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Stop Buying Based on <span className="text-red-500">Fake Reviews</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get AI-powered trust scores for any product. See what people really think before you buy.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search any product... (e.g., iPhone 15, Nike Air Max)"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🛡️
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust Score</h3>
              <p className="text-gray-600">AI analyzes thousands of reviews to give you a real trust score</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                📈
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Reviews</h3>
              <p className="text-gray-600">Filter out fake reviews and see genuine customer experiences</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">Get trust scores in seconds for millions of products</p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 text-white py-12 px-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold mb-4">Ready to Shop Smarter?</h3>
            <p className="text-xl mb-6">Join thousands of smart shoppers making better decisions</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 Recensor. Trust Intelligence for Smart Shopping.</p>
          <p className="text-gray-400 mt-2">Bootstrap Version - From €0 to €1M ARR</p>
        </div>
      </footer>
    </div>
  )
}
