// "use client";
// import React, { useState, useCallback } from "react";
// import { Check, X, ArrowRight } from "lucide-react"
// import Image from 'next/image';
// import { toast, Toaster, ToastBar } from "react-hot-toast";
// import { BASE_URL } from "../../../../../config";

// const AboutUsTeam = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     companyName: '',
//     businessEmail: '',
//     countryCode: '+1',
//     phoneNumber: '',
//     jobRole: '',
//     message: ''
//   });
//   const [isDropdownOpen, setDropdownOpen] = useState(false);

//   const countryCodes = [
//     { code: '+1', country: 'US' },
//     { code: '+44', country: 'UK' },
//     { code: '+91', country: 'IN' },
//     { code: '+86', country: 'CN' },
//     { code: '+81', country: 'JP' },
//     { code: '+49', country: 'DE' },
//     { code: '+33', country: 'FR' }
//   ];

//   const handleChange = useCallback((field) => (e) => {
//     setFormData((prev) => ({ ...prev, [field]: e.target.value }));
//   }, []);

//   const handleCodeChange = (code) => {
//     setFormData((prev) => ({ ...prev, countryCode: code }));
//     setDropdownOpen(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       reportId: "68591ba3af191b1eaff7125c",
//       type: "Become a Reseller",
//       firstName: formData.firstName,
//       // lastName: formData.lastName,
//       companyName: formData.companyName,
//       businessEmail: formData.businessEmail,
//       contactCode: formData.countryCode,
//       contactNo: formData.phoneNumber,
//       jobRole: formData.jobRole,
//       message: formData.message,
//       planType: "Business License",
//       subTotal: "$3,098.00",
//       discount: "-$90.00",
//       internetHandlingCharge: "$8.00",
//       GST: "(18%) $8.00",
//       companyAddress: "company address",
//       city: "surat",
//       state: "gujarat",
//       country: "india",
//       zipCode: "395010"
//     };

//     console.log("Submitting payload:", payload);
//     try {
//       const res = await fetch(`${BASE_URL}/inquiry/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       console.log("API Response:", result);

//       if (res.ok) {
//         console.log("Triggering success toast");
//         toast.success("Inquiry submitted successfully!", {
//           duration: 3000,
//           style: {
//             background: '#4ade80',
//             color: '#fff',
//           },
//           icon: <Check />,
//         });
//         setFormData({
//           firstName: '',
//           // lastName: '',
//           companyName: '',
//           businessEmail: '',
//           countryCode: '+1',
//           phoneNumber: '',
//           jobRole: '',
//           message: ''
//         });
//         setTimeout(() => setIsModalOpen(false), 3000); // Close modal after success
//       } else {
//         console.log("Triggering error toast:", result?.message || "Something went wrong");
//         toast.error(result?.message || "Something went wrong!", {
//           duration: 5000,
//           style: {
//             background: '#ef4444',
//             color: '#fff',
//           },
//           icon: <X />,
//         });
//       }
//     } catch (error) {
//       console.log("Network error occurred:", error);
//       toast.error("Network error. Please try again.", {
//         duration: 5000,
//         style: {
//           background: '#ef4444',
//           color: '#fff',
//         },
//         icon: <X />,
//       });
//     }
//   };

