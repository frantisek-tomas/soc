export const toBaseUrl = (baseUrl) => {
  if (baseUrl.includes("<host>")) {
    return baseUrl.replace("<host>", window.location.hostname);
  }

  return baseUrl;
};
