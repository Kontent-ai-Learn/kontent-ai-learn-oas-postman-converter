export const log = console.log;
export const debugLog = console.error;
export const prettify = (obj: any) => JSON.stringify(obj, null, 2);
export const prettyPrint = (obj: any) => log(prettify(obj));
