export function createSuccessResponse(status: number, message: string, meta_data: any = undefined) {
    return {
        status: status,
        message: message,
        meta_data: meta_data
    }
}