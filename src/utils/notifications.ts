import { NotificationData, notifications } from "@mantine/notifications";

export const showErrorNotification = (message: string = "Error", notificationData?: NotificationData) => {
    notifications.show({
        message,
        color: "red",
        ...notificationData,
    })
}