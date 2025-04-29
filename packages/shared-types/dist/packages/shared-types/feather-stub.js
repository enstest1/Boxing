"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatherError = void 0;
exports.call = call;
class FeatherError extends Error {
    constructor(status, data) {
        super(`Feather API call failed with status ${status}`);
        this.status = status;
        this.data = data;
    }
}
exports.FeatherError = FeatherError;
function call(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        // This is a stub implementation - in production, this would be replaced
        // with the actual implementation from the Feather SDK
        try {
            // Mock implementation for local development/testing
            const response = yield fetch(opts.url, {
                method: opts.method,
                headers: opts.headers,
                body: opts.data instanceof FormData ? opts.data : JSON.stringify(opts.data),
            });
            const responseData = yield response.json();
            const headers = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });
            if (!response.ok) {
                throw new FeatherError(response.status, responseData);
            }
            return {
                status: response.status,
                data: responseData,
                headers,
            };
        }
        catch (error) {
            if (error instanceof FeatherError) {
                throw error;
            }
            throw new Error(`Feather API call failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}
