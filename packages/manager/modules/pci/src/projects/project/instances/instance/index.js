import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import ovhManagerUpSellCrossSell from '@ovh-ux/manager-up-sell-cross-sell';

const moduleName = 'ovhManagerPciInstanceLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', ovhManagerUpSellCrossSell])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.instances.instance.**', {
        url: '/:instanceId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./instance.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
