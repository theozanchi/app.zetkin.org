import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteListCreated,
  remoteListLoad,
  remoteListLoaded,
  remoteItemLoad,
  remoteItemDeleted,
  remoteItemUpdated,
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';


import {
  AreaCardData,
  ZetkinCanvassAssignmentStats,
  ZetkinCanvassAssignment,
  ZetkinCanvassAssignee,
  ZetkinLocation,
  ZetkinAssignmentAreaStats,
  SessionDeletedPayload,
  ZetkinMetric,
} from './types';

import { Zetkin2Area } from 'features/areas/types';
import { Zetkin2Household } from 'features/canvass/types';

export interface CanvassAssignmentsStoreSlice {
  areaGraphByAssignmentId: Record<
    number,
    RemoteList<AreaCardData & { id: number }>
  >;
  areaStatsByAssignmentId: Record<
    number,
    RemoteItem<ZetkinAssignmentAreaStats & { id: number }>
  >;
  CanvassAssignmentList: RemoteList<ZetkinCanvassAssignment>;
  areasByAssignmentId: Record<string, RemoteList<Zetkin2Area>>;
  assigneesByAssignmentId: Record<
    number,
    RemoteList<ZetkinAreaAssignee & { id: string }>
  >;
  householdsByAssignmentId: Record<number, RemoteList<Zetkin2Household>>;
  householdsByAssignmentIdAndAreaId: Record<string, RemoteList<Zetkin2Household>>;
  metricsByAssignmentId: Record<number, RemoteList<ZetkinMetric>>;
  statsByAreaAssId: Record<
    number,
    RemoteItem<ZetkinCanvassAssignmentStats & { id: number }>
  >;
}

const initialState: CanvassAssignmentsStoreSlice = {
  CanvassAssignmentList: remoteList(),
  areaGraphByAssignmentId: {},
  areaStatsByAssignmentId: {},
  areasByAssignmentId: {},
  assigneesByAssignmentId: {},
  householdsByAssignmentId: {},
  householdsByAssignmentIdAndAreaId: {},
  metricsByAssignmentId: {},
  statsByAreaAssId: {},
};

