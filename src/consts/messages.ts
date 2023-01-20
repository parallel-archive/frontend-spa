import { html } from "lit";

export const messages = {
    PASSWORD_MISMATCH: "Passwords don't match",
    PASSWORD_RESET_SUCCESS: "Successful password reset",
    PASSWORD_RESET_ERROR: "Failed to reset password",
    REGISTRATION_SUCCESS: "We've sent an email. Click the link to confirm your registration",
    FORGOT_PASS_SUCCESS: "We've sent a recovery email to your email address",
    REGISTRATION_CONFIRMED_SUCCESS: "Registration confirmed",
    CHANGE_PASSWORD_SUCCESS: "Successfully changed you password",
    UNKNOWN_ERROR: "Something went wrong",
    OFFLINE_ERROR: "You are offline",
    UNAUTHORIZED_ERROR: "Unauthorized. Please log in",
    UNAUTHORIZED_ERROR_HTML: html`Unauthorized. Please <a href="/">log in</a>`,
    MEDIA_TOO_LARGE: "File size too large. Maximum 10Mb allowed.",
    PUBLISH_ERROR: "Something went wrong. We could not publish your document.",
}