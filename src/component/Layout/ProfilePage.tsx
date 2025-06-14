import { useContext, useEffect, useState } from "react";
import ProfilePageOverview from "../UserInfo/ProfilePageOverview";
import TabList from "./TabList";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../context/currentUser/CurrentUserProvider";
import type { User } from "../../types/User";
import { useUserCache } from "../../context/cache/UserCacheProvider";
import Feed from "./Feed";
import { useFeedContext } from "../../context/feed/FeedContext";
import { HeaderContentContext } from "../../context/misc/HeaderContentProvider";

function ProfilePage() {
    const tabs = ["Tweets", "Replies", "Liked", "Media"];
    const [activeTab, setActiveTab] = useState("Tweets");

    const { currentUserPostsIds, currentUserLikedIds, currentUserReplies } = useFeedContext();
    const { ID } = useParams();
    const pageUserID = Number(ID);

    const { currentUser } = useCurrentUser();
    const { addToUserCache, getUserFromCache, fetchUsersFromServerById, userCache } = useUserCache();
    const {setHeaderContent} = useContext(HeaderContentContext);

    const [pageUser, setPageUser] = useState<User | null>(null);

    useEffect(() => {
        if (pageUserID) {
            determinePageUser();
        }
    }, [pageUserID]);


    useEffect(() => {
        if (pageUser) {
            setHeaderContent(<div className="flex flex-col gap-0.5 justify-center w-full"><p>{pageUser.displayName}</p> <div className="flex items-center gap-1 text-sm text-(--twitter-text)"> <p>{pageUser.posts.length}</p> <p>Posts</p> </div> </div>);
        }
    }, [pageUser])

    async function determinePageUser() {
        if (currentUser && pageUserID === currentUser.id) {
            setPageUser(currentUser);
        } else {
            const userInCache = getUserFromCache(pageUserID);
            if (userInCache) {
                setPageUser(userInCache);
            } else {
                const fetchedUser: User[] = await fetchUsersFromServerById([pageUserID]);
                addToUserCache(fetchedUser[0]);
                setPageUser(fetchedUser[0]);
            }
        }
    }

    function setNewUser(user: User) {

        if (user) {
            setPageUser(user);
        }

    }

    function getRelevantPostIds(): number[] {
        if (!pageUser) {
            console.log("⚠️ getRelevantPostIds: pageUser missing");
            return [];
        }

        const isOwner = currentUser && currentUser.id === pageUser.id;
        console.log(`📌 Active Tab: ${activeTab} | Is Owner: ${isOwner}`);

        switch (activeTab) {
            case "Tweets":
                const posts = isOwner ? currentUserPostsIds : pageUser.posts;
                return posts;
            case "Replies":
                const postsAndReplies = isOwner ? currentUserReplies : pageUser.replies;
                return postsAndReplies;
            case "Liked":
                const likes = isOwner ? currentUserLikedIds : pageUser.likedPosts;
                return likes;
            case "Media":
                return [];
            default:
                return [];
        }
    }

    const postIdsToRender = getRelevantPostIds();

    return (
        <div className="flex flex-col h-full w-full flex-grow overflow-y-auto">
            <ProfilePageOverview  pageUser={pageUser} setNewUser={setNewUser}/>

            <div className="">
                <TabList tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="mb-14">
                <Feed showAsMainPost={true} key={activeTab} postIdsArray={postIdsToRender} />
            </div>        
        </div>
    );
}

export default ProfilePage;