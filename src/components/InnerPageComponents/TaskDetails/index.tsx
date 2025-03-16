import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useStatuses } from "../../../hooks/useStatuses";

export interface Task {
  id: number;
  name: string;
  description: string;
  due_date: string;
  department: { id: number; name: string };
  employee: {
    id: number;
    name: string;
    surname: string;
    avatar: string;
    department: { id: number; name: string };
  };
  status: { id: number; name: string };
  priority: { id: number; name: string; icon: string };
  total_comments: number;
}

export interface Comment {
  id: number;
  text: string;
  task_id: number;
  parent_id: number | null;
  author_avatar: string;
  author_nickname: string;
  sub_comments?: Comment[];
}
interface CommentItemProps {
  comment: NestedComment;
  taskId: number;
  setReplyingTo: (id: number | null) => void;
  replyingTo: number | null;
  replyText: string;
  setReplyText: (text: string) => void;
  addReply: (commentId: number, text: string) => void;
}
export interface NestedComment extends Comment {
  sub_comments: NestedComment[];
}
const fetchTaskById = async (id: string): Promise<Task> => {
  const response = await axios.get(
    `https://momentum.redberryinternship.ge/api/tasks/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
      },
    }
  );
  return response.data;
};

const fetchAllComments = async (id: string): Promise<Comment[]> => {
  const response = await axios.get(
    `https://momentum.redberryinternship.ge/api/tasks/${id}/comments`,
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

interface CommentItemProps {
  comment: NestedComment;
  addReply: (commentId: number, reply: string) => void;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  addReply,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
}) => {
  const canReply =
    comment.parent_id === null && comment.sub_comments.length === 0;
  return (
    <li className="mb-4">
      <div className="border p-4 rounded">
        <div className="flex items-center">
          <img
            src={comment.author_avatar}
            alt={comment.author_nickname}
            className="w-8 h-8 rounded-full inline-block mr-2"
          />
          <strong>{comment.author_nickname}</strong>: {comment.text}
        </div>
        {canReply && (
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="text-blue-500 mt-2"
          >
            უპასუხე
          </button>
        )}
        {replyingTo === comment.id && (
          <div className="flex items-start ml-4 mt-2 space-x-2">
            <img
              src={comment.author_avatar}
              alt={comment.author_nickname}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <textarea
                className="border p-2 w-full"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="უპასუხეთ კომენტარს"
              />
              <button
                onClick={() => {
                  addReply(comment.id, replyText.trim());
                }}
                disabled={!replyText.trim()}
                className="bg-green-500 text-white p-2 mt-2 rounded"
              >
                უპასუხე
              </button>
            </div>
          </div>
        )}
      </div>
      {comment.parent_id === null && comment.sub_comments.length > 0 && (
        <ul className="ml-4 mt-2">
          <li className="border p-4 rounded">
            <div className="flex items-center">
              <img
                src={comment.sub_comments[0].author_avatar}
                alt={comment.sub_comments[0].author_nickname}
                className="w-8 h-8 rounded-full inline-block mr-2"
              />
              <strong>{comment.sub_comments[0].author_nickname}</strong>:{" "}
              {comment.sub_comments[0].text}
            </div>
          </li>
        </ul>
      )}
    </li>
  );
};

function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: statuses = [] } = useStatuses();

  const {
    data: task,
    isLoading: isLoadingTask,
    error: taskError,
  } = useQuery<Task>({
    queryKey: ["task", id],
    queryFn: () => fetchTaskById(id!),
    enabled: !!id,
  });
  const {
    data: comments,
    isLoading: isLoadingComments,
    error: commentsError,
  } = useQuery<Comment[]>({
    queryKey: ["comments", id],
    queryFn: () => fetchAllComments(id!),
    enabled: !!id,
  });

  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(
    undefined
  );
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (task && selectedStatus === undefined) {
      setSelectedStatus(task.status.id);
    }
  }, [task, selectedStatus]);
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatusId: number) => {
      await axios.put(
        `https://momentum.redberryinternship.ge/api/tasks/${id}`,
        { status_id: newStatusId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({
      text,
      parentId,
    }: {
      text: string;
      parentId?: number | null;
    }) => {
      await axios.post(
        `https://momentum.redberryinternship.ge/api/tasks/${id}/comments`,
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
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
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

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred.";
  };

  if (taskError || commentsError) {
    return (
      <p>
        Error:{" "}
        {`${
          getErrorMessage(taskError) || getErrorMessage(commentsError)
        } - Check your API token and endpoint.`}
      </p>
    );
  }

  if (isLoadingTask || isLoadingComments) return <p>Loading task details...</p>;

  return (
    <main className="px-[12rem] flex justify-between">
      <section className="w-[71.5rem] mt-[4rem]">
        <h1 className="text-3xl font-bold mb-4">{task?.name || "დავალება"}</h1>
        <p className="mb-4">{task?.description || "აღწერა არ არის"}</p>
        <div className="mb-8">
          <label className="block text-lg font-medium mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              const newStatus = Number(e.target.value);
              setSelectedStatus(newStatus);
              updateStatusMutation.mutate(newStatus);
            }}
            className="border p-2 rounded w-full"
          >
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className="w-[74rem] border rounded-lg bg-[#F8F3FEA6] mt-[10rem]">
        <div className="px-[4.5rem] py-[4rem] relative">
          <textarea
            className="border p-2 w-full h-[13.5rem] rounded-lg"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="დაწერე კომენტარი"
          />
          <button
            onClick={() =>
              addCommentMutation.mutate({ text: newComment.trim() })
            }
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
                taskId={Number(id)}
                setReplyingTo={setReplyingTo}
                replyingTo={replyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                addReply={addReply}
              />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default TaskDetails;
