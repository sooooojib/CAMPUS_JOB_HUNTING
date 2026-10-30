/**
 * UniCareer Community — Standardized Logger
 * Provides structured logging with environment-aware verbosity.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

function formatPrefix(level: LogLevel): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] [UniCareer]`;
}

export const logger = {
  debug(message: string, ...args: unknown[]) {
    if (shouldLog("debug")) {
      console.debug(`${formatPrefix("debug")} ${message}`, ...args);
    }
  },

  info(message: string, ...args: unknown[]) {
    if (shouldLog("info")) {
      console.info(`${formatPrefix("info")} ${message}`, ...args);
    }
  },

  warn(message: string, ...args: unknown[]) {
    if (shouldLog("warn")) {
      console.warn(`${formatPrefix("warn")} ${message}`, ...args);
    }
  },

  error(message: string, error?: unknown, ...args: unknown[]) {
    if (shouldLog("error")) {
      console.error(`${formatPrefix("error")} ${message}`, error ?? "", ...args);
    }
  },
};

