import apiClient from './apiClient';

interface NotificationParams {
  userId: number;
  page?: number;
  pageSize?: number;
}

export const getUserNotifications = async (params: NotificationParams) => {
  try {
    const { userId, page = 1, pageSize = 20 } = params;
    const queryString = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    }).toString();

    const response = await apiClient.get(
      `/Notification/user/${userId}?${queryString}`,
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const response = await apiClient.put(
      `/Notification/${notificationId}/mark-read`,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: number) => {
  try {
    console.log(`/Notification/user/${userId}/mark-all-read`);

    const response = await apiClient.put(
      `/Notification/user/${userId}/mark-all-read`,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};
