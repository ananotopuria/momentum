import { CommentItemProps } from "../types";

function CommentItem({
  comment,
  addReply,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
}: CommentItemProps) {
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
        {comment.parent_id === null && (
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="text-blue-500 mt-2"
          >
            უპასუხე
          </button>
        )}
        {replyingTo === comment.id && comment.parent_id === null && (
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
                  setReplyText("");
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
      {comment.sub_comments && comment.sub_comments.length > 0 && (
        <ul className="ml-4 mt-2">
          {comment.sub_comments.map((subComment) => (
            <CommentItem
              key={subComment.id}
              comment={subComment}
              addReply={addReply}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default CommentItem;
