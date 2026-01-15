import https from './https';
import type {
  DashboardSummaryDto,
  TodoResponseDto,
  CreateTodoDto,
  UpdateTodoDto,
} from '@/models/generated';

const dashboardAPI = {
  async getDashboard() {
    const response = await https.get<DashboardSummaryDto>(`/dashboard`);
    return response;
  },
  async getDashboardTodos() {
    const response = await https.get<TodoResponseDto[]>('/dashboard/todos');
    return response;
  },
  async createDashboardTodo(data: CreateTodoDto) {
    const response = await https.post<CreateTodoDto, TodoResponseDto>('/dashboard/todos', data);
    return response;
  },
  async updateDashboardTodo(id: string, data: UpdateTodoDto) {
    const response = await https.patch<UpdateTodoDto, TodoResponseDto>(
      `/dashboard/todos/${id}`,
      data,
    );
    return response;
  },
  async deleteDashboardTodo(id: string) {
    const response = await https.delete(`/dashboard/todos/${id}`);
    return response;
  },
};

export default dashboardAPI;
