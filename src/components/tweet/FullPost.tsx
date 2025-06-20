import { useParams } from "react-router-dom";
import FullPostTemplate from "./FullPostTemplate.tsx";
import { useCurrentUser } from "../../context/Auth/CurrentUserProvider.tsx";
import { usePost } from "../../lib/hooks/queries/usePost.tsx";
import ComposeTweet from "../input/ComposeTweet.tsx";
import Feed from "../layout/feed/Feed.tsx";
import { useContext, useEffect } from "react";
import { HeaderContentContext } from "../../context/GlobalState/HeaderContentProvider.tsx";

function FullPost() {
  const { postId } = useParams();
  const numericPostId = Number(postId);
  const { currentUser } = useCurrentUser();

  if (!postId || isNaN(numericPostId)) {
    return <div className="text-white">Invalid post ID.</div>;
  }

  const { data: post } = usePost(parseInt(postId));

  const {setHeaderContent} = useContext(HeaderContentContext);
  useEffect(() => {
    if (post) {
      setHeaderContent(<p>{post.parentId ? "Thread" : "Tweet"}</p>);
      console.log("Post in render:", post.bookmarkedBy);
    }
  }, [post]);

  return (
    <div className="flex flex-col w-full text-white">

      {post && (
        <>
        {post.parentId && (
            <FullPostTemplate
              postId={post.parentId}
              showLine={true}
            />
        )}

        <FullPostTemplate key={postId} mainPost={true} fullPost={true} postId={numericPostId} />

          {currentUser && (
            <ComposeTweet parentId={post.id}/>
          )}
          
          {post && post.replies.length > 0 && (
            <Feed key={post.replies.length} postIdsArray={post.replies} showAsMainPost={false}/>

          )}
        </>
      )}

    </div>
  );
}

export default FullPost;