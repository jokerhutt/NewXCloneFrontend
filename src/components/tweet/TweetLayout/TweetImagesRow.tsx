import type { Post } from "../../../types/Post";
import { ImagePreviewGrid } from "../../layout/media/ImagePreviewGrid";
import { PostLine } from "../tweetInfo/PostLine";

type TweetImagesRowProps = {
  post: Post;
  isParentPost?: boolean;
  isMainPost?: boolean;
};

export function TweetImagesRow({
  post,
  isParentPost,
  isMainPost,
}: TweetImagesRowProps) {
  return (
    <>
      {isParentPost && <PostLine showLine={isParentPost} />}
      <div className={`${isMainPost ? "col-span-2" : "col-start-2"}`}>
        <ImagePreviewGrid media={post.postMedia} />
      </div>
    </>
  );
}
