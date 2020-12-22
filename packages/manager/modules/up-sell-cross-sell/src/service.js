export default class {
  /* @ngInject */
  constructor(ovhFeatureFlipping) {
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  isFeatureAvailable(appName) {
    return this.ovhFeatureFlipping
      .checkFeatureAvailability(`up-sell-cross-sell:${appName}`)
      .then((featureAvailability) =>
        featureAvailability.isFeatureAvailable(`up-sell-cross-sell:${appName}`),
      );
  }
}
