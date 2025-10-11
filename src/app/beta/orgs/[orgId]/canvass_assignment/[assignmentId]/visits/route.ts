import { IncomingHttpHeaders } from 'http';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinLocationVisit } from 'features/canvass/types';

export async function GET(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const visits = await apiClient.get<ZetkinLocationVisit[]>(
    `/api2/orgs/${params.orgId}/canvass_assignments/${params.assignmentId}/visits`
  );

  var visitsWithAssignmentId: ZetkinLocationVisit[] = [];

  for (const visit of visits) {
    if (visit.assignment_id === parseInt(params.assignmentId)) {
      visitsWithAssignmentId.push(visit);
    }
  }
  return NextResponse.json({ data: visitsWithAssignmentId }, { status: 200 });
}