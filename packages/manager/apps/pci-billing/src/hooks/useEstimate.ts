import { useCallback, useMemo } from 'react';
import { useUsage } from '@/api/hooks/useUsage';
import {
  HOURLY_PRODUCTS,
  THourlyProduct,
  TResourceUsage,
  TUsageKind,
} from '@/api/data/usage';
import { roundNumber } from '@/pages/billing/estimate/utils';

const getTotalPrice = (
  products: { totalPrice: number }[],
  round: { items: boolean; all: boolean } = { items: true, all: true },
) => {
  const total = (products || []).reduce(
    (sum, { totalPrice }) =>
      sum + (round.items ? roundNumber(totalPrice) : totalPrice),
    0,
  );

  return round.all ? roundNumber(total) : total;
};

export const useEstimate = (projectId: string, kind: TUsageKind) => {
  const { data: usage } = useUsage(projectId, kind);

  const getResourcePrice = useCallback(
    (resourceUsage: TResourceUsage) =>
      getTotalPrice(
        (usage?.resourcesUsage || [])
          .find((r) => r.type === resourceUsage)
          ?.resources.map((r) => r.components)
          .flat(2),
        { items: false, all: false },
      ),
    [usage],
  );

  const getHourlyPrice = useCallback(
    (product: THourlyProduct) => {
      if (!usage?.hourlyUsage) return 0;
      switch (product) {
        case 'instance':
          return roundNumber(
            usage?.hourlyUsage?.instance
              ? usage?.hourlyUsage?.instance?.reduce(
                  (sum, { totalPrice }) => sum + roundNumber(totalPrice),
                  0,
                )
              : 0,
          );
        case 'snapshot':
          return roundNumber(
            usage?.hourlyUsage?.snapshot
              ? usage?.hourlyUsage?.snapshot?.reduce(
                  (sum, { totalPrice }) => sum + roundNumber(totalPrice),
                  0,
                )
              : 0,
          );
        case 'objectStorage':
          return roundNumber(
            usage?.hourlyUsage?.storage
              ? usage?.hourlyUsage.storage
                  .filter((s) => s.type !== 'pca')
                  .map((s) => roundNumber(s.totalPrice))
                  .reduce((sum, item) => sum + roundNumber(item), 0)
              : 0,
          );
        case 'archiveStorage':
          return roundNumber(
            usage?.hourlyUsage?.storage
              ? usage?.hourlyUsage.storage
                  .filter((s) => s.type === 'pca')
                  .map((s) => roundNumber(s.totalPrice))
                  .reduce((sum, item) => sum + roundNumber(item), 0)
              : 0,
          );
        case 'volume':
          return roundNumber(
            usage?.hourlyUsage?.volume
              ? usage?.hourlyUsage?.volume?.reduce(
                  (resourceAcc, { totalPrice }) =>
                    resourceAcc + roundNumber(totalPrice),
                  0,
                )
              : 0,
          );
        case 'bandwidth':
          return roundNumber(
            usage?.hourlyUsage?.instanceBandwidth
              ? usage?.hourlyUsage.instanceBandwidth
                  .filter((b) => b.outgoingBandwidth)
                  .map((b) => roundNumber(b.totalPrice))
                  .reduce((sum, item) => sum + roundNumber(item), 0)
              : 0,
          );
        case 'privateRegistry':
          return getResourcePrice('registry');
        case 'kubernetesLoadBalancer':
          return getResourcePrice('loadbalancer');
        case 'notebooks':
          return getResourcePrice('ai-notebook');
        case 'serving':
          return getResourcePrice('ai-serving-engine');
        case 'training':
          return getResourcePrice('ai-training');
        case 'aiDeploy':
          return getResourcePrice('ai-app');
        case 'dataProcessing':
          return getResourcePrice('data-processing-job');
        case 'databases':
          return getResourcePrice('databases');
        case 'floatingIP':
          return getResourcePrice('floatingip');
        case 'gateway':
          return getResourcePrice('gateway');
        case 'octaviaLoadBalancer':
          return getResourcePrice('octavia-loadbalancer');
        case 'publicIP':
          return getResourcePrice('publicip');
        default:
          return 0;
      }
    },
    [usage],
  );

  const getMonthlyPrice = useCallback(() => {
    const instancePrice = roundNumber(
      usage?.monthlyUsage?.instance
        ? usage?.monthlyUsage?.instance?.reduce(
            (sum, { totalPrice }) => sum + roundNumber(totalPrice),
            0,
          )
        : 0,
    );
    return instancePrice;
  }, [usage]);

  const totalHourlyPrice = roundNumber(
    HOURLY_PRODUCTS.map((product) => getHourlyPrice(product)).reduce(
      (sum, price) => sum + price,
      0,
    ),
  );

  const totalMonthlyPrice = roundNumber(getMonthlyPrice());

  const totalPrice = roundNumber(totalHourlyPrice + totalMonthlyPrice);

  return useMemo(
    () => ({
      totalHourlyPrice,
      totalMonthlyPrice,
      totalPrice,
    }),
    [usage],
  );
};
