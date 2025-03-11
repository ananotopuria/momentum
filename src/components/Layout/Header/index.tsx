import { Link } from "react-router-dom";
import Button from "../../CommonComponents/Button";
import Logo from "./../../../assets/Frame1000006027.png";
function Header() {
  return (
    <header className="flex items-center justify-between h-[10rem] px-[12rem] font-firago">
      <Link to="/">
        <img className="w-[21rem] h-[3.8]" src={Logo} alt="momentum logo" />
      </Link>
      <div className="flex w-[53.3rem] gap-[4rem]">
        <Button
          title="თანამშრომლის შექმნა"
          bgColor="bg-white"
          textColor="text-blueViolet"
          borderColor="border-blueViolet"
        />
        <Button
          title="+ შექმენი ახალი დავალება"
          bgColor="bg-blueViolet"
          textColor="text-white"
          borderColor="border-transparent"
          link="/create"
        />
      </div>
    </header>
  );
}
export default Header;