//   return (
//     <>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#363636',
//             color: '#fff',
//           },
//           success: {
//             duration: 3000,
//             style: {
//               background: '#4ade80',
//               color: '#fff',
//             },
//             icon: <Check />,
//           },
//           error: {
//             duration: 5000,
//             style: {
//               background: '#ef4444',
//               color: '#fff',
//             },
//             icon: <X />,
//           },
//         }}
//       />
//       <section className="py-16 px-4 md:py-24 md:px-8 lg:px-16">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row">
//             <div className="md:w-1/2 mb-10 md:mb-0 md:pr-20" style={{ marginTop: "10%" }}>
//               <p style={{ fontSize: "32px" }} className="text-3xl md:text-4xl font-semibold mt-2">
//                 Partner with Kaiso as a Reseller
//               </p>
//               <p className="text-gray-700 mt-8 mb-7" style={{ fontSize: "18px" }}>
//                 Lorem ipsum is simply dummy text of the printing and typesetting industry.
//                 Deliver trusted insights, strategic reports, and consulting solutions to your clients while growing your business with us.
//               </p>
//               <button
//                 data-modal-target="popup-modal"
//                 data-modal-toggle="popup-modal"
//                 className="bg-[#17306E] text-white py-3 px-9 rounded-md hover:bg-[#172342] transition-colors duration-300"
//                 type="button"
//                 onClick={() => setIsModalOpen(true)}
//               >
//                 Become a Reseller
//               </button>
//             </div>
//             <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="rounded-lg overflow-hidden">
//                 <Image
//                   width={400}
//                   height={400}
//                   quality={100}
//                   src="/images/StrategicAnalysisShowCase1.webp"
//                   alt="Partners discussing"
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/400x400?text=Partner+Image";
//                   }}
//                 />
//               </div>
//               <div className="grid grid-rows-2 gap-4">
//                 <div className="rounded-lg overflow-hidden">
//                   <Image
//                     width={400}
//                     height={200}
//                     quality={100}
//                     src="/images/StrategicAnalysisShowCase2.webp"
//                     alt="Partner using technology"
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/400x200?text=Partner+Image";
//                     }}
//                   />
//                 </div>
//                 <div className="rounded-lg overflow-hidden">
//                   <Image
//                     width={400}
//                     height={200}
//                     quality={100}
//                     src="/images/StrategicAnalysisShowCase3.webp"
//                     alt="Virtual meeting"
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/400x200?text=Partner+Image";
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Modal */}
//       <div
//         id="popup-modal"
//         tabIndex={-1}
//         className={`${isModalOpen ? 'flex' : 'hidden'} mt-20 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm bg-white/30`}
//       >
//         <div className="relative p-4 w-full max-w-[800px] max-h-full">
//           <div className="relative bg-white rounded-lg shadow-sm">
//             <button
//               type="button"
//               className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
//               data-modal-hide="popup-modal"
//               onClick={() => setIsModalOpen(false)}
//             >
//               <svg
//                 className="w-3 h-3"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 14 14"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
//                 />
//               </svg>
//               <span className="sr-only">Close modal</span>
//             </button>
//             <div className="p-4 md:p-5">
//               <h3 className="mb-5 text-lg font-normal my-10 text-gray-500"></h3>
//               <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">First Name *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter first name"
//                     value={formData.firstName}
//                     onChange={handleChange("firstName")}
//                     required
//                     className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17306E]"
//                   />
//                 </div>
//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700">Last Name</label>
//                   <input
//                     type="text"
//                     placeholder="Enter last name"
//                     value={formData.lastName}
//                     onChange={handleChange("lastName")}
//                     className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17306E]"
//                   /> */}
//                 {/* </div> */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Company Name *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter company name"
//                     value={formData.companyName}
//                     onChange={handleChange("companyName")}
//                     required
//                     className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17306E]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Business Email *</label>
//                   <input
//                     type="email"
//                     placeholder="Enter business email"
//                     value={formData.businessEmail}
//                     onChange={handleChange("businessEmail")}
//                     required
//                     className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17306E]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Job Role *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Job Role"
//                     value={formData.jobRole}
//                     onChange={handleChange("jobRole")}
//                     required
//                     className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17306E]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Code *</label>
//                   <div className="relative">
//                     <button
//                       type="button"
//                       onClick={() => setDropdownOpen(!isDropdownOpen)}
//                       className="mt-1 w-full p-2 border border-gray-300 rounded-md flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#17306E]"
//                     >
//                       {formData.countryCode}
//                       <span className="ml-2">▾</span>
//                     </button>
//                     {isDropdownOpen && (
//                       <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
//                         {countryCodes.map(({ code, country }) => (
//                           <li key={code}>
//                             <button
//                               type="button"
//                               onClick={() => handleCodeChange(code)}
//                               className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100"
//                             >
//                               {code} ({country})
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
//                   <input
//                     type="tel"
//                     placeholder="Enter phone number"
//                     value={formData.phoneNumber}
//                     onChange={handleChange("phoneNumber")}
//                     required
//                     className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17306E]"
//                   />
//                 </div>

//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium text-gray-700">Message *</label>
//                   <textarea
//                     placeholder="Write your message"
//                     value={formData.message}
//                     onChange={handleChange("message")}
//                     required
//                     className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17306E] h-24"
//                   ></textarea>
//                 </div>
//                 <div className="col-span-2 flex justify-end gap-4 mt-6">
//                   <button
//                     type="button"
//                     className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
//                     onClick={() => setIsModalOpen(false)}
//                   >
//                     cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
//                   >
//                     Become a Reseller
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Meet the Team Section */}
//       <section className="py-16 px-4 md:py-4 md:px-8 lg:px-16 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Lorem ipsum is simply dummy text of the printing and typesetting has been the industry's standard dummy text ever since
//             </p>
//           </div>

