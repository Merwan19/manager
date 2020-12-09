import filter from 'lodash/filter';

export default class DedicatedServerInstallImageCtrl {
  /* @ngInject */
  constructor(dedicatedServerInstallImage) {
    this.dedicatedServerInstallImage = dedicatedServerInstallImage;

    this.launchInstallError = null;
  }

  /*= =============================
  =            Events            =
  ============================== */

  onImageFormSubmit() {
    this.loaders.launchInstall = true;
    this.launchInstallError = null;

    const httpHeader = filter(
      this.model.httpHeader,
      ({ model }) => model.key && model.value,
    ).map(({ model }) => model);

    let configdrive = {
      enabled: this.model.configdrive.enabled || false,
    };
    if (configdrive.enabled) {
      configdrive = {
        ...configdrive,
        hostname: this.model.configdrive.hostname,
        sshKey: this.model.configdrive.sshKey,
        userData: this.model.configdrive.userData,
        userMetadatas: filter(
          this.model.configdrive.metadata,
          ({ model }) => model.key && model.value,
        ).map(({ model }) => model),
      };
    }

    const installData = {
      URL: this.model.url,
      checkSum: this.model.checkSum,
      checkSumType: this.model.checkSumType,
      description: this.model.description,
      diskGroupId: this.model.diskGroup.diskGroupId,
      type: this.model.imageType,
      httpHeader,
      configdrive,
    };

    return this.dedicatedServerInstallImage
      .startInstall(this.server.name, installData)
      .then(() => this.goDashboard())
      .catch((error) => {
        this.launchInstallError = error;
      })
      .finally(() => {
        this.loaders.launchInstall = false;
      });
  }

  onLaunchInstallErrorDismiss() {
    this.launchInstallError = null;
  }

  /* -----  End of Events  ------*/
}
