import { useCurrentUser } from "../../context/currentUser/CurrentUserProvider"
import { usePostCache } from "../../context/cache/PostCacheProvider"
import { useUserCache } from "../../context/cache/UserCacheProvider";
import type { Notification } from "../../types/Notification";
import LoadingIcon from "../UIComponent/LoadingIcon";
import NotificationTemplate from "../Notifications/NotificationTemplate";
import type { User } from "../../types/User";
import { useEffect, useState } from "react";

type NotificationFeedProps = {
    tempUnreads?: number[];
}

function NotificationFeed ({tempUnreads} : NotificationFeedProps) {

    const {currentUser, notifications } = useCurrentUser()
    const {getUserFromCache, addToUserCache, fetchUsersFromServerById} = useUserCache();
    const [bufferedTimeOut, setBufferedTimeout] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setBufferedTimeout(true)
        }, 200)
    }, [])

    useEffect(() => {
        if (notifications) {
            loadUsers();
        }
    }, [notifications])
    
    async function fetchUnloadedUsers (notFoundUsers : number[]) {

        const fetchedUsers: User[] = await fetchUsersFromServerById(notFoundUsers);
        for (let i = 0; i < fetchedUsers.length; i++) {
            addToUserCache(fetchedUsers[i]);
        }

    }

        async function loadUsers() {
        const notFoundUsers : number[] = [];
        for (const notification of notifications) {
            const senderId = notification.senderId;
            const sender = getUserFromCache(senderId);
            if (!sender) {
                notFoundUsers.push(senderId);
            }
        }
    
        if (notFoundUsers.length > 0) {
            await fetchUnloadedUsers(notFoundUsers);
        }
    }

    return (
        
        <div className='w-full'>
            {bufferedTimeOut && notifications && notifications.length > 0 &&
            notifications.every(notification => getUserFromCache(notification.senderId)) ? (

                <div className="flex flex-col-reverse w-full">
                {notifications.map((notification) => (
                    <NotificationTemplate isTempUnseen={tempUnreads?.includes(notification.id)} sender={getUserFromCache(notification.senderId)} notification={notification} />
                ))}
                </div>

            ) : (
                <div className="flex justify-center py-2 flex-col w-full">
                    <LoadingIcon />
                </div>
            )}
        </div>

    )

}

export default NotificationFeed;