//           <div className="grid grid-cols-12 gap-6">
//             {/* Column 1: 2 images */}
//             <div className="col-span-12 sm:col-span-6 md:col-span-3 mt-30">
//               <div className="relative overflow-hidden border border-gray-200 mb-6" style={{ borderRadius: "20px" }}>
//                 <Image
//                   src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
//                   width={310}
//                   height={350}
//                   quality={100}
//                   alt="John Doe"
//                   className="w-full aspect-[310/350] object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">John Doe</p>
//                     <p className="text-xs text-gray-500">CEO, Kaiso</p>
//                   </div>
//                   <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
//                     <ArrowRight />
//                   </div>
//                 </div>
//               </div>

//               <div className="relative overflow-hidden border border-gray-200" style={{ borderRadius: "20px" }}>
//                 <Image
//                   width={310}
//                   height={350}
//                   quality={100}
//                   src="/images/4633e771459bc21a6207c9bd2c7f0dd7463e1a68.webp"
//                   alt="John Doe"
//                   className="w-full aspect-[310/350] object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">John Doe</p>
//                     <p className="text-xs text-gray-500">CEO, Kaiso</p>
//                   </div>
//                   <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
//                     <ArrowRight />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Column 2: 2 images */}
//             <div className="col-span-12 sm:col-span-6 md:col-span-3 mt-10">
//               <div className="relative overflow-hidden border border-gray-200 mb-6" style={{ borderRadius: "20px" }}>
//                 <Image
//                   width={310}
//                   height={350}
//                   quality={100}
//                   src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
//                   alt="John Doe"
//                   className="w-full aspect-[310/350] object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">John Doe</p>
//                     <p className="text-xs text-gray-500">CEO, Kaiso</p>
//                   </div>
//                   <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
//                     <ArrowRight />
//                   </div>
//                 </div>
//               </div>

//               <div className="relative overflow-hidden border border-gray-200" style={{ borderRadius: "20px" }}>
//                 <Image
//                   width={310}
//                   height={350}
//                   quality={100}
//                   src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
//                   alt="John Doe"
//                   className="w-full aspect-[310/350] object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">John Doe</p>
//                     <p className="text-xs text-gray-500">CEO, Kaiso</p>
//                   </div>
//                   <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
//                     <ArrowRight />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Column 3: 2 images */}
//             <div className="col-span-12 sm:col-span-6 md:col-span-3">
//               <div className="relative overflow-hidden border border-gray-200 mb-6" style={{ borderRadius: "20px" }}>
//                 <Image
//                   width={310}
//                   height={350}
//                   quality={100}
//                   src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
//                   alt="John Doe"
//                   className="w-full aspect-[310/350] object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">John Doe</p>
//                     <p className="text-xs text-gray-500">CEO, Kaiso</p>
//                   </div>
//                   <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
//                     <ArrowRight />
//                   </div>
//                 </div>
//               </div>

//               <div className="relative overflow-hidden border border-gray-200" style={{ borderRadius: "20px" }}>
//                 <Image
//                   width={310}
//                   height={350}
//                   quality={100}
//                   src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
//                   alt="John Doe"
//                   className="w-full aspect-[310/350] object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">John Doe</p>
//                     <p className="text-xs text-gray-500">CEO, Kaiso</p>
//                   </div>
//                   <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
//                     <ArrowRight />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Column 4: 2 images */}
//             <div className="col-span-12 sm:col-span-6 md:col-span-3 mt-15">
//               <div className="relative overflow-hidden border border-gray-200 mb-6" style={{ borderRadius: "20px" }}>
//                 <Image
//                   width={310}
//                   height={350}
//                   quality={100}
//                   src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
//                   alt="John Doe"
//                   className="w-full aspect-[310/350] object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">John Doe</p>
//                     <p className="text-xs text-gray-500">CEO, Kaiso</p>
//                   </div>
//                   <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
//                     <ArrowRight />
//                   </div>
//                 </div>
//               </div>

//               <div className="relative overflow-hidden border border-gray-200" style={{ borderRadius: "20px" }}>
//                 <Image
//                   width={310}
//                   height={350}
//                   quality={100}
//                   src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
//                   alt="John Doe"
//                   className="w-full aspect-[310/350] object-cover"
//                   onError={(e) => {
//                     e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">John Doe</p>
//                     <p className="text-xs text-gray-500">CEO, Kaiso</p>
//                   </div>
//                   <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
//                     <ArrowRight />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 px-4 md:py-24 md:px-8 lg:px-16">
//         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-center">
//           <div className="w-full max-w-xl text-center lg:text-left">
//             <span className="text-[#D62035] text-sm sm:text-base font-medium">
//               Build Your Career with Kaiso
//             </span>
//             <p className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-3">
//               We're changing how Industries is made.
//             </p>
//             <button className="bg-black text-white py-2 px-6 mt-7 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition duration-300 mx-auto lg:mx-0">
//               Contact Us <ArrowRight className="w-4 h-4" />
//             </button>
//           </div>

