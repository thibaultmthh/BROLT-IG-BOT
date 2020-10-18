const {
  LexActivator,
  PermissionFlags,
  LexActivatorException,
  LexStatusCodes
} = require("@cryptlex/lexactivator")

function activate(key, settings_ds) {
  if (key == "") {
    key = settings_ds.get_D("key")
  }

  LexActivator.SetProductData("QUE1RDYwMzI3RjgyMUY3NzMyMzA3NjFCQjZEOEZBODc=.UA4uJIjYlfSKxtU8WTi8REPfX3p65GdZB2SCu+zNk9NBNPRuWRiiJ/RuxJ6qFQuC/Uk69pmZP63UvlFS3KJxmmoctcq+tFrXpVHY5DiN0vh7Vk+egyqj3BIhChNNe0Ci3mks/KP3Dpv43sUii6yqxw7M1av+nw37CAnzvy/8/eBLCvpEf6lazFxRMj7uPeblbfh20K2XwnFsscJVsJgv8nR+jBbKENxxMeqko/pcTho8VEYaDOMX/rpgtehvvq/e2jea3LcUIL9rgyLcYLYuuARvIHyJQv88oEWR9FzpXcnJBm9leajmJn1+6iVdodu6od3Za5cxrsdwAwrnhe6DpN1NfUcJ46l6l31IDU5qafaB3W+7dT23PkinvMebqQsidcLai8jwCAGUoLADLdnRb5qsY22G4LvG/Qneq5gVjvgQD9TxNxOSjmvI10jlkBxrms8swxBEFw8G/AtY7J2V+ZbWFyQ9sL4ud8kwspbhSFPgpCFzFYQWmhuIzUpat6ay5bqE0zstzcdGsRfGDgT4XXliXzwIOpaWmBxQyMw/5QnoKWTH87TdT8WKAzS63reVtFaRVF795jOh1+RxZ+T2FISMBXMSUophA9Cd6sF5nb+RTTYEfeATyR1TqvhYW5Gq8ZO1wJyRzP2Zq4BpYQ9g+6ZbToIO2NQiVsycfb9ExwYyJDMjc2T5e0N850pkuhh8aOi95m+E7KiAuCfnw4a7IczE1gNoxEduMX+9c4Ksc/Y=");
  LexActivator.SetProductId("af7666e0-7824-41db-b0c7-de632c438d13", PermissionFlags.LA_USER);
  try {
    LexActivator.SetLicenseKey(key);
    LexActivator.SetActivationMetadata('key1', 'value1');
    const status = LexActivator.ActivateLicense();
    if (LexStatusCodes.LA_OK == status) {
      settings_ds.add_D("key", key)
      return [1, 'License activated successfully!'];

    } else if (LexStatusCodes.LA_EXPIRED == status) {
      return [0, 'License activated successfully but has expired!'];
    } else if (LexStatusCodes.LA_SUSPENDED == status) {
      return [0, 'License activated successfully but has been suspended!'];
    }
  } catch (error) {
    return [0, error.message, error.code];
  }
}

module.exports = activate