export const loggerMeta =
  (context: string) => (requestId?: string, error?: Error) => ({
    context,
    requestId,
    ...(error?.message && { error: error.message }),
    ...(error?.stack && { stack: error.stack }),
  });
