import { Link } from "react-router-dom";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  link?: string; 
}

function Button({ title, onClick, bgColor = "bg-white", textColor = "text-black", borderColor = "border-black", link }: ButtonProps) {
  const buttonClass = `border px-[2rem] py-[1rem] text-[1.6rem] ${bgColor} ${textColor} ${borderColor} rounded-[5px]`;

  return link ? (
    <Link to={link} className={buttonClass}>
      {title}
    </Link>
  ) : (
    <button className={buttonClass} onClick={onClick}>
      {title}
    </button>
  );
}

export default Button;
