import cookieConfig from "@/config/cookie";
import { NotificationData, notifications } from "@mantine/notifications";

export type NotificationType = "success" | "error";

/**
 * Shows an error notification. This function is deprecated and should be replaced by `showNotification`.
 * 
 * @deprecated
 * @param [message="Error"] The message to be displayed in the notification.
 * @param notificationData Optional additional data for the notification.
 */
export const showErrorNotification = (message: string = "Error", notificationData?: NotificationData) => {
    notifications.show({
        message,
        color: "red",
        ...notificationData,
    })
}

/**
 * Shows a notification with configurable type and message.
 * 
 * @param message The message to be displayed in the notification.
 * @param [type="success"] The type of the notification, either "success" or "error".
 * @param notificationData Optional additional data for the notification.
 */
export const showNotification = (message: string, type: NotificationType = "success", notificationData?: NotificationData) => {
    notifications.show({
        message,
        color: type === "error" ? "red" : "green",
        ...notificationData
    })
}
