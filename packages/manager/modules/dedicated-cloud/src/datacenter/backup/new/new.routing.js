export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenter.backup.new', {
    url: '/new',
    component: 'dedicatedCloudDatacenterBackupNew',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('backup')
        .then((backup) => {
          if (
            !(backup.isInactive() || (backup.isLegacy() && backup.isActive()))
          ) {
            return { state: 'dedicatedClouds.datacenter.backup' };
          }
          return false;
        }),
    resolve: {
      defaultPaymentMethod: (ovhPaymentMethod) =>
        ovhPaymentMethod.getDefaultPaymentMethod(),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
