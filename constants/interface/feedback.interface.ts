export interface IRegularFeedback {
    id?: string,
    userId: string,
    username: string,
    feedbackContent: string,
}

export interface IOrderFeedback {
    id?: string,
    userId: string,
    username: string,
    orderId: string,
    feedbackContent: string,
    rating: number
}