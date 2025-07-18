import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { areasLoad, areasLoaded } from '../store';
import { Zetkin2Area } from '../types';

export default function useAreas(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.areas.areaList);

  return loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => areasLoad(),
    actionOnSuccess: (data) => areasLoaded(data),
    loader: () => apiClient.get<Zetkin2Area[]>(`/api2/orgs/${orgId}/areas`),
  });
}
