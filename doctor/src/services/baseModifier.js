export const getBaseUrl = () => {
  const subdomain = window.location.hostname.split(".")[0];
  const apis = JSON.parse(process.env.REACT_APP_APIS);
  const baseUrl = apis[subdomain];
  return baseUrl;
};
