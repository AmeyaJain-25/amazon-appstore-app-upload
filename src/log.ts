import * as core from "@actions/core";

export enum LogLevel {
  ERROR = "error", // Just log the message as an error and continue the execution
  FAILED = "failed", // Stop the execution of the action and log the message as an error
  INFO = "info", // Log the message as an information
  WARNING = "warning", // Log the message as a warning and continue the execution
}

export function logMessage(
  level: LogLevel,
  message: string,
  options: { data?: any; error?: any } = {
    data: undefined,
    error: undefined,
  },
) {
  switch (level) {
    case LogLevel.FAILED:
      if (core.isDebug()) {
        if (options.error instanceof Error || options.error !== undefined) {
          core.error(options.error);
        }
      }
      core.setFailed(message);
      break;
    case LogLevel.INFO:
      core.info(message);
      if (options.data !== undefined) {
        core.info(JSON.stringify(options.data));
      }
      break;
    case LogLevel.WARNING:
      core.warning(message);
      break;
    default:
      if (core.isDebug()) {
        if (options.error instanceof Error || options.error !== undefined) {
          core.error(options.error);
        }
      }
      core.error(message);
      break;
  }
}
