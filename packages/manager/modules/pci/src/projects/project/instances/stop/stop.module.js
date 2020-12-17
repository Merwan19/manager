import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import stopInstance from '../instance/stop/stop.module';
import routing from './stop.routing';

const moduleName = 'ovhManagerPciInstancesStop';

angular
  .module(moduleName, [
    stopInstance,
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
