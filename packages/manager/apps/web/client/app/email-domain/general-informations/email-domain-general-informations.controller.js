import get from 'lodash/get';
import set from 'lodash/set';

angular.module('App').controller(
  'EmailTabGeneralInformationsCtrl',
  class EmailTabGeneralInformationsCtrl {
    /* @ngInject */
    constructor(
      $q,
      $http,
      $scope,
      $state,
      $stateParams,
      $translate,
      $window,
      atInternet,
      Alerter,
      constants,
      OvhApiEmailDomain,
      RedirectionService,
      User,
      WucEmails,
    ) {
      this.$q = $q;
      this.$http = $http;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$window = $window;
      this.atInternet = atInternet;
      this.Alerter = Alerter;
      this.constants = constants;
      this.OvhApiEmailDomain = OvhApiEmailDomain;
      this.RedirectionService = RedirectionService;
      this.User = User;
      this.WucEmails = WucEmails;
    }

    $onInit() {
      this.loading = {
        domain: false,
        quotas: false,
        serviceInfos: false,
        urls: false,
      };

      this.urls = {
        delete: '',
        manageContacts: '',
        changeOwner: '',
      };

      this.$scope.$on('domain.dashboard.refresh', () => this.loadDomain());
      return this.$q
        .all([
          this.loadDomain(),
          this.loadQuotas(),
          this.loadServiceInfos().then(() => this.loadServiceDetails()),
        ])
        .then(() => this.loadUrls());
    }

    loadDomain() {
      this.loading.domain = true;

      return this.$q
        .all({
          domain: this.WucEmails.getDomain(this.$stateParams.productId),
          dnsFilter: this.WucEmails.getDnsFilter(
            this.$stateParams.productId,
          ).catch(() => null),
          mxRecords: this.WucEmails.getMxRecords(
            this.$stateParams.productId,
          ).catch(() => null),
        })
        .then(({ domain, dnsFilter, mxRecords }) => {
          this.domain = domain;
          this.dnsFilter = dnsFilter;
          this.mxRecords = mxRecords;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('email_tab_table_accounts_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.domain = false;
        });
    }

    loadServiceDetails() {
      this.loading.serviceDetails = true;
      return this.$http
        .get(`/services/${get(this, 'serviceInfos.serviceId', '')}`)
        .then((response) => {
          this.serviceDetails = response.data;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('email_tab_table_accounts_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.serviceDetails = false;
        });
    }

    loadServiceInfos() {
      this.loading.serviceInfos = true;
      return this.OvhApiEmailDomain.v6()
        .serviceInfos({ serviceName: this.$stateParams.productId })
        .$promise.then((serviceInfos) => {
          this.serviceInfos = serviceInfos;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('email_tab_table_accounts_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.serviceInfos = false;
        });
    }

    loadQuotas() {
      this.loading.quotas = true;
      return this.$q
        .all({
          quotas: this.WucEmails.getQuotas(this.$stateParams.productId),
          summary: this.WucEmails.getSummary(this.$stateParams.productId),
        })
        .then(({ quotas, summary }) => {
          this.quotas = quotas;
          this.summary = summary;
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant('email_tab_table_accounts_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.quotas = false;
        });
    }

    goToDeleteEmail() {
      this.atInternet.trackClick({
        name: 'web::email::domain::delete',
        type: 'action',
      });
      this.$window.location = this.urls.delete;
    }

    loadUrls() {
      this.loading.urls = true;
      if (/hosting/.test(this.domain.offer)) {
        this.urls.delete = `#/configuration/hosting/${encodeURIComponent(
          this.$stateParams.productId,
        )}/terminateEmail?tab=GENERAL_INFORMATIONS`;
      } else {
        this.urls.delete = `${this.constants.AUTORENEW_URL}?selectedType=EMAIL_DOMAIN&searchText=${this.$stateParams.productId}`;
      }
      this.urls.manageContacts = this.RedirectionService.getURL(
        'contactManagement',
        { serviceName: this.$stateParams.productId, category: 'EMAIL_DOMAIN' },
      );
      return this.User.getUrlOf('changeOwner')
        .then((link) => {
          this.urls.changeOwner = link;
        })
        .finally(() => {
          this.loading.urls = false;
        });
    }

    goToUpgrade() {
      return this.$state.go('app.email.domain.upgrade', {
        productId: this.$stateParams.productId,
      });
    }
  },
);
