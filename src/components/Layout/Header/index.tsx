import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "../../CommonComponents/Button";
import Logo from "./../../../assets/Frame1000006027.png";
import EmployeeModal from "./EmployeeModal";

function Header() {
  const [isModalOpen, setModalOpen] = useState(false);

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
          onClick={() => setModalOpen(true)}
        />
        <Button
          title="+ შექმენი ახალი დავალება"
          bgColor="bg-blueViolet"
          textColor="text-white"
          borderColor="border-transparent"
          link="/create"
        />
      </div>
      <EmployeeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
}

export default Header;
