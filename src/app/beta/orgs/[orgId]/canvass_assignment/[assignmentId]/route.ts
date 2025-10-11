
import { IncomingHttpHeaders } from 'http';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import BackendApiClient from 'core/api/client/BackendApiClient';


import { ZetkinCanvassAssignment } from 'features/canvassAssignments/types';


type RouteMeta = {
    params: {
      assignmentId: string;
      orgId: string;
    };
  };
  

export async function GET(request: NextRequest, { params }: RouteMeta) {
    await mongoose.connect(process.env.MONGODB_URL || '');
    const headers: IncomingHttpHeaders = {};
    request.headers.forEach((value, key) => (headers[key] = value));
    const apiClient = new BackendApiClient(headers);
  
    const assignements = await apiClient.get<ZetkinCanvassAssignment[]>(
      `/api2/orgs/${params.orgId}/canvass_assignments?size=100`
    );
    
  
    for (const assignment of assignements) {

      if (assignment.id === parseInt(params.assignmentId)) {
        return NextResponse.json({ data: assignment });
      }
    }
  
    return NextResponse.json({ data: null }, { status: 404 });
}