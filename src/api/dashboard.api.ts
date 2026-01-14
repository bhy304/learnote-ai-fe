import type { DashboardResponse, DashboardNote } from '@/types/dashboard.type';
import https from './https';

import notesMockData from '@/mock/notes.json';
import dashboardMockData from '@/mock/dashboard.json';

const dashboardAPI = {
  // async getDashboard(userId: string) {
  //   const response = await https.get<DashboardResponse>(`/dashboard/${userId}`);
  //   return response;
  // },

  async getDashboard(): Promise<DashboardResponse> {
    // 실제 서버 호출 대신 로컬 JSON 데이터를 반환합니다.
    // Promise.resolve를 사용하여 비동기 통신을 흉내냅니다.
    return Promise.resolve(dashboardMockData as unknown as DashboardResponse);
  },
  async getNotes(): Promise<DashboardNote[]> {
    // 실제 서버 호출 대신 로컬 JSON 데이터를 반환합니다.
    // Promise.resolve를 사용하여 비동기 통신을 흉내냅니다.
    return Promise.resolve(notesMockData as unknown as DashboardNote[]);
  },
};

export default dashboardAPI;
