// "use client";
// import Image from "next/image";
// import { Box } from "@mui/material";
// import authBg from "../../../../public/admin/authbg.svg";
// import kaisoLogo from "../../../../public/icons/loogo.svg";

// const AuthCommanForm = ({ children, title, subTitle = null }) => {
//     return (
//         <div className=" bg-white">
//             <Box
//                 sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     backgroundImage: `url(${authBg.src})`,
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                     backgroundRepeat: "no-repeat",
//                     zIndex: -1,
//                 }}
//                 className="flex flex-col pt-8 pr-20 pb-64 pl-8 w-full h-[100vh] max-md:px-5 max-md:pb-24 max-md:max-w-full"
//             >
//                 {/* Placeholder for Kaiso Logo - replace with actual logo path */}
//                 <Image src={kaisoLogo} alt="Kaiso Logo" className="object-contain max-w-full aspect-[4.29] w-[193px]" />

//                 <main className="flex relative flex-col justify-center self-center px-32 py-12 mt-[5%] mb-0 max-w-full w-[720px] max-md:px-5 max-md:mt-10 max-md:mb-2.5">
//                     <header>
//                         <h1 className="w-full text-4xl text-center font-bold leading-tight text-zinc-900 max-md:max-w-full mb-[20px]">{title}</h1>
//                         {subTitle && <p className="text-center text-[#73757B] mb-[20px]">{subTitle}</p>}
//                     </header>
//                     {children}
//                 </main>
//             </Box>
//         </div>
//     );
// };

// export default AuthCommanForm;


"use client";
import Image from "next/image";
import { Box } from "@mui/material";
import authBg from "../../../../public/admin/authbg.svg";
import kaisoLogo from "../../../../public/icons/loogo.svg";

const AuthCommanForm = ({ children, title, subTitle = null }) => {
    return (
        <div className="bg-white">
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${authBg.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    zIndex: -1,
                }}
                className="flex flex-col w-full h-[100vh]"
            >
                {/* Logo at top */}
                <div className="p-8">
                    <Image
                        src={kaisoLogo}
                        alt="Kaiso Logo"
                        className="object-contain max-w-full aspect-[4.29] w-[193px]"
                    />
                </div>

                {/* Centered Form */}
                <main className="flex flex-col justify-center items-center flex-1 px-5">
                    <div className="px-8 py-12 w-full max-w-[720px]">
                        <header>
                            <h1 className="w-full text-4xl text-center font-bold leading-tight text-zinc-900 mb-5">
                                {title}
                            </h1>
                            {subTitle && (
                                <p className="text-center text-[#73757B] mb-5">
                                    {subTitle}
                                </p>
                            )}
                        </header>
                        {children}
                    </div>
                </main>
            </Box>
        </div>
    );
};

export default AuthCommanForm;
