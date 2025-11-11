// "use client";
// import { useState, useEffect, useRef } from 'react';
// import FeedbackCard from './FeedbackCard';
// import { useWindowSize, useClientOnly } from '../../../hooks/useClientOnly';
// import Image from 'next/image';

// const FeedbackList = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const isClient = useClientOnly();
//   const { width } = useWindowSize();
//   const [cardsPerView, setCardsPerView] = useState(3);
//   const [isMobileView, setIsMobileView] = useState(false);

//   // Drag functionality state
//   const scrollContainerRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);

//   // Update cards per view based on screen size
//   useEffect(() => {
//     if (!isClient) return;

//     if (width <= 767) {
//       // Mobile: Hide buttons, enable manual swipe
//       setCardsPerView(1);
//       setIsMobileView(true);
//     } else if (width <= 1199) {
//       // Tablet: Show 2 cards with buttons
//       setCardsPerView(2);
//       setIsMobileView(false);
//     } else {
//       // Desktop: Show 3 cards with buttons
//       setCardsPerView(3);
//       setIsMobileView(false);
//     }
//   }, [isClient, width]);

//   // Global mouse event handlers for better drag experience
//   useEffect(() => {
//     if (!isClient) return;

//     const handleGlobalMouseMove = (e) => {
//       if (isDragging && scrollContainerRef.current) {
//         e.preventDefault();
//         const x = e.pageX - scrollContainerRef.current.offsetLeft;
//         const walk = (x - startX) * 2;
//         scrollContainerRef.current.scrollLeft = scrollLeft - walk;
//       }
//     };

//     const handleGlobalMouseUp = () => {
//       if (isDragging) {
//         setIsDragging(false);
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.style.cursor = 'grab';
//         }
//       }
//     };

//     if (isDragging) {
//       document.addEventListener('mousemove', handleGlobalMouseMove);
//       document.addEventListener('mouseup', handleGlobalMouseUp);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleGlobalMouseMove);
//       document.removeEventListener('mouseup', handleGlobalMouseUp);
//     };
//   }, [isClient, isDragging, startX, scrollLeft]);

//   // Drag functionality handlers
//   const handleMouseDown = (e) => {
//     if (!isMobileView || !scrollContainerRef.current) return;

//     setIsDragging(true);
//     setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
//     setScrollLeft(scrollContainerRef.current.scrollLeft);
//     scrollContainerRef.current.style.cursor = 'grabbing';
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || !scrollContainerRef.current) return;

//     e.preventDefault();
//     const x = e.pageX - scrollContainerRef.current.offsetLeft;
//     const walk = (x - startX) * 2; // Scroll speed multiplier
//     scrollContainerRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleMouseUp = () => {
//     if (!scrollContainerRef.current) return;

//     setIsDragging(false);
//     scrollContainerRef.current.style.cursor = 'grab';
//   };

//   const handleMouseLeave = () => {
//     if (!scrollContainerRef.current) return;

//     setIsDragging(false);
//     scrollContainerRef.current.style.cursor = 'grab';
//   };

//   // Touch handlers for mobile
//   const handleTouchStart = (e) => {
//     if (!isMobileView || !scrollContainerRef.current) return;

//     setIsDragging(true);
//     setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
//     setScrollLeft(scrollContainerRef.current.scrollLeft);
//   };

//   const handleTouchMove = (e) => {
//     if (!isDragging || !scrollContainerRef.current) return;

//     const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
//     const walk = (x - startX) * 2;
//     scrollContainerRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleTouchEnd = () => {
//     setIsDragging(false);
//   };

//   // Feedback data - sample data for 6 feedback cards
//   const feedbackData = [
//     {
//       id: 1,
//       customerName: "Beth Russell",
//       customerRole: "Store Owner",
//       customerImage: "/images/Feedback-Customer.webp",
//       rating: 5,
//       feedback: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
//     },
//     {
//       id: 2,
//       customerName: "John Smith",
//       customerRole: "Business Manager",
//       customerImage: "/images/Feedback-Customer.webp",
//       rating: 4.5,
//       feedback: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
//     },
//     {
//       id: 3,
//       customerName: "Sarah Johnson",
//       customerRole: "CEO",
//       customerImage: "/images/Feedback-Customer.webp",
//       rating: 5,
//       feedback: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
//     },
//     {
//       id: 4,
//       customerName: "Mike Davis",
//       customerRole: "Director",
//       customerImage: "/images/Feedback-Customer.webp",
//       rating: 4,
//       feedback: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
//     },
//     {
//       id: 5,
//       customerName: "Emily Wilson",
//       customerRole: "Manager",
//       customerImage: "/images/Feedback-Customer.webp",
//       rating: 5,
//       feedback: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
//     },
//     {
//       id: 6,
//       customerName: "David Brown",
//       customerRole: "Owner",
//       customerImage: "/images/Feedback-Customer.webp",
//       rating: 4,
//       feedback: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
//     }
//   ];

