export default class PciInstanceController {
  /* @ngInject */
  constructor(
    $translate,
    coreConfig,
    CucCloudMessage,
    CucRegionService,
    PciProjectsProjectInstanceService,
  ) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    console.log('ZM:: linkLogsDataPlatform', this.linkLogsDataPlatform);
    this.loadMessages();
    this.advices = [
      {
        localizedName: this.$translate.instant(
          'pci_projects_project_instances_instance_advices_cta',
        ),
        href: this.linkLogsDataPlatform,
        tag: 'cross_sell::pci::no_ldp_yet::log_data_plateform',
      },
    ];
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.instances.instance',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
