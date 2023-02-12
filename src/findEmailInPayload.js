const findEmailInPayload = (payload) => {
  if (payload?.user?.email) {
    return payload.user.email;
  }
  if (payload?.recipient_email) {
    return payload.recipient_email;
  }
};

module.exports = findEmailInPayload;
