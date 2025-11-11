import Image from "next/image";
// import { useRouter } from "next/navigation";

// export default function BlogDetail({ params }) {
//     const router = useRouter();
//     const { id } = params;

//     // Fetch blog data based on id (e.g., from the arrays or an API)
//     const blog = [...blogs, ...newarticles, ...latestBlogsAndArticles].find(item => item.id === parseInt(id));

//     if (!blog) return <div>Blog not found</div>

//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-bold">{blog.title}</h1>
//             <p className="text-gray-500 mt-2">{blog.date}</p>
//             <Image src={blog.image} alt={blog.title} className="w-full h-auto mt-4 rounded-lg"  width={100} height={100}  quality={100}/>
//             <p className="mt-4">{blog.excerpt}</p>
//             <button onClick={() => router.back()} className="mt-6 text-rose-600">Back</button>
//         </div>
//     );
// }
