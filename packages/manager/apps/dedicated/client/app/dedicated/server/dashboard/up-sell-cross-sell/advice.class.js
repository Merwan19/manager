import {
  ADVANCE_COMMERCIAL_RANGE,
  GUARANTEED_BANDWIDTH_1GB_PLAN_CODES,
  BARE_METAL_ADVANCED_WITHOUT_GUARANTEED_BW_TAG,
} from './constants';

export default class DedicatedAdvice {
  constructor(
    $translate,
    serverName,
    commercialRange,
    existingBandwidth,
    publicBandwidthOrderLink,
    Server,
    upSellCrossSellService,
  ) {
    this.$translate = $translate;
    this.serverName = serverName;
    this.commercialRange = commercialRange;
    this.existingBandwidth = existingBandwidth;
    this.publicBandwidthOrderLink = publicBandwidthOrderLink;
    this.Server = Server;
    this.upSellCrossSellService = upSellCrossSellService;

    this.advices = this.loadAdvices();
  }

  loadAdvices() {
    return this.isFeatureAvailable().then((featureAvailable) => {
      console.log(featureAvailable);
      if (
        featureAvailable &&
        this.commercialRange &&
        this.commercialRange.startsWith(ADVANCE_COMMERCIAL_RANGE)
      ) {
        return this.getBandwidth(this.existingBandwidth).then((plans) => {
          const bandwidthGuaranteedPlans = plans.find((plan) =>
            GUARANTEED_BANDWIDTH_1GB_PLAN_CODES.includes(plan.planCode),
          );
          if (bandwidthGuaranteedPlans) {
            return this.getAdvices();
          }
          return null;
        });
      }
      return null;
    });
  }

  isFeatureAvailable() {
    return this.upSellCrossSellService.isFeatureAvailable('dedicated-cloud');
  }

  getAdvices() {
    return [
      {
        localizedName: this.$translate.instant(
          'server_advices_dedicated_advice1',
        ),
        href: this.publicBandwidthOrderLink,
        tag: BARE_METAL_ADVANCED_WITHOUT_GUARANTEED_BW_TAG,
      },
    ];
  }

  getBandwidth(existingBandwidth) {
    return this.Server.getBareMetalPublicBandwidthOptions(
      this.serverName,
    ).then((plans) =>
      this.Server.getValidBandwidthPlans(plans, existingBandwidth),
    );
  }
}
