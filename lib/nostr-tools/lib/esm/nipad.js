// nipad.ts
var AD_REGEX = /^(?:https?:\/\/)?((?:[\w-]+\.)+[\w-]+)(\/[^\s]*)?$/;
var isWebAddress = (value) => AD_REGEX.test(value || "");
var _fetch;
try {
  _fetch = fetch;
} catch (_) {
  null;
}
function useFetchImplementation(fetchImplementation) {
  _fetch = fetchImplementation;
}
async function queryWebAddress(url) {
  const match = url.match(AD_REGEX);
  if (!match)
    return null;
  const [, domain, path = "/"] = match;
  try {
    const res = await _fetch(`https://${domain}/.well-known/nostr.json?path=${path}`);
    if (res.status !== 200) {
      throw Error("Wrong response code");
    }
    const json = await res.json();
    return json[path] || null;
  } catch (_) {
    return null;
  }
}
export {
  AD_REGEX,
  isWebAddress,
  queryWebAddress,
  useFetchImplementation
};
