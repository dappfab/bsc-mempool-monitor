// This file provides utility functions for logging messages to the console or a file.

export const logInfo = (message: string): void => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
};

export const logError = (message: string): void => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
};

export const logDebug = (message: string): void => {
    console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
};