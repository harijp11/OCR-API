export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNSUPPORTED_MEDIA_TYPE: 415,
    UNPROCESSABLE_ENTITY: 422,

    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,

    INVALID_IMAGE_FORMAT: 460,
    OCR_FAILED: 461,
    AADHAAR_VALIDATION_FAILED: 462,
};


export const SUCCESS_MESSAGES = {
    DATA_PARSED: "Aadhar data parsed.",
    DATA_SAVED: "Data saved to database.",
    DOCUMENT_DELETED: "Data deleted.",
    DATA_FETCHED:"Adhaar details fetched successfully"
}

export const ERROR_MESSAGES = {
    NO_FILE_UPLOADED: "No file was uploaded.",
    OCR_FAILED: "Text extraction from image failed. Please try with a clearer image.",
    NOT_FOUND: "The requested resource was not found.",
    INTERNAL_SERVER_ERROR: "An internal server error occurred.",
    SERVICE_UNAVAILABLE: "Service is temporarily unavailable. Please try again later.",
    UNKNOWN_ERROR: "Something went wrong. Please try again.",
    MISSING_FIELDS: "Some fields are missing.",
    ID_NOT_PROVIDED: "Id not provided.",
    INVALID_AADHAAR_NUMBER:"Invalid data is uploaded.Please check it."
}