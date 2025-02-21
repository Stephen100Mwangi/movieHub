import { useState } from "react";

type CardProps = {
    title: string;
    desc: string;
}

const Card: React.FC <CardProps> = ({title, desc}) => {
    const [liked,setHasLiked] = useState(false);
  return (
    <div className="shadow-xl bg-white h-96 w-80 p-5 flex items-center justify-center flex-col space-y-10 rounded-md">
        <h1 className="text-2xl font-sans">{title}</h1>
        <p className="text-sm font-normal font-sans">{desc}</p>
        <button className="p-1 px-6 text-white bg-orange-500 hover:rounded-full cursor-pointer text-center flex justify-center items-center" onClick={()=> setHasLiked((prevState) => !prevState)}>{liked? 'Liked': 'Like'}</button>
    </div>
  )
}

export default Card