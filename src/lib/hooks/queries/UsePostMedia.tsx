import { useQuery } from "@tanstack/react-query";
import type { PostImageData } from "../../types/file.ts";

export const usePostMedia = (mediaId: number | undefined) => {
  return useQuery<PostImageData>({
    queryKey: ["postMedia", mediaId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/posts/getPostMediaById?id=${mediaId}`);
      if (!res.ok) throw new Error("Failed to fetch post media");

      const data = await res.json();
      return data as PostImageData;
    },
    enabled: typeof mediaId === "number" && mediaId > 0,
    staleTime: 1000 * 60 * 10,
  });
};