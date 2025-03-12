type TitleProps = {
  text: string;
};

function Title({ text }: TitleProps) {
  return (
    <h1 className="px-[12rem] py-[4rem]  text-[3.4rem] text-grey font-firago font-semibold ">
      {text}
    </h1>
  );
}

export default Title;
