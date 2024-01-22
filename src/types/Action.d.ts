type SuccessResponse<T> = {
    success: true,
    data: T
}

type ErrorResponse<E> = {
    success: false,
    error: E & {message: string}
}

type Action = SuccessResponse<> | ErrorResponse<>