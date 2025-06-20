import { useCurrentUser } from "../../context/Auth/CurrentUserProvider.tsx";
import type { User } from "../../lib/types/User.ts";
import { useFollowUser } from "../../lib/hooks/mutations/useFollowUser.tsx";
import { useQueryClient } from "@tanstack/react-query";

type FollowButtonProps = {
  pageUser?: User | null;
};

function FollowButton({ pageUser }: FollowButtonProps) {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const isFollowing = pageUser?.followers.includes(currentUser?.id ?? -1) ?? false;

  const followMutation = useFollowUser(currentUser?.id, pageUser?.id, {
    onUpdate: (updatedFollowed) => {
      const isNowFollowing = updatedFollowed.followers.includes(currentUser?.id ?? -1);

      queryClient.setQueryData<User>(["currentUser"], (prev) => {
        if (!prev) return prev;

        const alreadyThere = prev.following.includes(pageUser!.id);
        const following = isNowFollowing
          ? (alreadyThere ? prev.following : [...prev.following, pageUser!.id])
          : prev.following.filter(id => id !== pageUser!.id);

        return { ...prev, following };
      });
      if (!isNowFollowing) {
        queryClient.invalidateQueries({
          queryKey: ["feed", "following", currentUser?.id],
        });
      }

    },
  });

  const handleFollow = () => {
    if (!currentUser || !pageUser || followMutation.isPending) return;
    followMutation.mutate({ currentlyFollowing: isFollowing });
  };

  if (!pageUser) return null;

  return (
    <p className="h-fit"
      onClick={handleFollow}
      style={{ cursor: followMutation.isPending ? "not-allowed" : "pointer", opacity: followMutation.isPending ? 0.5 : 1 }}
    >
      {isFollowing ? "Following" : "Follow"}
    </p>
  );
}

export default FollowButton;