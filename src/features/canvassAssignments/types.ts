import { ZetkinAreaAssignment, ZetkinLocation, ZetkinMetric } from 'features/areaAssignments/types';
import {  YesNoMetricResponse, Scale5MetricResponse, Zetkin2Household, MetricResponse } from 'features/canvass/types';
import { ZetkinQuery, ZetkinSmartSearchFilter } from 'features/smartSearch/components/types';
import { ZetkinPerson } from 'utils/types/zetkin';

export type ZetkinCanvassAssignment = {
  id: number;
  name: string;
  description: string;
  households: Zetkin2Household[];
  filter: ZetkinSmartSearchFilter;
  metric: ZetkinMetric;
  created: string;
  created_by_user_id: number;
};

export type ZetkinCanvassAssignee = {
  id: number;
  assignment_id: number;
  user_id: number;
  area_id: number;
};

export type ZetkinCanvassAssignmentStats = {
  num_households: number;
  num_households_visited: number;
  num_households_successfully_visited: number;
};


export type ZetkinCanvassAssignmentPostBody = Partial<
  Omit<ZetkinCanvassAssignment, 'id' | 'campaign' | 'organization'>
>;

export type ZetkinCanvassAssignmentPatchbody = Partial<
  Omit<ZetkinCanvassAssignment, 'id'>
>;


