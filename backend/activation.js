const  {LexActivator,PermissionFlags,LexActivatorException,LexStatusCodes} = require("@cryptlex/lexactivator")

function activate(key, settings_ds) {
  if (key == ""){
    key = settings_ds.get_D("key")
  }

  LexActivator.SetProductData("NzBCMzE0M0FCMUMzRDUxOTdCNDM4OTc0NjA2QzEyMzg=.n4L5Fcn2ZkcQpV8aGYji61ui1/26SLmCVUG0Bdo6UYmr3/g0WbIs+ZbyakxoywlvtNJVG8NuGkEXtDLZBNObSd0RzSPen6mo2OEk8DN41bCZETpbkXexWMf6tY0h1uBBc5wpBPxJtA433OBvdJFztO7e75WyLPJy9XLRFZUV3J6dt9L8foKk1Oa/M6zHtBA5qRv4NnMVerr9qYtvpqNbyb7RZE4VfGAP3vqV1e1pWAaQqXZ9jZ6i+1SdgFpQa+hHOeGjnO3b2AbSBD2QXpTyWk/EgAtm5tvRzvW7lTgHesf9ansOlCh4a+SMkmapD4pwnTIKo1NaZIqXNlmp+skfPToXBiUos9aPGw5tKYihk0XWUspzwJcWHME3CH5QVhjcX/ZQvnguPXwnEvNv5Pv6qnBl1lNmtKt1GiCPCL40OUndrTwcUbwHtxw2JGTu+Ru9T7SEpsezvsOCMgg9C1ybOM/FHtXDMJkwXXmS8z+Ygpu2h4OM/9fYKHTsFA4YRCj+k7PodG/jaa3lmMIbfbjsQ4nD6w1zi+/k9wt/GFxbUrT9D6mvs64NbUmiytXvtl24D9N42G7yMTUkFhFDpEjNOw6JlTwCR6lAQTErT7MDdpI2tsXlsgDRpnoJcMg50MdBu+M7l2wCdW7g2xA71UaGtYsbGQ+2JiwI7b9UoJNnSzs97kLmYC3WmpeScp0K87Zml6G64dWFTqsVvH9x8zMtVUZRpd/h2940lVPjVGpUtwo=");
  LexActivator.SetProductId("09caaf9b-d55d-45dd-8f09-665a070098ac", PermissionFlags.LA_USER);
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
    } catch(error) {
        return [0, error.message, error.code];
    }
}

module.exports= activate
