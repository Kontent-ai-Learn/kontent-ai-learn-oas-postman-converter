
export function extractErrorMessage(error: any): string {
  let message: string = "";

  if (error instanceof Error) {
    // standard error
    message = error.toString();
  } else if (typeof error === "string" || error instanceof String) {
    message = error.toString();
  } else if (typeof error === "object") {
    try {
      if (error && error.responseJson) {
        message = `Log guid: ${error.logGuid}. Reason: ${error.reased}. Error: ${error.error}. Data: ${error.responseJson.errorContent}. Stacktrace: ${error.responseJson.stacktrace}`;
      } else {
        message = JSON.stringify(error);
      }
    } catch {
      message = "Parsing error failed. Original error: " + message;
    }
  } else {
    message = "Unexpected error: " + message;
  }

  return `${message}`;
}
