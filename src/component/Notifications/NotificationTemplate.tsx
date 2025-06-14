import type { Post } from "../../types/Post"
import type { User } from "../../types/User";
import type { Notification } from "../../types/Notification"
import ProfilePic from "../UserInfo/ProfilePic";
import { useNavigate } from "react-router-dom";
import DisplayNameComponent from "../UserInfo/DisplayNameComponent";
import UsernameComponent from "../UserInfo/UsernameComponent";
import NotificationTypeIcon from "../UIComponent/NotificationTypeIcon";

type NotificationTemplateProps = {

    sender?: User;
    notification: Notification;
    isTempUnseen?: boolean;

}

function NotificationTemplate ({sender, notification, isTempUnseen}: NotificationTemplateProps)  {

    const navigate = useNavigate();
    const displayMessage = determineDisplayMessage();

    function determineDisplayMessage (): string {

        switch (notification.type) {

            case "like" : 
            return "liked your post";
            
            case "follow" :
            return "followed you";

        } 

        return "";

    }

    function navigateFromNotification () {
            if (notification.type == "follow") {
                navigate("/profile/"+notification.senderId)
            } else {
                navigate("/tweet/"+notification.referenceId)
            }
    }

    return (
        <>
        <div className={`h-fit w-full flex border-b-2 border-(--twitter-border) ${
            isTempUnseen ? 'bg-(--twitter-text)/20' : ' '
        }`}>

        <div className="w-18 h-fit flex justify-center text-3xl pt-4 text-center">
            <NotificationTypeIcon notificationType={notification.type}/>
        </div>

        <div className="flex flex-col w-full h-fit pr-4 pt-3">

            <div className="w-full h-fit">
            <div className="flex w-12 pb-1">
                <div className="w-10 h-10" onClick={() => navigate(`/profile/${notification.senderId}`)}>
                    <ProfilePic user={sender}/>
                </div>
            </div>
            </div>

            <div className="pb-3 w-full h-fit">
                <div className="w-full h-fit flex-col">
                    <div className="w-full h-5 flex gap-1 align-middle text-white mb-0.5">
                            <div className="font-bold"> 
                                <DisplayNameComponent user={sender}/>
                            </div>
                            <p onClick={() => navigateFromNotification()}> {displayMessage}</p>
                    </div>

                    <div className="text-(--twitter-text) max-h-32">
                        <p onClick={() => navigateFromNotification()}>

                            {notification.text.slice(0, 20)}{notification.text.length > 20 ? "..." : ""}
                        </p>
                    </div>
                </div>

            </div>

        </div>

        </div>
    </>
    )


}

export default NotificationTemplate;