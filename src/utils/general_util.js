class GeneralUtil {
    static SuccessResponse(phone_number) {
        return {
            success: true,
            number: phone_number,
            message: 'Message sent successfully'
        };
    }

    static ErrorResponse(phone_number, error_message) {
        return {
            success: false,
            number: phone_number,
            message: error_message
        };
    }

    static Delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = GeneralUtil;