const canvassAssignmentSlice = createSlice({
  initialState: initialState,
  name: 'canvassAssignments',
  reducers: {
    canvassAssignmentCreated: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment>
    ) => {
      const canvassAssignment = action.payload;
      remoteItemUpdated(state.canvassAssignmentList, canvassAssignment);
    },
    canvassAssignmentDeleted: (state, action: PayloadAction<number>) => {
      const areaAssId = action.payload;
      remoteItemDeleted(state.canvassAssignmentList, areaAssId);
    },
    canvassAssignmentLoad: (state, action: PayloadAction<number>) => {
      const areaAssId = action.payload;
      remoteItemLoad(state.canvassAssignmentList, areaAssId);
    },
    canvassAssignmentLoaded: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment>
    ) => {
      const canvassAssignment = action.payload;
      remoteItemUpdated(state.canvassAssignmentList, canvassAssignment);
    },
    canvassAssignmentUpdated: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment>
    ) => {
      const updatedArea = action.payload;
      remoteItemUpdated(state.canvassAssignmentList, updatedArea);
    },
    canvassAssignmentsLoad: (state) => {
      state.canvassAssignmentList = remoteListLoad(state.canvassAssignmentList);
    },
    canvassAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinCanvassAssignment[]>
    ) => {
      state.canvassAssignmentList = remoteListLoaded(action.payload);
    },
    assigneeAdded: (state, action: PayloadAction<ZetkinCanvassAssignee>) => {
      const assignee = action.payload;
      state.assigneesByAssignmentId[assignee.assignment_id] ||=
        remoteListCreated();

      remoteItemUpdated(state.assigneesByAssignmentId[assignee.assignment_id], {
        ...assignee,
        id: `${assignee.user_id}/${assignee.area_id}`,
      });

      const hasStatsItem = !!state.areaStatsByAssignmentId[
        assignee.assignment_id
      ].data?.stats.find((statsItem) => statsItem.area_id == assignee.area_id);

      if (!hasStatsItem) {
        state.areaStatsByAssignmentId[assignee.assignment_id].isStale = true;
      }
    },
    assigneeDeleted: (state, action: PayloadAction<SessionDeletedPayload>) => {
      const { areaId, assignmentId, assigneeId } = action.payload;

      const sessionsList = state.assigneesByAssignmentId[assignmentId];

      if (sessionsList) {
        const filteredSessions = sessionsList.items.filter(
          (item) =>
            !(
              item.data?.area_id === areaId && item.data?.user_id === assigneeId
            )
        );
        state.assigneesByAssignmentId[assignmentId] = {
          ...sessionsList,
          items: filteredSessions,
        };
      }
    },
    assigneesLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.assigneesByAssignmentId[assignmentId] = remoteListLoad(
        state.assigneesByAssignmentId[assignmentId]
      );
    },
    assigneesLoaded: (
      state,
      action: PayloadAction<[number, ZetkinAreaAssignee[]]>
    ) => {
      const [assignmentId, sessions] = action.payload;

      state.assigneesByAssignmentId[assignmentId] = remoteListLoaded(
        sessions.map((session) => ({
          ...session,
          id: `${session.user_id}/${session.area_id}`,
        }))
      );
    },
    assignmentAreasLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.areasByAssignmentId[assignmentId] = remoteListLoad(
        state.areasByAssignmentId[assignmentId]
      );
    },
    assignmentAreasLoaded: (
      state,
      action: PayloadAction<[number, Zetkin2Area[]]>
    ) => {
      const [assignmentId, areas] = action.payload;
      state.areasByAssignmentId[assignmentId] = remoteListLoaded(areas);
    },
    locationCreated: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;

      Object.values(state.locationsByAssignmentId).forEach((list) => {
        remoteItemUpdated(list, location);
      });

      Object.values(state.locationsByAssignmentIdAndAreaId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
    },
    locationLoaded: (
      state,
      action: PayloadAction<[number, ZetkinLocation]>
    ) => {
      const [assignmentId, location] = action.payload;

      remoteItemUpdated(state.locationsByAssignmentId[assignmentId], location);

      Object.keys(state.locationsByAssignmentIdAndAreaId).forEach((key) => {
        const [keyAssignmentIdStr] = key.split(':');
        const keyAssignmentId = Number(keyAssignmentIdStr);

        if (keyAssignmentId == assignmentId) {
          const list = state.locationsByAssignmentIdAndAreaId[key];
          if (list.items.some((item) => item.id == location.id)) {
            remoteItemUpdated(list, location);
          }
        }
      });
    },
    locationUpdated: (state, action: PayloadAction<ZetkinLocation>) => {
      const location = action.payload;

      Object.values(state.locationsByAssignmentId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
      Object.values(state.locationsByAssignmentIdAndAreaId).forEach((list) => {
        remoteItemUpdated(list, location);
      });
    },
    locationsLoad: (state, action: PayloadAction<string>) => {
      const key = action.payload;

      state.locationsByAssignmentIdAndAreaId[key] = remoteListLoad(
        state.locationsByAssignmentIdAndAreaId[key]
      );

      const [assignmentIdStr] = key.split(':');
      const assignmentId = Number(assignmentIdStr);
      state.locationsByAssignmentId[assignmentId] = remoteListLoad(
        state.locationsByAssignmentId[assignmentId]
      );
    },
    locationsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinLocation[]]>
    ) => {
      const [key, locations] = action.payload;

      state.locationsByAssignmentIdAndAreaId[key] = remoteListLoaded(locations);

      const [assignmentIdStr] = key.split(':');
      const assignmentId = Number(assignmentIdStr);
      state.locationsByAssignmentId[assignmentId] = remoteListLoad(
        state.locationsByAssignmentId[assignmentId]
      );
    },
    metricCreated: (state, action: PayloadAction<[number, ZetkinMetric]>) => {
      const [assignmentId, metric] = action.payload;
      remoteItemUpdated(state.metricsByAssignmentId[assignmentId], metric);
    },
    metricDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [assignmentId, metricId] = action.payload;
      remoteItemDeleted(state.metricsByAssignmentId[assignmentId], metricId);
    },
    metricUpdated: (state, action: PayloadAction<[number, ZetkinMetric]>) => {
      const [assignmentId, metric] = action.payload;
      remoteItemUpdated(state.metricsByAssignmentId[assignmentId], metric);
    },
    metricsLoad: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;
      state.metricsByAssignmentId[assignmentId] = remoteListLoad(
        state.metricsByAssignmentId[assignmentId]
      );
    },
    metricsLoaded: (state, action: PayloadAction<[number, ZetkinMetric[]]>) => {
      const [assignmentId, metrics] = action.payload;
      state.metricsByAssignmentId[assignmentId] = remoteListLoaded(metrics);
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const areaAssId = action.payload;

      if (!state.statsByAreaAssId[areaAssId]) {
        state.statsByAreaAssId[areaAssId] = remoteItem(areaAssId);
      }
      const statsItem = state.statsByAreaAssId[areaAssId];

      state.statsByAreaAssId[areaAssId] = remoteItem(areaAssId, {
        data: statsItem?.data || null,
        isLoading: true,
      });
    },
    statsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinAreaAssignmentStats]>
    ) => {
      const [areaAssId, stats] = action.payload;

      state.statsByAreaAssId[areaAssId] = remoteItem(areaAssId, {
        data: { id: areaAssId, ...stats },
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
    },
  },
});

export default canvassAssignmentSlice;
export const {
  areaGraphLoad,
  areaGraphLoaded,
  areaStatsLoad,
  areaStatsLoaded,
  canvassAssignmentCreated,
  canvassAssignmentDeleted,
  canvassAssignmentLoad,
  canvassAssignmentLoaded,
  canvassAssignmentUpdated,
  canvassAssignmentsLoad,
  canvassAssignmentsLoaded,
  assigneeAdded,
  assigneesLoad,
  assigneesLoaded,
  assignmentAreasLoad,
  assignmentAreasLoaded,
  locationCreated,
  locationLoaded,
  locationsLoad,
  locationsLoaded,
  locationUpdated,
  metricCreated,
  metricDeleted,
  metricUpdated,
  metricsLoad,
  metricsLoaded,
  assigneeDeleted,
  statsLoad,
  statsLoaded,
} = canvassAssignmentSlice.actions;
