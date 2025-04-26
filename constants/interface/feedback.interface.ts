export interface IRegularFeedback {
    id?: string,
    userId: string,
    feedbackContent: string,
}

export interface IOrderFeedback {
    id?: string,
    userId: string,
    orderId: string,
    feedbackContent: string,
    rating: number
}