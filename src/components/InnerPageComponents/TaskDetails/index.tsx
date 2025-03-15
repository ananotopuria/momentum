import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useStatuses } from "../../../hooks/useStatuses";

export interface Task {
  id: number;
  name: string;
  description: string;
  due_date: string;
  department: {
    id: number;
    name: string;
  };
  employee: {
    id: number;
    name: string;
    surname: string;
    avatar: string;
    department: {
      id: number;
      name: string;
    };
  };
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
    icon: string;
  };
  total_comments: number;
}

interface Comment {
  id: number;
  text: string;
  author?: {
    id: number;
    name: string;
    surname: string;
  };
  created_at: string;
  parent_id?: number | null;
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

const fetchCommentsByTaskId = async (id: string): Promise<Comment[]> => {
  const response = await axios.get(
    `https://momentum.redberryinternship.ge/api/tasks/${id}/comments`,
    {
      headers: {
        Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
      },
    }
  );
  return response.data;
};

function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const {
    data: statuses = [],
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses,
  } = useStatuses();

  const {
    data: task,
    isLoading: isLoadingTask,
    isError: isErrorTask,
  } = useQuery<Task, Error>({
    queryKey: ["task", id],
    queryFn: () => fetchTaskById(id!),
    enabled: !!id,
  });
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    isError: isErrorComments,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", id],
    queryFn: () => fetchCommentsByTaskId(id!),
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
  const postCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      await axios.post(
        `https://momentum.redberryinternship.ge/api/tasks/${id}/comments`,
        { text },
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
    },
  });

  if (isLoadingTask || isLoadingStatuses || isLoadingComments)
    return <p>Loading task details...</p>;
  if (isErrorTask || !task || isErrorStatuses || isErrorComments)
    return <p>Failed to load task details.</p>;

  return (
    <main className="px-[12rem] flex justify-between">
      <section className="w-[71.5rem] mt-[4rem]">
        <h1 className="text-3xl font-bold mb-4">{task?.name || "დავალება"}</h1>
        <p className="mb-4">{task?.description || "აღწერა არ არის"}</p>
        <p className="mb-2">
          {task?.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : "N/A"}
        </p>
        <p className="mb-2">{task?.priority?.name || "N/A"}</p>
        <div className="mb-8">
          <label className="block text-lg font-medium mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) =>
              updateStatusMutation.mutate(Number(e.target.value))
            }
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
            onClick={() => postCommentMutation.mutate(newComment.trim())}
            disabled={!newComment.trim()}
            className="bg-blueViolet text-white p-2 mt-2 absolute top-[13rem] right-[6rem] text-[1.6rem] font-normal leading-[100%] rounded-[2rem] px-[1.8rem] py-[.8rem] cursor-pointer"
          >
            დააკომენტარე
          </button>

          <h4 className="mt-[6.6rem] flex items-center">
            კომენტარები{" "}
            <span className="ml-2 bg-blueViolet text-white px-2 rounded-full">
              {comments?.length || 0}
            </span>
          </h4>
          <ul className="mt-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <li key={comment.id} className="border p-4 rounded">
                  <p>
                    <strong>{comment?.author?.name || "Unknown"}:</strong>{" "}
                    {comment?.text || "შეცდომა"}
                  </p>
                  <button onClick={() => setReplyingTo(comment.id)}>
                    უპასუხე
                  </button>

                  {replyingTo === comment.id && (
                    <>
                      <textarea
                        className="border p-2 w-full mt-2"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="უპასუხეთ კომენტარს"
                      />
                      <button
                        onClick={() =>
                          console.log("Reply submitted:", replyText)
                        }
                        className="bg-green-500 text-white p-2 mt-2 rounded"
                      >
                        დამატება
                      </button>
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-500">კომენტარები ჯერ არ არის</p>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default TaskDetails;
