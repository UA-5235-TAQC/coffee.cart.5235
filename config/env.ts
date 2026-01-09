import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.resolve(__dirname, "..", ".env")});

const BASE_CLIENT_URL = process.env.BASE_CLIENT_URL || "https://coffee-cart.app";
const HEADLESS = process.env.HEADLESS === undefined ? false : process.env.HEADLESS === "true";
const CI = process.env.CI ? +process.env.CI : 1;
const RETRY_FAILED_TESTS = process.env.RETRY_FAILED_TESTS ? +process.env.RETRY_FAILED_TESTS : 0;

export default {
    BASE_CLIENT_URL,
    HEADLESS,
    CI,
    RETRY_FAILED_TESTS
};

export const TIMEOUT = 5000;
export const VALID_USER_NAME = "Test User";
export const VALID_USER_EMAIL = "test@example.com";