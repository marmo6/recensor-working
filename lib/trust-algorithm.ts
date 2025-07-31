// lib/trust-algorithm.ts

interface ProductData {
  rating: number;
  reviewCount: number;
  title: string;
  price?: string;
  description?: string;
  reviews?: Review[];
}

interface Review {
  text: string;
  rating: number;
  verified?: boolean;
  date?: string;
  helpful?: number;
}

interface TrustScoreBreakdown {
  overall: number;
  rating: number;
  volume: number;
  authenticity: number;
  sentiment: number;
  factors: string[];
}

export function calculateTrustScore(product: ProductData): number {
  const breakdown = calculateDetailedTrustScore(product);
  return breakdown.overall;
}

export function calculateDetailedTrustScore(product: ProductData): TrustScoreBreakdown {
  // Component scores (0-100 each)
  const ratingScore = calculateRatingScore(product.rating);
  const volumeScore = calculateVolumeScore(product.reviewCount);
  const authenticityScore = calculateAuthenticityScore(product);
  const sentimentScore = calculateSentimentScore(product);

  // Weighted average
  const overall = Math.round(
    ratingScore * 0.3 +      // 30% weight on actual rating
    volumeScore * 0.25 +     // 25% weight on review volume  
    authenticityScore * 0.25 + // 25% weight on authenticity
    sentimentScore * 0.2       // 20% weight on sentiment
  );

  const factors = generateTrustFactors(product, {
    rating: ratingScore,
    volume: volumeScore,
    authenticity: authenticityScore,
    sentiment: sentimentScore
  });

  return {
    overall: Math.max(0, Math.min(100, overall)),
    rating: ratingScore,
    volume: volumeScore,
    authenticity: authenticityScore,
    sentiment: sentimentScore,
    factors
  };
}

function calculateRatingScore(rating: number): number {
  // Convert 1-5 rating to 0-100 score
  // 4.5+ = 90-100, 4.0+ = 75-89, 3.5+ = 60-74, etc.
  if (rating >= 4.5) return 90 + (rating - 4.5) * 20;
  if (rating >= 4.0) return 75 + (rating - 4.0) * 30;
  if (rating >= 3.5) return 60 + (rating - 3.5) * 30;
  if (rating >= 3.0) return 40 + (rating - 3.0) * 40;
  if (rating >= 2.0) return 20 + (rating - 2.0) * 20;
  return rating * 10;
}

function calculateVolumeScore(reviewCount: number): number {
  // More reviews = higher confidence, but with diminishing returns
  if (reviewCount >= 1000) return 95;
  if (reviewCount >= 500) return 85;
  if (reviewCount >= 100) return 75;
  if (reviewCount >= 50) return 65;
  if (reviewCount >= 20) return 55;
  if (reviewCount >= 10) return 45;
  if (reviewCount >= 5) return 35;
  if (reviewCount >= 1) return 25;
  return 0;
}

function calculateAuthenticityScore(product: ProductData): number {
  let score = 70; // Base score
  
  // Factors that increase authenticity score
  if (product.reviewCount > 100) score += 10;
  if (product.reviewCount > 500) score += 5;
  
  // Title analysis for spam indicators
  const title = product.title.toLowerCase();
  const spamKeywords = ['best', 'amazing', 'incredible', 'revolutionary', 'magic'];
  const spamCount = spamKeywords.filter(keyword => title.includes(keyword)).length;
  
  if (spamCount >= 3) score -= 20;
  else if (spamCount >= 2) score -= 10;
  
  // Rating distribution analysis (simplified)
  const rating = product.rating;
  if (rating > 4.8 && product.reviewCount < 50) {
    score -= 15; // Suspiciously high rating with few reviews
  }
  
  return Math.max(20, Math.min(100, score));
}

function calculateSentimentScore(product: ProductData): number {
  // Simplified sentiment analysis based on available data
  let score = 60; // Neutral base
  
  const rating = product.rating;
  
  // Derive sentiment from rating distribution
  if (rating >= 4.5) score = 85;
  else if (rating >= 4.0) score = 75;
  else if (rating >= 3.5) score = 65;
  else if (rating >= 3.0) score = 55;
  else if (rating >= 2.5) score = 45;
  else score = 30;
  
  // TODO: Implement actual text sentiment analysis
  // Would analyze review text for positive/negative sentiment
  
  return score;
}

function generateTrustFactors(product: ProductData, scores: any): string[] {
  const factors = [];
  
  if (scores.rating >= 80) {
    factors.push("High customer satisfaction");
  } else if (scores.rating <= 40) {
    factors.push("Below average ratings");
  }
  
  if (scores.volume >= 80) {
    factors.push("Large number of reviews");
  } else if (scores.volume <= 30) {
    factors.push("Limited review data");
  }
  
  if (scores.authenticity >= 80) {
    factors.push("Reviews appear authentic");
  } else if (scores.authenticity <= 50) {
    factors.push("Potential review quality issues");
  }
  
  if (product.rating > 4.0 && product.reviewCount > 100) {
    factors.push("Consistently positive feedback");
  }
  
  if (product.reviewCount < 10) {
    factors.push("New product with limited feedback");
  }
  
  return factors.slice(0, 3); // Limit to 3 most relevant factors
}

// Advanced features for future implementation
export function detectFakeReviews(reviews: Review[]): number {
  // Placeholder for ML-based fake review detection
  // Would analyze patterns in review text, timing, etc.
  return 0.85; // 85% authentic score
}

export function analyzeReviewSentiment(reviewText: string): number {
  // Placeholder for NLP sentiment analysis
  // Would use libraries like sentiment or cloud APIs
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst'];
  
  const text = reviewText.toLowerCase();
  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;
  
  if (positiveCount > negativeCount) return 0.7 + (positiveCount - negativeCount) * 0.1;
  if (negativeCount > positiveCount) return 0.3 - (negativeCount - positiveCount) * 0.1;
  return 0.5; // Neutral
}

// Export for use in API routes
export const TrustScoreAPI = {
  calculate: calculateTrustScore,
  detailed: calculateDetailedTrustScore,
  detectFakes: detectFakeReviews,
  sentiment: analyzeReviewSentiment
};
