// app/search/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchProducts } from '@/lib/amazon-api'
import { calculateTrustScore } from '@/lib/trust-algorithm'
import { Search, Star, TrendingUp, AlertCircle } from 'lucide-react'

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  rating: number;
  reviewCount: number;
  url: string;
  trustScore?: number;
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    setLoading(true)
    try {
      const results = await searchProducts(searchTerm)
      
      // Calculate trust scores for each product
      const productsWithTrust = results.map(product => ({
        ...product,
        trustScore: calculateTrustScore({
          rating: product.rating,
          reviewCount: product.reviewCount,
          title: product.title
        })
      }))
      
      setProducts(productsWithTrust)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`)
      performSearch(searchQuery)
    }
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'High Trust'
    if (score >= 60) return 'Medium Trust'
    return 'Low Trust'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-blue-600">Recensor</a>
            
            <form onSubmit={handleNewSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 px-3 text-gray-400 hover:text-blue-600">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            {loading ? 'Searching...' : `Found ${products.length} products with trust scores`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!loading && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <img 
                    src={`https://via.placeholder.com/300x300/e5e7eb/6b7280?text=${encodeURIComponent(product.title.split(' ')[0])}`}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Trust Score Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getTrustScoreColor(product.trustScore || 0)}`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {product.trustScore}/100 - {getTrustScoreLabel(product.trustScore || 0)}
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {product.rating} ({product.reviewCount} reviews)
                  </div>
                </div>

                {/* Trust Score Details */}
                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Trust Score Breakdown:</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${product.trustScore >= 80 ? 'bg-green-500' : product.trustScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${product.trustScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && products.length === 0 && query && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try searching for something else or check your spelling.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
