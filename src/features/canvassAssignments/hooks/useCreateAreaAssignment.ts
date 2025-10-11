import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinCanvassAssignment, ZetkinCanvassAssignmentPostBody } from '../types';
import { canvassAssignmentCreated } from '../store';

export default function useCreateCanvassAssignment(orgId: number, assignmentId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinCanvassAssignmentPostBody) => {
    const created = await apiClient.post<
      ZetkinCanvassAssignment,
      ZetkinCanvassAssignmentPostBody
    >(`/api2/orgs/${orgId}/canvass_assignments/${assignmentId}`, data);
    dispatch(canvassAssignmentCreated(created));
  };
}
