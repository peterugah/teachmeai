export const isLocalhost = () => {

  const hostname = window?.location?.hostname;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  ) {
    return true;
  } else {
    return false;
  }
}