//   const handlePrevious = () => {
//     setCurrentIndex((prev) =>
//       prev === 0 ? Math.max(0, feedbackData.length - cardsPerView) : prev - 1
//     );
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) =>
//       prev >= feedbackData.length - cardsPerView ? 0 : prev + 1
//     );
//   };

//   // Get current cards to display based on screen size
//   const currentCards = feedbackData.slice(currentIndex, currentIndex + cardsPerView);

//   // Don't render until client-side hydration is complete
//   if (!isClient) {
//     return (
//       <div className="feedback-list-container">
//         <div className="feedback-header-container">
//           <div className="feedback-header-content">
//             <h2 className="feedback-title">Customers Feedback</h2>
//             <p className="feedback-subtitle">
//               Lorem Ipsum is simply dummy text of the printing and typesetting has been the industrys standard dummy text ever since
//             </p>
//           </div>
//           <div className="feedback-navigation">
//             <button className="feedback-nav-button" disabled>
//               <Image src="/icons/Left-Swipe-Black.webp" alt="Previous"  width={100} height={100}  quality={100}/>
//             </button>
//             <button className="feedback-nav-button" disabled>
//               <Image src="/icons/Right-Swipe-Black.webp" alt="Next"  width={100} height={100}  quality={100}/>
//             </button>
//           </div>
//         </div>
//         <div className="feedback-cards-container">
//           {/* Placeholder content during SSR */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="feedback-list-container">
//       {/* Title and button frame */}
//       <div className="feedback-header-container">
//         {/* Heading (left side) */}
//         <div className="feedback-header-content">
//           {/* Main heading */}
//           <h2 className="feedback-title">
//             Customers Feedback
//           </h2>

//           {/* Sub heading */}
//           <p className="feedback-subtitle">
//             Lorem Ipsum is simply dummy text of the printing and typesetting has been the industrys standard dummy text ever since
//           </p>
//         </div>

//         {/* Left and right swipe buttons (right side) */}
//         <div className="feedback-navigation">
//           {/* Left Swipe Button */}
//           <button
//             onClick={handlePrevious}
//             className="feedback-nav-button"
//             aria-label="Previous feedback"
//           >
//             <Image src="/icons/Left-Swipe-Black.webp"
//               alt="Previous"
//               className="feedback-nav-icon"
//              width={100} height={100}  quality={100}/>
//           </button>

//           {/* Right Swipe Button */}
//           <button
//             onClick={handleNext}
//             className="feedback-nav-button"
//             aria-label="Next feedback"
//           >
//             <Image src="/icons/Right-Swipe-Black.webp"
//               alt="Next"
//               className="feedback-nav-icon"
//              width={100} height={100}  quality={100}/>
//           </button>
//         </div>
//       </div>

//       {/* Feedback cards container */}
//       <div
//         className={`feedback-cards-container ${isMobileView ? 'mobile-scroll' : ''}`}
//         ref={isMobileView ? scrollContainerRef : null}
//         onMouseDown={isMobileView ? handleMouseDown : undefined}
//         onMouseMove={isMobileView ? handleMouseMove : undefined}
//         onMouseUp={isMobileView ? handleMouseUp : undefined}
//         onMouseLeave={isMobileView ? handleMouseLeave : undefined}
//         onTouchStart={isMobileView ? handleTouchStart : undefined}
//         onTouchMove={isMobileView ? handleTouchMove : undefined}
//         onTouchEnd={isMobileView ? handleTouchEnd : undefined}
//         style={{
//           cursor: isMobileView ? (isDragging ? 'grabbing' : 'grab') : 'default'
//         }}
//       >
//         {isMobileView ? (
//           // Mobile: Horizontal scrolling container
//           <div className="feedback-cards-scroll">
//             {feedbackData.map((feedback) => (
//               <FeedbackCard
//                 key={feedback.id}
//                 customerName={feedback.customerName}
//                 customerRole={feedback.customerRole}
//                 customerImage={feedback.customerImage}
//                 rating={feedback.rating}
//                 feedback={feedback.feedback}
//                 isMobile={true}
//               />
//             ))}
//           </div>
//         ) : (
//           // Desktop/Tablet: Show current cards with navigation
//           currentCards.map((feedback) => (
//             <FeedbackCard
//               key={feedback.id}
//               customerName={feedback.customerName}
//               customerRole={feedback.customerRole}
//               customerImage={feedback.customerImage}
//               rating={feedback.rating}
//               feedback={feedback.feedback}
//               isMobile={false}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default FeedbackList;
"use client";
import { useState, useEffect, useRef } from "react";
import FeedbackCard from "./FeedbackCard";
import { useWindowSize, useClientOnly } from "../../../hooks/useClientOnly";
import Image from "next/image";
// import { BASE_URL } from "../../../../../config.js";