//           <div className="w-full max-w-2xl">
//             <Image
//               src="/images/56bc12b4b8c0659d265441b0f1b07eea9de9d67f.webp"
//               alt="Partners discussing"
//               className="w-full h-auto max-h-[260px] object-cover rounded-3xl"
//               width={100}
//               height={100}
//               quality={100}
//             />
//             <p className="mt-3 text-sm text-gray-600">
//               Join a team where intelligence meets impact. Explore opportunities to grow, lead, and shape the future of strategic research and consulting.
//             </p>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default AboutUsTeam;
"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import OtherInquiryForm from "@/components/shared/OtherInquiryForm";

const AboutUsTeam = () => {
    // Function to scroll to the inquiry form
    const scrollToForm = () => {
        const formElement = document.getElementById("reseller-inquiry-form");
        if (formElement) {
            formElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <>
            <section id="reseller-section" className="py-16 px-4 md:py-24 md:px-8 lg:px-16">
                <div className="max-w-[85%] mx-auto">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-20" style={{ marginTop: "10%" }}>
                            <p style={{ fontSize: "32px" }} className="text-2xl md:text-2xl font-semibold mt-2">
                                Partner with Kaiso as a Reseller
                            </p>
                            <p className="text-black-700 mt-8 mb-7" style={{ fontSize: "15px" }}>
                                Expand your offerings with industry-leading market intelligence. Join our global reseller network and deliver trusted insights,
                                strategic reports, and consulting solutions to your clients while growing your business with us.
                            </p>
                            <button
                                className="bg-[#17306E] text-white py-3 px-9 rounded-md hover:bg-[#172342] transition-colors duration-300"
                                type="button"
                                onClick={scrollToForm}
                            >
                                Become a Reseller
                            </button>
                        </div>
                        <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-lg overflow-hidden">
                                <Image
                                    width={400}
                                    height={400}
                                    quality={100}
                                    src="/images/StrategicAnalysisShowCase1.webp"
                                    alt="Partners discussing"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/400x400?text=Partner+Image";
                                    }}
                                />
                            </div>
                            <div className="grid grid-rows-2 gap-4">
                                <div className="rounded-lg overflow-hidden">
                                    <Image
                                        width={400}
                                        height={200}
                                        quality={100}
                                        src="/images/StrategicAnalysisShowCase2.webp"
                                        alt="Partner using technology"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x200?text=Partner+Image";
                                        }}
                                    />
                                </div>
                                <div className="rounded-lg overflow-hidden">
                                    <Image
                                        width={400}
                                        height={200}
                                        quality={100}
                                        src="/images/StrategicAnalysisShowCase3.webp"
                                        alt="Virtual meeting"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x200?text=Partner+Image";
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Commented out Meet the Team Section */}
            {/* <section className="py-16 px-4 md:py-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum is simply dummy text of the printing and typesetting has been the industry's standard dummy text ever since
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 sm:col-span-6 md:col-span-3 mt-30">
              <div className="relative overflow-hidden border border-gray-200 mb-6" style={{ borderRadius: "20px" }}>
                <Image
                  src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
                  width={310}
                  height={350}
                  quality={100}
                  alt="John Doe"
                  className="w-full aspect-[310/350] object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-xs text-gray-500">CEO, Kaiso</p>
                  </div>
                  <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
                    <ArrowRight />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden border border-gray-200" style={{ borderRadius: "20px" }}>
                <Image
                  width={310}
                  height={350}
                  quality={100}
                  src="/images/4633e771459bc21a6207c9bd2c7f0dd7463e1a68.webp"
                  alt="John Doe"
                  className="w-full aspect-[310/350] object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-xs text-gray-500">CEO, Kaiso</p>
                  </div>
                  <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
                    <ArrowRight />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 sm:col-span-6 md:col-span-3 mt-10">
              <div className="relative overflow-hidden border border-gray-200 mb-6" style={{ borderRadius: "20px" }}>
                <Image
                  width={310}
                  height={350}
                  quality={100}
                  src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
                  alt="John Doe"
                  className="w-full aspect-[310/350] object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-xs text-gray-500">CEO, Kaiso</p>
                  </div>
                  <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
                    <ArrowRight />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden border border-gray-200" style={{ borderRadius: "20px" }}>
                <Image
                  width={310}
                  height={350}
                  quality={100}
                  src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
                  alt="John Doe"
                  className="w-full aspect-[310/350] object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-xs text-gray-500">CEO, Kaiso</p>
                  </div>
                  <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
                    <ArrowRight />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 sm:col-span-6 md:col-span-3">
              <div className="relative overflow-hidden border border-gray-200 mb-6" style={{ borderRadius: "20px" }}>
                <Image
                  width={310}
                  height={350}
                  quality={100}
                  src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
                  alt="John Doe"
                  className="w-full aspect-[310/350] object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-xs text-gray-500">CEO, Kaiso</p>
                  </div>
                  <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
                    <ArrowRight />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden border border-gray-200" style={{ borderRadius: "20px" }}>
                <Image
                  width={310}
                  height={350}
                  quality={100}
                  src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
                  alt="John Doe"
                  className="w-full aspect-[310/350] object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-xs text-gray-500">CEO, Kaiso</p>
                  </div>
                  <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
                    <ArrowRight />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 sm:col-span-6 md:col-span-3 mt-15">
              <div className="relative overflow-hidden border border-gray-200 mb-6" style={{ borderRadius: "20px" }}>
                <Image
                  width={310}
                  height={350}
                  quality={100}
                  src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
                  alt="John Doe"
                  className="w-full aspect-[310/350] object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-xs text-gray-500">CEO, Kaiso</p>
                  </div>
                  <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
                    <ArrowRight />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden border border-gray-200" style={{ borderRadius: "20px" }}>
                <Image
                  width={310}
                  height={350}
                  quality={100}
                  src="/images/006bcfeb92f6ed90ba8f4140c2257eca254f08fe.webp"
                  alt="John Doe"
                  className="w-full aspect-[310/350] object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/310x350?text=Team+Member";
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#D6D5D6] p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-xs text-gray-500">CEO, Kaiso</p>
                  </div>
                  <div className="bg-gray-100 p-4" style={{ borderRadius: "6px" }}>
                    <ArrowRight />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

            <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 md:px-8 lg:py-24 lg:px-16">
                <div className="max-w-[88%] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                    {/* Text Content */}
                    <div className="w-full max-w-xl text-center lg:text-left">
                        <span className="text-[#D62035] text-xs sm:text-sm md:text-sm font-medium tracking-wide">Build Your Career with Kaiso</span>

                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mt-3 leading-snug">We're changing how Industries is made.</p>

                        <button
                            onClick={() => (window.location.href = "/contactus")}
                            className="bg-black text-white py-2 px-5 sm:py-2 sm:px-7 mt-6 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition duration-300 mx-auto lg:mx-0 text-sm sm:text-base"
                        >
                            Contact Us <ArrowRight className="w-4 h-3 sm:w-5 sm:h-3" />
                        </button>
                    </div>

                    {/* Image & Description */}
                    <div className="w-full max-w-2xl">
                        <Image
                            src="/images/56bc12b4b8c0659d265441b0f1b07eea9de9d67f.webp"
                            alt="Partners discussing"
                            className="w-full h-auto max-h-[180px] sm:max-h-[200px] md:max-h-[250px] lg:max-h-[280px] object-cover rounded-2xl md:rounded-3xl"
                            width={800}
                            height={600}
                            quality={100}
                        />
                        <p className="mt-3 text-xs sm:text-sm md:text-sm text-gray-700 leading-relaxed text-center lg:text-left">
                            Join a team where intelligence meets impact. Explore opportunities to grow, lead, and shape the future of strategic research and
                            consulting.
                        </p>
                    </div>
                </div>
            </section>

            {/* Reseller Inquiry Form */}
            <section id="reseller-inquiry-form" className="py-15 px-4 md:py-16 md:px-8 lg:px-16 ">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-bold mb-2">Become a Reseller</h2>
                        <p className="text-gray-900 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] pb-5">
                            Fill out the form below to start your partnership with Kaiso as a reseller.
                        </p>
                    </div>
                    <OtherInquiryForm
                        title="Become a Reseller"
                        type="Become a Reseller"
                        isOpen={true}
                        onClose={() => {}}
                        buttonText="Submit Application"
                        successMessage="Reseller application submitted successfully!"
                        pageName=""
                        isExpandedView={true}
                    />
                </div>
            </section>
        </>
    );
};

export default AboutUsTeam;
