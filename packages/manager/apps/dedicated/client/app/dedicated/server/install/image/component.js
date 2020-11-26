import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstallImage',
  bindings: {
    loaders: '<',
    model: '<',
    server: '<',

    goDashboard: '<',
  },
  controller,
  template,
};
