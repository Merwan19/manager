import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import { paginateResults, sortResults } from '@/helpers';
import { deleteL7Rule, getL7Rules, TL7Rule } from '@/api/data/l7Rules';
import queryClient from '@/queryClient';

export const useGetAllL7Rules = (
  projectId: string,
  policyId: string,
  region: string,
) =>
  useQuery({
    queryKey: ['l7Rules', projectId, 'policy', policyId, region],
    queryFn: () => getL7Rules(projectId, region, policyId),
    select: (l7Rules) =>
      l7Rules.map((l7Rule) => ({
        ...l7Rule,
        search: `${l7Rule.key} ${l7Rule.value} ${l7Rule.invert} ${l7Rule.ruleType} ${l7Rule.compareType} ${l7Rule.provisioningStatus} ${l7Rule.operatingStatus}`,
      })),
  });

export const useL7Rules = (
  projectId: string,
  policyId: string,
  region: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const { data: allL7Rules, error, isLoading, isPending } = useGetAllL7Rules(
    projectId,
    policyId,
    region,
  );
  return useMemo(
    () => ({
      isLoading,
      isPending,
      allL7Policies: allL7Rules,
      paginatedL7Rules: paginateResults<TL7Rule>(
        sortResults<TL7Rule>(applyFilters(allL7Rules || [], filters), sorting),
        pagination,
      ),
      error,
    }),
    [allL7Rules, error, isLoading, isPending, pagination, sorting, filters],
  );
};

type DeleteRulesProps = {
  projectId: string;
  policyId: string;
  ruleId: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteL7Rule = ({
  projectId,
  policyId,
  ruleId,
  region,
  onError,
  onSuccess,
}: DeleteRulesProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteL7Rule(projectId, region, policyId, ruleId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['l7Rules', projectId],
      });
      onSuccess();
    },
  });
  return {
    deleteL7Rule: () => mutation.mutate(),
    ...mutation,
  };
};
