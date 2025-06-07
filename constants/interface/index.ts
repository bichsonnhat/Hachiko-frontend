export * from './category.interface'
export * from './order.interface'
export * from './product.interface'
export * from './store.interface'
export * from './voucher.interface'
export * from './feedback.interface'
export * from './statistic.interface'

export interface IReview {
  id: string;
  userId: string;
  productId: string;
  userName?: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IReviewCreate {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
}

export interface IProductReviews {
  reviews: IReview[];
  averageRating: number;
  totalReviews: number;
  userReview?: IReview; // Current user's review if exists
}