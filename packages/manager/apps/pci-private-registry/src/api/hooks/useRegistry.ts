import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovhcloud/manager-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { compareFunction, paginateResults } from '@/helpers';
import {
  deleteRegistry,
  getAllRegistries,
  getRegistryPlan,
  renameRegistry,
  TRegistry,
} from '../data/registry';
import queryClient from '@/queryClient';

export const getRegistryQueryPrefix = (projectId: string) => [
  'project',
  projectId,
  'registry',
];

export const getAllRegistriesQueryKey = (projectId: string) => [
  ...getRegistryQueryPrefix(projectId),
];

export const getRegistryPlanQueryKey = (
  projectId: string,
  registryId: string,
) => [...getRegistryQueryPrefix(projectId), registryId, 'plan'];

export const useGetAllRegistries = (projectId: string) =>
  useQuery({
    queryKey: getAllRegistriesQueryKey(projectId),
    queryFn: () => getAllRegistries(projectId),
  });

export const useGetRegistryPlan = (projectId: string, registryId: string) =>
  useQuery({
    queryKey: getRegistryPlanQueryKey(projectId, registryId),
    queryFn: () => getRegistryPlan(projectId, registryId),
  });

export const sortRegistries = (
  registries: TRegistry[],
  sorting: ColumnSort,
): TRegistry[] => {
  const data = [...registries];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(compareFunction<TRegistry>(sortKey as keyof TRegistry));
    if (desc) {
      data.reverse();
    }
  }

  return data;
};

export const useAllRegistries = (
  projectId: string,
  pagination: PaginationState,
  filters: Filter[],
  sorting: ColumnSort,
) => {
  const { data: allRegistries, error, isPending } = useGetAllRegistries(
    projectId,
  );

  return useMemo(
    () => ({
      isPending,
      data: paginateResults<TRegistry>(
        applyFilters(sortRegistries(allRegistries || [], sorting), filters),
        pagination,
      ),
      error,
    }),
    [allRegistries, isPending, error, pagination, filters, sorting],
  );
};

type DeleteRegistryProps = {
  projectId: string;
  registryId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};
export const useDeleteRegistry = ({
  projectId,
  registryId,
  onError,
  onSuccess,
}: DeleteRegistryProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteRegistry(projectId, registryId),
    onError,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getRegistryQueryPrefix(projectId),
      });
      onSuccess();
    },
  });
  return {
    deleteRegistry: () => mutation.mutate(),
    ...mutation,
  };
};

type RenameRegistryProps = {
  projectId: string;
  registryId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};
export const useRenameRegistry = ({
  projectId,
  registryId,
  onError,
  onSuccess,
}: RenameRegistryProps) => {
  const mutation = useMutation({
    mutationFn: async (name: string) =>
      renameRegistry(projectId, registryId, name),
    onError,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getRegistryQueryPrefix(projectId),
      });
      onSuccess();
    },
  });
  return {
    renameRegistry: (name: string) => mutation.mutate(name),
    ...mutation,
  };
};
