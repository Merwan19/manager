import {
  ActionMenuItem,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useDeleteOkmsServiceKey } from '@/data/hooks/useDeleteOkmsServiceKey';
import { useUpdateOkmsServiceKey } from '@/data/hooks/useUpdateOkmsServiceKey';
import { ROUTES_URLS } from '@/routes/routes.constants';
import {
  OkmsAllServiceKeys,
  OkmsKeyTypes,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';
import { OKMS } from '@/types/okms.type';
import { kmsIamActions } from '@/utils/iam/iam.constants';

const useServiceKeyActionsList = (
  okms: OKMS,
  okmsKey?: OkmsAllServiceKeys,
  isListMode?: boolean,
) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { addSuccess, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const trackLocation = isListMode ? PageLocation.datagrid : PageLocation.page;

  const {
    deleteKmsServiceKey,
    isPending: deleteIsPending,
  } = useDeleteOkmsServiceKey({
    okmsId: okms.id,
    keyId: okmsKey?.id,
    onSuccess: () => {
      navigate(`/${okms.id}/${ROUTES_URLS.keys}`);
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_encryption_key',
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'delete_encryption_key',
      });
    },
  });

  const {
    updateKmsServiceKey,
    isPending: updateIsPending,
  } = useUpdateOkmsServiceKey({
    okmsId: okms.id,
    keyId: okmsKey?.id,
    onSuccess: () => {
      clearNotifications();
      addSuccess(
        t('key_management_service_service-keys_reactivate_success'),
        true,
      );
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'reactivate_encryption_key',
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'reactivate_encryption_key',
      });
    },
  });

  const items: ActionMenuItem[] = [];

  if (okmsKey?.type !== OkmsKeyTypes.oct) {
    items.push({
      id: 1,
      label: t('key_management_service_service-keys_link_download_key'),
      color: ODS_THEME_COLOR_INTENT.primary,
      disabled: okmsKey?.state !== OkmsServiceKeyState.active,
      href: `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(okmsKey?.keys),
      )}`,
      download: `${okmsKey?.name}.jwk`,
      onClick: () => {
        trackClick({
          location: trackLocation,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['download_encryption_key'],
        });
      },
    });
  }
  if (okmsKey?.state === OkmsServiceKeyState.active) {
    items.push({
      id: 2,
      label: t('key_management_service_service-keys_link_deactivate_key'),
      color: ODS_THEME_COLOR_INTENT.primary,
      onClick: () => {
        trackClick({
          location: trackLocation,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['deactivate_encryption_key'],
        });
        return isListMode
          ? navigate(`${ROUTES_URLS.serviceKeyDeactivate}/${okmsKey?.id}`)
          : navigate(
              `/${okms.id}/${ROUTES_URLS.keys}/${okmsKey?.id}/${ROUTES_URLS.serviceKeyDeactivate}`,
            );
      },
      iamActions: [
        kmsIamActions.serviceKeyUpdate,
        kmsIamActions.serviceKeyDeactivate,
      ],
      urn: okmsKey?.iam.urn,
    });
  }
  if (
    okmsKey?.state === OkmsServiceKeyState.deactivated ||
    okmsKey?.state === OkmsServiceKeyState.compromised
  ) {
    items.push({
      id: 3,
      label: t('key_management_service_service-keys_link_reactivate_key'),
      color: ODS_THEME_COLOR_INTENT.primary,
      disabled: updateIsPending,
      iamActions: [
        kmsIamActions.serviceKeyUpdate,
        kmsIamActions.serviceKeyActivate,
      ],
      urn: okmsKey?.iam.urn,
      onClick: () => {
        trackClick({
          location: trackLocation,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['reactivate_encryption_key'],
        });
        updateKmsServiceKey({ state: OkmsServiceKeyState.active });
      },
    });
  }
  if (
    okmsKey?.state !== OkmsServiceKeyState.destroyed &&
    okmsKey?.state !== OkmsServiceKeyState.destroyed_compromised
  ) {
    items.push({
      id: 4,
      label: t('key_management_service_service-keys_link_delete_key'),
      color: ODS_THEME_COLOR_INTENT.error,
      disabled:
        okmsKey?.state === OkmsServiceKeyState.active || deleteIsPending,
      iamActions: [kmsIamActions.serviceKeyDelete],
      urn: okmsKey?.iam.urn,
      onClick: () => {
        trackClick({
          location: trackLocation,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['delete_encryption_key'],
        });
        deleteKmsServiceKey();
      },
    });
  }
  return items;
};

export default useServiceKeyActionsList;
