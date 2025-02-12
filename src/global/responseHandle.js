const responseHandler = {
    success: (res, message, data = {}) => {
        return res.status(200).json({
            success: true,
            message,
            data,
        });
    },
    error: (res, message, statusCode = 500) => {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    },
};

module.exports = responseHandler;
