import angular from 'angular';

import cancellationForm from './components/cancellation-form';
import servicesActions from './components/services-actions';
import { RENEW_URL } from './components/services-actions/service-actions.constants';

const moduleName = 'ovhManagerBilling';

angular.module(moduleName, [cancellationForm, servicesActions]);

export { RENEW_URL };

export default moduleName;
