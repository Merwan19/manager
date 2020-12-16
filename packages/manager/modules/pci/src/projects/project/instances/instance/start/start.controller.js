import get from 'lodash/get';

export default class PciInstanceStartController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    Poller,
    CucCloudMessage,
    PciProjectsProjectInstanceService,
    OvhApiCloudProjectInstance,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.Poller = Poller;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
  }

  $onInit() {
    this.isLoading = false;
  }

  waitInstanceStart() {
    const endPointUrl = `/cloud/project/${this.projectId}/instance/${this.instance.id}`;
    return this.$q((resolve) => {
      this.Poller.poll(endPointUrl, null, {
        interval: 1000,
        successRule(instance) {
          return instance.status === 'ACTIVE';
        },
        namespace: 'cloud.project.instance.start',
        notifyOnError: false,
      }).then(resolve);
    });
  }

  startInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.start(
      this.projectId,
      this.instance,
    )
      .then(() => this.waitInstanceStart())
      .then(() => this.OvhApiCloudProjectInstance.v6().resetQueryCache())
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_start_success_message',
            {
              instance: this.instance.name,
            },
          ),
        );
      })
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_start_error_message',
            {
              message: get(err, 'data.message', null),
              instance: this.instance.name,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
