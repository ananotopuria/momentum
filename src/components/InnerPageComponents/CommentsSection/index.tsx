import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Comment, NestedComment, CommentsSectionProps } from "../types";
import CommentItem from "../CommentItem";

const fetchAllComments = async (taskId: string): Promise<Comment[]> => {
  const response = await axios.get(
    `https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`,
    {
      headers: {
        Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
      },
    }
  );
  return Array.isArray(response.data) ? response.data : [];
};

const nestComments = (comments: Comment[]): NestedComment[] => {
  const map = new Map<number, NestedComment>();
  const nested: NestedComment[] = [];

  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, sub_comments: [] } as NestedComment);
  });

  comments.forEach((comment) => {
    if (comment.parent_id) {
      const parent = map.get(comment.parent_id);
      if (parent) {
        parent.sub_comments.push(map.get(comment.id)!);
      }
    } else {
      nested.push(map.get(comment.id)!);
    }
  });

  return nested;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ taskId }) => {
  const queryClient = useQueryClient();
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", taskId],
    queryFn: () => fetchAllComments(taskId),
    enabled: !!taskId,
  });

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const addCommentMutation = useMutation({
    mutationFn: async ({
      text,
      parentId,
    }: {
      text: string;
      parentId?: number | null;
    }) => {
      await axios.post(
        `https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`,
        { text, parent_id: parentId || null },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      setNewComment("");
      setReplyText("");
      setReplyingTo(null);
    },
  });

  const addReply = (commentId: number, text: string) => {
    addCommentMutation.mutate({ text, parentId: commentId });
  };

  const nestedComments = useMemo(() => {
    return comments ? nestComments(comments) : [];
  }, [comments]);

  if (isLoading) return <p>Loading comments...</p>;

  return (
    <section className="w-[74rem] border rounded-lg bg-[#F8F3FEA6] mt-[10rem]">
      <div className="px-[4.5rem] py-[4rem] relative">
        <textarea
          className="border p-2 w-full h-[13.5rem] rounded-lg"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="დაწერე კომენტარი"
        />
        <button
          onClick={() => addCommentMutation.mutate({ text: newComment.trim() })}
          disabled={!newComment.trim()}
          className="bg-blueViolet text-white p-2 mt-2 absolute top-[13rem] right-[6rem] rounded-[2rem] px-[1.8rem] py-[.8rem]"
        >
          დააკომენტარე
        </button>
        <h4 className="mt-[6.6rem]">
          კომენტარები ({comments ? comments.length : 0})
        </h4>
        <ul className="mt-4 space-y-4">
          {nestedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              addReply={addReply}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CommentsSection;
