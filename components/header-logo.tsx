import Link from "next/link";
import Image from "next/image";

export const HeaderLogo = ()=>{
    return (
     
        <Link href={'/'}>
        <div className="items-center hidden lg:flex">
        <Image
      src="/logo.svg"
      width={50}
      height={50}
      alt="Picture of the company"
    />
          
        </div>
        </Link>
       
    )
}