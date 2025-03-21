import { CommentItemProps } from "../types";
import { PiArrowBendUpLeftFill } from "react-icons/pi";

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
      <div className="">
        <div className="flex items-center gap-[1rem]">
          <img
            src={comment.author_avatar}
            alt={comment.author_nickname}
            className="w-[3.8rem] h-[3.8rem] rounded-full inline-block mr-2"
          />
          <strong className="text-[1.8rem] font-medium leading-[1] ">
            {comment.author_nickname}
          </strong>
          :
        </div>
        <p className="ml-[5rem] text-[1.6rem] leading-[1] font-light text-darkGrey ">
          {comment.text}
        </p>
        {comment.parent_id === null && (
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="text-blueViolet hover:text-brightLavender mt-[1rem] font-normal leading-[1] text-[1.2rem] flex gap-[1rem] p-[2rem] ml-[3rem] transition-colors duration-300"
          >
            <span>
              <PiArrowBendUpLeftFill />
            </span>
            <span>უპასუხე</span>
          </button>
        )}
        {replyingTo === comment.id && comment.parent_id === null && (
          <div className="flex items-start ml-[4.5rem] mt-2 space-x-2">
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
                className="text-blueViolet hover:text-brightLavender mt-[1rem] font-normal leading-[1] text-[1.2rem] flex gap-[1rem] p-[2rem] ml-[3rem] cursor-pointer transition-colors duration-300"
              >
                <span>
                  <PiArrowBendUpLeftFill />
                </span>
                <span>უპასუხე</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {comment.sub_comments && comment.sub_comments.length > 0 && (
        <ul className="ml-[4.5rem] mt-2">
          {[...comment.sub_comments].reverse().map((subComment) => (
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
