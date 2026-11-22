const { timingSafeEqual } = require("node:crypto");

function matchesConfiguredValue(candidate, configuredValue) {
  if (!configuredValue) {
    return false;
  }

  const candidateBuffer = Buffer.from(candidate);
  const configuredBuffer = Buffer.from(configuredValue);
  return candidateBuffer.length === configuredBuffer.length
    && timingSafeEqual(candidateBuffer, configuredBuffer);
}

function authenticate(username, password) {
  const expectedUsername = process.env.CAMPUS_PORTAL_USERNAME;
  const expectedPassword = process.env.CAMPUS_PORTAL_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    throw new Error("CampusPortal credentials are not configured.");
  }

  return matchesConfiguredValue(username, expectedUsername)
    && matchesConfiguredValue(password, expectedPassword);
}

module.exports = { authenticate };
