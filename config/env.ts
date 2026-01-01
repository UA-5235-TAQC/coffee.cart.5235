import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.resolve(__dirname, "..", ".env")});

const BASE_CLIENT_URL = process.env.BASE_CLIENT_URL || "https://coffee-cart.app";
const HEADLESS = process.env.HEADLESS === undefined ? false : process.env.HEADLESS === "true";
const CI = process.env.CI ? +process.env.CI : 1;
const RETRY_FAILED_TESTS = process.env.RETRY_FAILED_TESTS ? +process.env.RETRY_FAILED_TESTS : 0;
const VALID_USER_NAME = process.env.VALID_USER_NAME || "asd";
const VALID_USER_EMAIL = process.env.VALID_USER_EMAIL || "asd@mail.com";

export default {
    BASE_CLIENT_URL,
    HEADLESS,
    CI,
    RETRY_FAILED_TESTS,
    VALID_USER_NAME,
    VALID_USER_EMAIL
};

export const TIMEOUT = 5000;