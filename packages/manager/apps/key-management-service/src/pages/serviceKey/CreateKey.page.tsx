import React, { Suspense, useContext, useEffect, useState } from 'react';
import {
  BaseLayout,
  CommonTitle,
  Description,
  ErrorBanner,
  IntervalUnitType,
  Notifications,
  OvhSubsidiary,
  Price,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  OdsCheckboxCheckedChangeEventDetail,
  OdsInputValueChangeEventDetail,
  OsdsCheckboxCustomEvent,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsCheckbox,
  OsdsFormField,
  OsdsInput,
  OsdsRadio,
  OsdsRadioGroup,
  OsdsSelect,
  OsdsSelectOption,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { OkmsServiceKeyReference } from '@/types/okmsServiceKeyReference.type';
import {
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
  OkmsServiceKeyTypeECCurve,
  OkmsServiceKeyTypeOctSize,
  OkmsServiceKeyTypeRSASize,
} from '@/types/okmsServiceKey.type';
import {
  ServiceKeyNameErrorsType,
  validateServiceKeyName,
} from '@/utils/serviceKey/validateServiceKeyName';
import { useOkmsServiceKeyReference } from '@/data/hooks/useOkmsReferenceServiceKey';
import { useCreateOkmsServiceKey } from '@/data/hooks/useCreateOkmsServiceKey';
import { useOKMSById } from '@/data/hooks/useOKMS';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { ServiceKeyOperationCheckbox } from '@/components/serviceKey/create/serviceKeyOperationCheckbox';
import { ServiceKeyTypeRadioButton } from '@/components/serviceKey/create/serviceKeyTypeRadioButton';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Loading from '@/components/Loading/Loading';
import { KEY_SOFTWARE_PROTECTION_PRICE } from './CreateKey.constants';

export default function CreateKey() {
  const { okmsId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const userLocale = environment.getUserLocale();

  const {
    data: okms,
    isLoading: okmsIsLoading,
    error: okmsError,
    refetch: refetchOkms,
  } = useOKMSById(okmsId);

  const {
    data: servicekeyReference,
    isLoading: serviceKeyReferenceIsLoading,
    error: serviceKeyReferenceError,
    refetch: refetchServiceKeyReference,
  } = useOkmsServiceKeyReference(okms?.data?.region);

  const [key, setKey] = useState<OkmsServiceKeyReference>();
  const [keyType, setKeyType] = useState<OkmsKeyTypes>();
  const [keySize, setKeySize] = useState<
    OkmsServiceKeyTypeOctSize & OkmsServiceKeyTypeRSASize
  >();
  const [keyCurve, setKeyCurve] = useState<OkmsServiceKeyTypeECCurve>();
  const [keyOperations, setKeyOperations] = useState<
    OkmsServiceKeyOperations[][]
  >();
  const [keyDisplayName, setKeyDisplayName] = useState<string>('');
  const serviceKeyNameError = validateServiceKeyName(keyDisplayName);
  const { trackClick, trackPage } = useOvhTracking();
  const { createKmsServiceKey, isPending } = useCreateOkmsServiceKey({
    okmsId,
    onSuccess: () => {
      navigate(`/${okmsId}/${ROUTES_URLS.keys}`);
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'create_encryption_key',
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'create_encryption_key',
      });
    },
  });

  const getErrorMessage = (error: ServiceKeyNameErrorsType) => {
    switch (error) {
      case 'REQUIRED':
        return t(
          'key_management_service_service-keys_update_name_error_required',
        );
      case 'INVALID_CHARACTERS':
        return t(
          'key_management_service_service-keys_update_name_error_invalid_characters',
        );
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_service-keys_update_name_error_max');

      default:
        return null;
    }
  };

  const selectKeyType = (reference: OkmsServiceKeyReference) => {
    setKey(reference);
    setKeyType(reference.type);
  };

  const submitCreateKey = () => {
    createKmsServiceKey({
      name: keyDisplayName,
      context: keyDisplayName,
      curve: keyCurve,
      size: keySize,
      operations: keyOperations.flat(),
      type: keyType,
    });
  };

  useEffect(() => {
    if (okms && !okmsIsLoading && !servicekeyReference) {
      refetchServiceKeyReference();
    }
  }, [okms, okmsIsLoading, refetchServiceKeyReference, servicekeyReference]);

  useEffect(() => {
    if (!serviceKeyReferenceIsLoading && !key) {
      servicekeyReference?.data?.forEach((reference) => {
        if (reference.default) {
          setKey(reference);
          setKeyType(reference.type);
        }
      });
    }
  }, [servicekeyReference, serviceKeyReferenceIsLoading]);

  useEffect(() => {
    key?.sizes.forEach((size) => {
      if (size.default) {
        setKeySize(size.value);
        setKeyCurve(null);
      }
    });
    key?.curves.forEach((curve) => {
      if (curve.default) {
        setKeyCurve(curve.value);
        setKeySize(null);
      }
    });
    key?.operations.forEach((operation) => {
      if (operation.default) {
        setKeyOperations([operation.value]);
      }
    });
  }, [key]);

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: okmsId,
      label: okms?.data?.iam?.displayName,
      navigateTo: `/${okmsId}`,
    },
    {
      id: ROUTES_URLS.keys,
      label: t('key_management_service_service_keys'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.keys}`,
    },
    {
      id: ROUTES_URLS.createKmsServiceKey,
      label: t('key_management_service_service-keys_create_title'),
      navigateTo: `/${okmsId}/${ROUTES_URLS.keys}/${ROUTES_URLS.createKmsServiceKey}`,
    },
  ];

  if (okmsIsLoading || serviceKeyReferenceIsLoading) {
    return <Loading />;
  }

  if (okmsError) {
    return (
      <ErrorBanner
        error={okmsError.response}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={refetchOkms}
      />
    );
  }

  if (serviceKeyReferenceError) {
    return (
      <ErrorBanner
        error={serviceKeyReferenceError.response}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={refetchServiceKeyReference}
      />
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        header={{
          title: t('key_management_service_service-keys_create_title'),
          description: t('key_management_service_service-keys_create_subtitle'),
          headerButton: <KmsGuidesHeader />,
        }}
      >
        <div className="w-full block">
          <div className="mb-6">
            <Notifications />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="flex flex-col gap-7 md:gap-9">
              <div className="flex flex-col gap-6 md:gap-8">
                <Subtitle>
                  {t(
                    'key_management_service_service-keys_create_protection_level_title',
                  )}
                </Subtitle>
                <Description>
                  {t(
                    'key_management_service_service-keys_create_protection_level_subtitle',
                  )}
                </Description>
                <OsdsTile
                  rounded
                  inline
                  color={ODS_THEME_COLOR_INTENT.info}
                  className="flex flex-col w-full h-fit"
                >
                  <div className="flex flex-col gap-6 pb-4 justify-center align-middle text-center">
                    <CommonTitle>
                      {t(
                        'key_management_service_service-keys_create_software_protection_title',
                      )}
                    </CommonTitle>
                    <Description>
                      {t(
                        'key_management_service_service-keys_create_software_protection_subtitle',
                      )}
                    </Description>
                    <Price
                      value={KEY_SOFTWARE_PROTECTION_PRICE}
                      ovhSubsidiary={
                        OvhSubsidiary[
                          ovhSubsidiary as keyof typeof OvhSubsidiary
                        ]
                      }
                      locale={userLocale}
                      intervalUnit={IntervalUnitType.month}
                    ></Price>
                  </div>
                </OsdsTile>
              </div>
              <div className="flex flex-col gap-6 md:gap-8">
                <Subtitle>
                  {t(
                    'key_management_service_service-keys_create_general_information_title',
                  )}
                </Subtitle>
                <div className="flex flex-col gap-5 md:gap-6">
                  <CommonTitle>
                    {t(
                      'key_management_service_service-keys_create_general_information_field_name_title',
                    )}
                  </CommonTitle>
                  <Description>
                    {t(
                      'key_management_service_service-keys_create_general_information_field_name_subtitle',
                    )}
                  </Description>
                  <OsdsFormField error={getErrorMessage(serviceKeyNameError)}>
                    <OsdsInput
                      aria-label="input-service-key-name"
                      type={ODS_INPUT_TYPE.text}
                      error={!!serviceKeyNameError}
                      required
                      className="p-3"
                      placeholder={t(
                        'key_management_service_service-keys_create_general_information_field_name_placeholder',
                      )}
                      value={keyDisplayName}
                      onOdsValueChange={(
                        e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
                      ) => {
                        setKeyDisplayName(e.detail.value);
                      }}
                    />
                  </OsdsFormField>
                </div>
              </div>
              <div className="flex flex-col gap-6 md:gap-8">
                <Subtitle>
                  {t('key_management_service_service-keys_create_crypto_title')}
                </Subtitle>
                <div className="flex flex-col gap-5 md:gap-6">
                  <CommonTitle>
                    {t(
                      'key_management_service_service-keys_create_crypto_origin_title',
                    )}
                  </CommonTitle>
                  <Description>
                    {t(
                      'key_management_service_service-keys_create_crypto_origin_subtitle',
                    )}
                  </Description>
                </div>
                <div className="flex flex-col gap-5 md:gap-6">
                  <CommonTitle>
                    {t(
                      'key_management_service_service-keys_create_crypto_field_type_title',
                    )}
                  </CommonTitle>
                  <Description>
                    {t(
                      'key_management_service_service-keys_create_crypto_field_type_subtitle',
                    )}
                  </Description>
                  <OsdsRadioGroup
                    value={keyType}
                    className="flex flex-col gap-6"
                  >
                    {servicekeyReference?.data.map((reference) => {
                      return (
                        <OsdsRadio
                          id={reference.type.toString()}
                          value={reference.type.toString()}
                          key={reference.type.toString()}
                          checked={key?.type === reference.type}
                        >
                          <ServiceKeyTypeRadioButton
                            type={reference.type}
                            onClick={() => {
                              trackClick({
                                location: PageLocation.funnel,
                                buttonType: ButtonType.button,
                                actionType: 'action',
                                actions: ['select_type_key', reference.type],
                              });
                              selectKeyType(reference);
                            }}
                          />
                        </OsdsRadio>
                      );
                    })}
                  </OsdsRadioGroup>
                </div>
                {key?.type === OkmsKeyTypes.EC && (
                  <div className="flex flex-col gap-5 md:gap-6">
                    <CommonTitle>
                      {t(
                        'key_management_service_service-keys_create_crypto_field_curve_title',
                      )}
                    </CommonTitle>
                    <Description>
                      {t(
                        'key_management_service_service-keys_create_crypto_field_curve_subtitle',
                      )}
                    </Description>
                    <OsdsSelect
                      value={keyCurve}
                      onOdsValueChange={(event) => {
                        setKeyCurve(
                          event.detail.value as OkmsServiceKeyTypeECCurve,
                        );
                      }}
                    >
                      {key?.curves.map((curve) => {
                        return (
                          <OsdsSelectOption
                            key={curve.value}
                            value={curve.value}
                          >
                            {curve.value}{' '}
                            {curve.default &&
                              t(
                                'key_management_service_service-keys_create_crypto_field_size_curve_suffix_default',
                              )}
                          </OsdsSelectOption>
                        );
                      })}
                    </OsdsSelect>
                  </div>
                )}
                {(key?.type === OkmsKeyTypes.oct ||
                  key?.type === OkmsKeyTypes.RSA) && (
                  <div className="flex flex-col gap-5 md:gap-6">
                    <CommonTitle>
                      {t(
                        'key_management_service_service-keys_create_crypto_field_size_title',
                      )}
                    </CommonTitle>
                    <Description>
                      {t(
                        'key_management_service_service-keys_create_crypto_field_size_subtitle',
                      )}
                    </Description>

                    <OsdsSelect
                      value={keySize}
                      onOdsValueChange={(event) => {
                        setKeySize(
                          event.detail.value as OkmsServiceKeyTypeOctSize &
                            OkmsServiceKeyTypeRSASize,
                        );
                      }}
                    >
                      {key?.sizes.map((size) => {
                        return (
                          <OsdsSelectOption key={size.value} value={size.value}>
                            {t(
                              'key_management_service_service-keys_create_crypto_field_size_unit',
                              { size: size.value },
                            )}{' '}
                            {size.default &&
                              t(
                                'key_management_service_service-keys_create_crypto_field_size_curve_suffix_default',
                              )}
                          </OsdsSelectOption>
                        );
                      })}
                    </OsdsSelect>
                  </div>
                )}
                <div className="flex flex-col gap-5 md:gap-6">
                  <CommonTitle>
                    {t(
                      'key_management_service_service-keys_create_crypto_field_usage_title',
                    )}
                  </CommonTitle>
                  <Description>
                    {t(
                      'key_management_service_service-keys_create_crypto_field_usage_subtitle',
                    )}
                  </Description>
                  {key?.operations.map((operation) => {
                    return (
                      <OsdsCheckbox
                        key={operation.value[0]}
                        checked={keyOperations?.includes(operation.value)}
                        disabled={
                          keyType === OkmsKeyTypes.EC ||
                          keyType === OkmsKeyTypes.RSA
                        }
                        onOdsCheckedChange={(
                          event: OsdsCheckboxCustomEvent<
                            OdsCheckboxCheckedChangeEventDetail
                          >,
                        ) => {
                          trackPage({
                            pageType: PageType.bannerSuccess,
                            pageName: 'deactivate_encryption_key',
                          });
                          let newOperations: OkmsServiceKeyOperations[][];

                          if (event.detail.checked) {
                            setKeyOperations((prev) => {
                              newOperations = [...prev, operation.value];
                              return newOperations;
                            });
                          } else {
                            const operationIndex = keyOperations.indexOf(
                              operation.value,
                            );

                            newOperations = [...keyOperations];
                            newOperations.splice(operationIndex, 1);

                            setKeyOperations(newOperations);
                          }

                          trackClick({
                            location: PageLocation.funnel,
                            buttonType: ButtonType.button,
                            actionType: 'action',
                            actions: [
                              'select_use_key',
                              newOperations.flat().join('_'),
                            ],
                          });
                        }}
                      >
                        <ServiceKeyOperationCheckbox operation={operation} />
                      </OsdsCheckbox>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-4">
                <OsdsButton
                  size={ODS_BUTTON_SIZE.md}
                  inline
                  variant={ODS_BUTTON_VARIANT.stroked}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  onClick={() => {
                    trackClick({
                      location: PageLocation.funnel,
                      buttonType: ButtonType.button,
                      actionType: 'action',
                      actions: ['cancel'],
                    });
                    navigate(`/${okmsId}/${ROUTES_URLS.keys}`);
                  }}
                >
                  {t('key_management_service_service-keys_create_cta_cancel')}
                </OsdsButton>
                <OsdsButton
                  size={ODS_BUTTON_SIZE.md}
                  inline
                  color={ODS_THEME_COLOR_INTENT.primary}
                  onClick={() => {
                    trackClick({
                      location: PageLocation.funnel,
                      buttonType: ButtonType.button,
                      actionType: 'action',
                      actions: ['confirm'],
                    });
                    submitCreateKey();
                  }}
                  disabled={
                    !!serviceKeyNameError ||
                    keyOperations.length === 0 ||
                    isPending ||
                    undefined
                  }
                >
                  {t('key_management_service_service-keys_create_cta_submit')}
                </OsdsButton>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </BaseLayout>
    </Suspense>
  );
}
