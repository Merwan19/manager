import {
  OsdsLink,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  StepComponent,
  TilesInputComponent,
  useMe,
} from '@ovh-ux/manager-react-components';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { TRegion, useGetRegions } from '@/api/hook/useRegions';
import { REGION_AVAILABILITY_LINK } from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTrackStep } from '@/pages/create/hooks/useTrackStep';

type TState = {
  selectedContinent: string | undefined;
};

export const RegionStep = (): JSX.Element => {
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tCreate } = useTranslation('load-balancer/create');
  const { t: tRegionsList } = useTranslation('regions-list');

  const { projectId } = useParams();

  const { trackStep } = useTrackStep();

  const store = useCreateStore();
  const { data: regions, isPending: isRegionsPending } = useGetRegions(
    projectId,
  );
  const { me } = useMe();

  const [state, setState] = useState<TState>({
    selectedContinent: undefined,
  });

  return (
    <StepComponent
      title={tCreate('octavia_load_balancer_create_region_title')}
      isOpen={store.steps.get(StepsEnum.REGION).isOpen}
      isChecked={store.steps.get(StepsEnum.REGION).isChecked}
      isLocked={store.steps.get(StepsEnum.REGION).isLocked}
      order={2}
      next={{
        action: () => {
          trackStep(2);

          store.check(StepsEnum.REGION);
          store.lock(StepsEnum.REGION);

          store.open(StepsEnum.PUBLIC_IP);
        },
        label: tCommon('common_stepper_next_button_label'),
        isDisabled: store.region === null,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.REGION);
          store.uncheck(StepsEnum.REGION);
          store.open(StepsEnum.REGION);
          store.reset(
            StepsEnum.PUBLIC_IP,
            StepsEnum.PRIVATE_NETWORK,
            StepsEnum.INSTANCE,
            StepsEnum.NAME,
          );
        },
        label: tCommon('common_stepper_modify_this_step'),
      }}
    >
      <div className="mb-4">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tCreate('octavia_load_balancer_create_region_intro')}{' '}
          <OsdsLink
            href={
              REGION_AVAILABILITY_LINK[me?.ovhSubsidiary] ||
              REGION_AVAILABILITY_LINK.DEFAULT
            }
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {tCreate('octavia_load_balancer_create_region_link')}
          </OsdsLink>
        </OsdsText>
      </div>
      {isRegionsPending ? (
        <div className="text-center mt-6">
          <OsdsSpinner inline />
        </div>
      ) : (
        <TilesInputComponent<TRegion, string, string>
          items={(regions?.get(store.addon?.code) || []).filter(
            (region) => region.isEnabled,
          )}
          value={store.region}
          onInput={(region) => store.set.region(region)}
          label={(region) => region.name}
          group={{
            by: (region) => region.continent,
            label: (continent) => (
              <OsdsText
                breakSpaces={false}
                size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                color={
                  continent === state.selectedContinent
                    ? ODS_THEME_COLOR_INTENT.text
                    : ODS_THEME_COLOR_INTENT.primary
                }
              >
                <div
                  className={clsx(
                    continent === state.selectedContinent && 'font-bold',
                    'whitespace-nowrap px-2 text-lg',
                  )}
                >
                  {undefined === continent
                    ? tRegionsList('pci_project_regions_list_continent_all')
                    : continent}
                </div>
              </OsdsText>
            ),
            showAllTab: true,
          }}
          stack={{
            by: (region) => region?.macroName,
            label: (macroName) => macroName,
            title: () => tRegionsList('pci_project_regions_list_region'),
            onChange: (continent) => {
              setState({ ...state, selectedContinent: continent });
            },
          }}
        />
      )}
    </StepComponent>
  );
};
