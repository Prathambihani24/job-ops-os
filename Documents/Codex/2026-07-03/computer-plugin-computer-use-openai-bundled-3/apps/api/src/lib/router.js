function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function createRouter() {
  const routes = new Map();

  return {
    register(method, pathname, handler) {
      const key = `${method.toUpperCase()} ${normalizePath(pathname)}`;
      routes.set(key, handler);
    },
    async dispatch(request, response, context) {
      const url = new URL(request.url, context.config.apiBaseUrl);
      const key = `${request.method.toUpperCase()} ${normalizePath(url.pathname)}`;
      const handler = routes.get(key);

      if (!handler) {
        return false;
      }

      await handler(request, response, {
        ...context,
        url
      });

      return true;
    }
  };
}

