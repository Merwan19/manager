import head from 'lodash/head';

export default class DedicatedServerInstallImageOptionsCtrl {
  $onInit() {
    this.model.diskGroup = head(this.server.hardware.specifications.diskGroups);
  }
}
