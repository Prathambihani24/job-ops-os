export function createLogger(defaultFields = {}) {
  function log(level, message, fields = {}) {
    const record = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...defaultFields,
      ...fields
    };

    const serialized = JSON.stringify(record);

    if (level === "error") {
      console.error(serialized);
      return;
    }

    console.log(serialized);
  }

  return {
    info(message, fields) {
      log("info", message, fields);
    },
    warn(message, fields) {
      log("warn", message, fields);
    },
    error(message, fields) {
      log("error", message, fields);
    }
  };
}

