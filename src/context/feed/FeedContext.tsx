import { createContext, useContext, useEffect, useState } from "react";
import type {ReactNode} from "react";
import { useCurrentUser } from "../currentUser/CurrentUserProvider";

type FeedContextType = {
    forYouFeedIds: number[];
    addToForYouFeedIds: (id: number) => void;
    getForYouFeedIds: () => void;

    currentUserPostsIds: number[];
    addToCurrentUserPosts: (id: number) => void;

    currentUserBookmarkIds: number[];
    addToCurrentUserBookmarks: (id: number) => void;
    initializeCurrentUserBookmarks: () => void;
    removeCurrentUserBookmarks: (id: number) => void;

    currentUserLikedIds: number[];
    addToCurrentUserLikes: (id: number) => void;
    removeFromCurrentUserLikes: (id: number) => void;
    initializeCurrentUserLikes: () => void;

    currentUserReplies: number[];
    addToCurrentUserReplies: (id: number) => void;

    currentUserRepostedIds: number[];
    addToCurrentUserReposted: (id: number) => void;
    removeFromCurrentUserReposted: (id: number) => void;
    initializeCurrentUserRetweetIds: () => void;
  };

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider = ({ children }: { children: ReactNode }) => {
    
    const {currentUser} = useCurrentUser();
    const [forYouFeedIds, setForYouFeedIds] = useState<number[]>([]);
    const [currentUserPostsIds, setCurrentUserPostsIds] = useState<number[]>([]);
    const [currentUserBookmarkIds, setCurrentUserBookmarkIds] = useState<number[]>([]);
    const [currentUserLikedIds, setCurrentUserLikedIds] = useState<number[]>([]);
    const [currentUserReplies, setCurrentUserReplies] = useState<number[]>([]);
    const [currentUserRepostedIds, setCurrentUserRepostedIds] = useState<number[]>([]);

    

    function addToForYouFeedIds (id: number) {

        setForYouFeedIds((prev) => [...prev, id])

    }

    function addToCurrentUserPosts(id: number) {
        if (currentUser) {
            setCurrentUserPostsIds((prev) => [...prev, id])
        }
    }

    function addToCurrentUserReplies(id: number) {
      if (currentUser) {
        setCurrentUserReplies((prev) => [...prev, id])
      }
    }

    function addToCurrentUserReposted(id: number) {
      if (currentUser) {
        setCurrentUserRepostedIds((prev) => [...prev, id])
      }
    }

    function addToCurrentUserBookmarks(id: number) {
      if (currentUser) {
          setCurrentUserBookmarkIds((prev) => [...prev, id])
      }
    }

    function removeCurrentUserBookmarks (id: number) {
      if (currentUser) {
        setCurrentUserBookmarkIds((prev) => prev.filter((bookmarkId) => bookmarkId !== id));
      }
    }

    function removeFromCurrentUserReposted (id: number) {
      if (currentUser) {
        setCurrentUserRepostedIds((prev) => prev.filter((repostedId) => repostedId !== id));
      }
    }

    function initializeCurrentUserBookmarks () {
      if (currentUser) {
        setCurrentUserBookmarkIds(currentUser.bookmarkedPosts)
      }
    }

    function addToCurrentUserLikes(id: number) {
      if (currentUser) {
          setCurrentUserLikedIds((prev) => [...prev, id])
      }
    }

    function removeFromCurrentUserLikes (id: number) {
      if (currentUser) {
        setCurrentUserLikedIds((prev) => prev.filter((likedPostId) => likedPostId !== id));
      }
    }

    function initializeCurrentUserLikes () {
      if (currentUser) {
        setCurrentUserLikedIds(currentUser.likedPosts)
      }
    }

    function initializeCurrentUserRetweetIds () {
      if (currentUser) {
        setCurrentUserBookmarkIds(currentUser.retweets)
      }
    }


    function getForYouFeedIds () {

        fetch(`http://localhost:8080/api/posts/getAllPostIds`)
        .then(res => res.json())
        .then(data => {
            setForYouFeedIds(data);
        })

    }

    useEffect(() => {
      if (forYouFeedIds.length < 1) {
        getForYouFeedIds();
      }
    }, [forYouFeedIds])
    
      useEffect(() => {
        if (currentUser && currentUser.likedPosts && currentUser.likedPosts.length > 0) {
          setCurrentUserLikedIds(currentUser.likedPosts);
        }
        if (currentUser && currentUser.bookmarkedPosts && currentUser.bookmarkedPosts.length > 0) {
          setCurrentUserBookmarkIds(currentUser.bookmarkedPosts);
        }
        if (currentUser && currentUser.posts && currentUser.posts.length > 0) {
          setCurrentUserPostsIds(currentUser.posts);
        }
        if (currentUser && currentUser.replies && currentUser.replies.length > 0) {
          setCurrentUserReplies(currentUser.replies)
        }
        if (currentUser && currentUser.retweets && currentUser.retweets.length > 0) {
          setCurrentUserRepostedIds(currentUser.retweets)
        }
      }, [currentUser]);

    return (
      <FeedContext.Provider value={{initializeCurrentUserRetweetIds, currentUserRepostedIds, addToCurrentUserReposted, removeFromCurrentUserReposted, addToCurrentUserReplies, currentUserReplies,  addToCurrentUserLikes, removeFromCurrentUserLikes, initializeCurrentUserLikes, forYouFeedIds, removeCurrentUserBookmarks, addToForYouFeedIds, getForYouFeedIds, currentUserPostsIds, addToCurrentUserPosts, initializeCurrentUserBookmarks, addToCurrentUserBookmarks, currentUserBookmarkIds, currentUserLikedIds}}>
        {children}
      </FeedContext.Provider>
    );
  };
  
  export const useFeedContext = () => {
    const context = useContext(FeedContext);
    if (!context) throw new Error("useFeedContext must be used within a FeedProvider");
    return context;
  };