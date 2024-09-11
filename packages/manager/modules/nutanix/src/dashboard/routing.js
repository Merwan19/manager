import { OLD_CLUSTER_PLAN_CODE } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard', {
    url: '/:serviceName',
    redirectTo: 'nutanix.dashboard.general-info',
    component: 'nutanixDashboard',
    resolve: {
      trackingPrefix: /* @ngInject */ () => 'hpc::nutanix::cluster',
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      cluster: /* @ngInject */ (NutanixService, serviceName) =>
        NutanixService.getCluster(serviceName),
      nodes: /* @ngInject */ (cluster, NutanixService) =>
        NutanixService.getNodeDetails(cluster.getNodes()),
      nodeId: /* @ngInject */ (cluster) => cluster.getFirstNode(),
      server: /* @ngInject */ (nodeId, NutanixService) =>
        NutanixService.getServer(nodeId),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      serviceInfo: /* @ngInject */ (NutanixService, serviceName) =>
        NutanixService.getServiceInfo(serviceName),
      serviceDetails: /* @ngInject */ (NutanixService, serviceInfo) =>
        NutanixService.getServiceDetails(serviceInfo.serviceId).catch(() => {
          return {};
        }),
      isOldCluster: /* @ngInject */ (NutanixService, serviceInfo) => {
        // If the plan code is nutanix-standard or nutanix-advanced or nutanix-byol its newCluster
        return NutanixService.getServicesDetails(serviceInfo.serviceId)
          .then((data) =>
            OLD_CLUSTER_PLAN_CODE.includes(data.billing.plan.code),
          )
          .catch(() => {});
      },
      getTechnicalDetails: /* @ngInject */ (
        NutanixService,
        serviceInfo,
        server,
      ) =>
        NutanixService.getClusterHardwareInfo(
          serviceInfo.serviceId,
          server.serviceId,
        ).catch(() => {}),
      clusterTechnicalDetails: /* ngInject */ (getTechnicalDetails) =>
        getTechnicalDetails?.baremetalServers.nutanixCluster,
      technicalDetails: /* ngInject */ (getTechnicalDetails) =>
        getTechnicalDetails?.baremetalServers,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      userResources: /* @ngInject */ (NutanixService) =>
        NutanixService.getUserResources().then(({ data }) => data),
      nutanixClusterIamName: /* @ngInject */ (userResources, serviceName) =>
        userResources.find((resource) => resource.name === serviceName)
          .displayName,
    },
  });
};
