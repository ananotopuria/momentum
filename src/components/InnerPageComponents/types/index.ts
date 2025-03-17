export interface Comment {
  id: number;
  text: string;
  task_id: number;
  parent_id: number | null;
  author_avatar: string;
  author_nickname: string;
  sub_comments?: NestedComment[];
}

export interface NestedComment extends Comment {
  sub_comments: NestedComment[];
}

export interface CommentItemProps {
  comment: NestedComment;
  addReply: (commentId: number, reply: string) => void;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
}

export interface CommentsSectionProps {
  taskId: string;
}

export interface Department {
  id: number;
  name: string;
  color?: string;
}