const FeedbackList = ({ feedbackData: propFeedbackData, isLoading }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isClient = useClientOnly();
    const { width } = useWindowSize();
    const [cardsPerView, setCardsPerView] = useState(3);
    const [isMobileView, setIsMobileView] = useState(false);

    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const [feedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        if (!propFeedbackData || propFeedbackData.length === 0) {
            setFeedbackData([]);
            return;
        }

        const transformed = propFeedbackData.map((item) => ({
            id: item._id,
            customerName: item.clientName,
            customerImage: `${item.clientImage}`,
            rating: item.rating,
            feedback: item.review,
            customerRole: "",
        }));

        setFeedbackData(transformed);
    }, [propFeedbackData]);

    useEffect(() => {
        if (!isClient) return;
        if (width <= 767) {
            setCardsPerView(1);
            setIsMobileView(true);
        } else if (width <= 1199) {
            setCardsPerView(2);
            setIsMobileView(false);
        } else {
            setCardsPerView(3);
            setIsMobileView(false);
        }
    }, [isClient, width]);

    useEffect(() => {
        if (!isClient) return;

        const handleGlobalMouseMove = (e) => {
            if (isDragging && scrollContainerRef.current) {
                e.preventDefault();
                const x = e.pageX - scrollContainerRef.current.offsetLeft;
                const walk = (x - startX) * 2;
                scrollContainerRef.current.scrollLeft = scrollLeft - walk;
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.style.cursor = "grab";
                }
            }
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleGlobalMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleGlobalMouseMove);
            document.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [isClient, isDragging, startX, scrollLeft]);

    const handleMouseDown = (e) => {
        if (!isMobileView || !scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = "grabbing";
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = "grab";
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = "grab";
    };

    const handleTouchStart = (e) => {
        if (!isMobileView || !scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? Math.max(0, feedbackData.length - cardsPerView) : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev >= feedbackData.length - cardsPerView ? 0 : prev + 1));
    };

    const currentCards = feedbackData.slice(currentIndex, currentIndex + cardsPerView);

    if (!isClient || isLoading) {
        return (
            <div className="w-full py-12 px-4 text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Feedback</h2>
                <p className="text-sm text-gray-500">Loading feedback...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[85%] mx-auto px-4 md:px-6 lg:px-8 pb-18">
            <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between mb-6 md:mb-8 lg:mb-8">
                <div className="text-center md:text-left lg:text-left mb-4 md:mb-0 lg:mb-0">
                    <h2 className="text-xl md:text-2xl lg:text-[26px] font-semibold mb-2"> What Our Clients Say</h2>
                    <p className="text-sm md:text-base lg:text-base text-black max-w-md md:max-w-lg lg:max-w-[600px]"></p>
                </div>
                {/* Show navigation buttons at 768px and above, consistent at 1024px and 1440px */}
                <div className="hidden md:flex lg:flex gap-3 lg:gap-4">
                    <button onClick={handlePrevious} className="bg-white p-2 lg:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <Image src="/icons/Left-Swipe-Black.webp" alt="Previous" width={20} height={20} className="lg:w-6 lg:h-6" />
                    </button>
                    <button onClick={handleNext} className="bg-white p-2 lg:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <Image src="/icons/Right-Swipe-Black.webp" alt="Next" width={20} height={20} className="lg:w-6 lg:h-6" />
                    </button>
                </div>
            </div>

            <div
                className={`
            ${isMobileView ? "flex overflow-x-auto gap-4 snap-x scroll-smooth no-scrollbar" : "grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"}
        `}
                ref={isMobileView ? scrollContainerRef : null}
                onMouseDown={isMobileView ? handleMouseDown : undefined}
                onMouseMove={isMobileView ? handleMouseMove : undefined}
                onMouseUp={isMobileView ? handleMouseUp : undefined}
                onMouseLeave={isMobileView ? handleMouseLeave : undefined}
                onTouchStart={isMobileView ? handleTouchStart : undefined}
                onTouchMove={isMobileView ? handleTouchMove : undefined}
                onTouchEnd={isMobileView ? handleTouchEnd : undefined}
                style={{ cursor: isMobileView ? (isDragging ? "grabbing" : "grab") : "default" }}
            >
                {(isMobileView ? feedbackData : currentCards).map((feedback) => (
                    <FeedbackCard
                        key={feedback.id}
                        customerName={feedback.customerName}
                        customerRole={feedback.customerRole}
                        customerImage={feedback.customerImage}
                        rating={feedback.rating}
                        feedback={feedback.feedback}
                        isMobile={isMobileView}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeedbackList;
