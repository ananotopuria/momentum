import { Link } from "react-router-dom";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  link?: string;
  disabled?: boolean;
}

function Button({
  title,
  onClick,
  bgColor = "bg-white",
  textColor = "text-black",
  borderColor = "border-black",
  link,
  disabled = false,
}: ButtonProps) {
  const buttonClass = `border px-[2rem] py-[1rem] text-[1.6rem] ${bgColor} ${textColor} ${borderColor} rounded-[5px] ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  return link ? (
    <Link to={link} className={buttonClass}>
      {title}
    </Link>
  ) : (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
}

export default Button;
