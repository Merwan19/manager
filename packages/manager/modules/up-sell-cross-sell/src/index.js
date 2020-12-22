import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import advices from './advices';
import service from './service';

const moduleName = 'ovhManagerUpSellCrossSell';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngAtInternet',
    ngOvhFeatureFlipping,
    advices,
  ])
  .service('upSellCrossSellService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
