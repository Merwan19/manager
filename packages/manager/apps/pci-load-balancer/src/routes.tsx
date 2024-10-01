import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { ErrorBoundary } from './pages/ErrorBoundary';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/octavia-load-balancer',
  LISTING: 'load-balancers',
  DETAIL: ':region/:loadBalancerId',
  GENERAL_INFORMATION: 'general-information',
  EDIT_NAME_LOAD_BALANCER: 'edit-name',
  LISTENERS: 'listeners',
  LISTENERS_LIST: 'list',
  LISTENER_DELETE: ':listenerId/delete',
  LISTENER_CREATE: 'create',
  LISTENER_EDIT: ':listenerId/edit',
  POOLS: 'pools',
  POOL_LIST: 'list',
  STATISTICS: 'statistics',
  CERTIFICATES: 'certificates',
  LOGS: 'logs',
  DELETE: ':region/:loadBalancerId/delete',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ListingPage = lazy(() => import('@/pages/listing/Listing.page'));
const DetailPage = lazy(() => import('@/pages/detail/Detail.page'));
const OverviewPage = lazy(() =>
  import('@/pages/detail/overview/Overview.page'),
);
const ListenersPage = lazy(() =>
  import('@/pages/detail/listeners/Listeners.page'),
);
const ListenersListPage = lazy(() =>
  import('@/pages/detail/listeners/list/List.page'),
);
const DeleteListenerPage = lazy(() =>
  import('@/pages/detail/listeners/delete/DeleteListener.page'),
);
const ListenersCreatePage = lazy(() =>
  import('@/pages/detail/listeners/create/Create.page'),
);
const ListenersEditPage = lazy(() =>
  import('@/pages/detail/listeners/edit/Edit.page'),
);
const PoolsPage = lazy(() => import('@/pages/detail/pools/Pools.page'));
const PoolListPage = lazy(() => import('@/pages/detail/pools/List.page'));
const StatisticsPage = lazy(() =>
  import('@/pages/detail/statistics/Statistics.page'),
);
const CertificatesPage = lazy(() =>
  import('@/pages/detail/certificates/Certificates.page'),
);
const LogsPage = lazy(() => import('@/pages/detail/log/Log.page'));
const DeletePage = lazy(() => import('@/pages/delete/Delete.page'));
const EditLoadBalancerNamePage = lazy(() =>
  import('@/pages/detail/edit/Edit.page'),
);

const Routes = (
  <Route
    id="root"
    path={ROUTE_PATHS.ROOT}
    Component={LayoutPage}
    errorElement={<ErrorBoundary />}
  >
    <Route path="" element={<Navigate to={ROUTE_PATHS.LISTING} replace />} />
    <Route path={ROUTE_PATHS.LISTING} Component={ListingPage}>
      <Route path={ROUTE_PATHS.DELETE} Component={DeletePage} />
    </Route>
    <Route id="detail" path={ROUTE_PATHS.DETAIL} Component={DetailPage}>
      <Route
        path=""
        element={<Navigate to={ROUTE_PATHS.GENERAL_INFORMATION} />}
      />
      <Route
        id="detail-general-information"
        path={ROUTE_PATHS.GENERAL_INFORMATION}
        Component={OverviewPage}
      >
        <Route
          path={ROUTE_PATHS.EDIT_NAME_LOAD_BALANCER}
          Component={EditLoadBalancerNamePage}
        />
      </Route>
      <Route
        id="detail-listeners"
        path={ROUTE_PATHS.LISTENERS}
        Component={ListenersPage}
      >
        <Route path="" element={<Navigate to={ROUTE_PATHS.LISTENERS_LIST} />} />
        <Route
          id="listeners-list"
          path={ROUTE_PATHS.LISTENERS_LIST}
          Component={ListenersListPage}
        >
          <Route
            id="listener-delete"
            path={ROUTE_PATHS.LISTENER_DELETE}
            Component={DeleteListenerPage}
          />
        </Route>
        <Route
          id="listener-create"
          path={ROUTE_PATHS.LISTENER_CREATE}
          Component={ListenersCreatePage}
        />
        <Route
          id="listener-edit"
          path={ROUTE_PATHS.LISTENER_EDIT}
          Component={ListenersEditPage}
        />
      </Route>
      <Route id="detail-pools" path={ROUTE_PATHS.POOLS} Component={PoolsPage}>
        <Route path="" element={<Navigate to={ROUTE_PATHS.POOL_LIST} />} />
        <Route
          id="pool-list"
          path={ROUTE_PATHS.POOL_LIST}
          Component={PoolListPage}
        />
      </Route>
      <Route
        id="detail-statistics"
        path={ROUTE_PATHS.STATISTICS}
        Component={StatisticsPage}
      />
      <Route
        id="detail-certificates"
        path={ROUTE_PATHS.CERTIFICATES}
        Component={CertificatesPage}
      />
      <Route id="detail-logs" path={ROUTE_PATHS.LOGS} Component={LogsPage} />
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Route>
);

export default Routes;
