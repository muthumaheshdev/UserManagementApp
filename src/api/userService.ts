import {apiClient} from './index';

export const fetchUsersAPI = async (): Promise<any[]> => {
  const response = await apiClient.get('/users');
  return response.data;
};
