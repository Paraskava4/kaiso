// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import ReportCard from "./ReportCard";
// import { BASE_URL } from "../../../../config";
// import { fetchWithErrorHandling, parseJsonWithErrorHandling } from "../../../utils/networkError";
// import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
// import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
// import { IconButton } from "@mui/material";

// const ReportsList = () => {
//   const [reportsData, setReportsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [cardsPerScreen, setCardsPerScreen] = useState(3);
//   const scrollContainerRef = useRef(null);

//   // Fetch reports from API
//   useEffect(() => {
//     const fetchReports = async () => {
//       setLoading(true);
//       const response = await fetchWithErrorHandling(`${BASE_URL}/master/webGet`, {}, "fetching reports data");
//       if (response?.error) {
//         setReportsData([]);
//         setLoading(false);
//         return;
//       }
//       const data = await parseJsonWithErrorHandling(response, "parsing reports response");
//       if (!data?.data?.publications) {
//         setReportsData([]);
//         setLoading(false);
//         return;
//       }
//       const mapped = data.data.publications.map((pub) => ({
//         image: pub.bigImage,
//         title: pub?.blogTitle ? pub?.blogTitle.substring(0, 77) + "..." : pub.reportTitle.substring(0, 77) + "...",
//         subtitle: pub?.blogDescription ? pub?.blogDescription : pub.reportId.reportSubTitle,
//         id: pub?.reportId._id,
//       }));
//       setReportsData(mapped);
//       setLoading(false);
//     };

//     fetchReports();
//   }, []);

//   // Responsive cards per screen
//   useEffect(() => {
//     const updateCardsPerScreen = () => {
//       if (window.innerWidth < 640) {
//         setCardsPerScreen(1);
//       } else if (window.innerWidth < 1024) {
//         setCardsPerScreen(2);
//       } else {
//         setCardsPerScreen(3);
//       }
//     };
//     updateCardsPerScreen();
//     window.addEventListener("resize", updateCardsPerScreen);
//     return () => window.removeEventListener("resize", updateCardsPerScreen);
//   }, []);

//   // Navigation logic
//   const handleNext = () => {
//     if (currentIndex + cardsPerScreen < reportsData.length) {
//       setCurrentIndex((prev) => prev + 1);
//       if (scrollContainerRef.current) {
//         const cardWidth = scrollContainerRef.current.querySelector(".card-container")?.offsetWidth || scrollContainerRef.current.offsetWidth / cardsPerScreen;
//         scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
//       }
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//       if (scrollContainerRef.current) {
//         const cardWidth = scrollContainerRef.current.querySelector(".card-container")?.offsetWidth || scrollContainerRef.current.offsetWidth / cardsPerScreen;
//         scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
//       }
//     }
//   };

//   if (loading) {
//     return <div className="text-center text-gray-500">Loading reports...</div>
//   }

//   if (reportsData.length === 0) {
//     return <div className="text-center text-gray-500">No reports available.</div>
//   }

//   return (
//     <div className="relative w-[81.9%] mx-auto">
//       <div
//         ref={scrollContainerRef}
//         className="flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4"
//         style={{ scrollBehavior: "smooth" }}
//       >
//         {reportsData.map((report, index) => (
//           <div
//             key={index}
//             className="flex-shrink-0 snap-start card-container"
//             style={{ width: `calc(${100 / cardsPerScreen}% - ${16 / cardsPerScreen}px)` }}
//           >
//             <ReportCard
//               report={report?.id}
//               image={report.image}
//               title={report.title}
//               subtitle={report.subtitle}
//               alt={`Report ${index + 1}`}
//             />
//           </div>
//         ))}
//       </div>
//       {/* Navigation Arrows */}
//       {reportsData.length > cardsPerScreen && (
//         <>
//           <IconButton
//             onClick={handlePrevious}
//             disabled={currentIndex === 0}
//             size="large"
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "-9.2%",
//               transform: "translateY(-50%)",
//               zIndex: 10,
//               "&:hover": { bgcolor: "#1e3a8a" },
//             }}
//           >
//             <ArrowCircleLeftOutlinedIcon
//               sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: currentIndex === 0 ? "gray" : "#f0f0f0" }}
//             />
//           </IconButton>
//           <IconButton
//             onClick={handleNext}
//             disabled={currentIndex + cardsPerScreen >= reportsData.length}
//             size="large"
//             sx={{
//               position: "absolute",
//               top: "50%",
//               right: "-9.2%",
//               transform: "translateY(-50%)",
//               zIndex: 10,
//               "&:hover": { bgcolor: "#1e3a8a" },
//             }}
//           >
//             <ArrowCircleRightOutlinedIcon
//               sx={{
//                 fontSize: { xs: 28, sm: 32, md: 36 },
//                 color: currentIndex + cardsPerScreen >= reportsData.length ? "gray" : "#f0f0f0",
//               }}
//             />
//           </IconButton>
//         </>
//       )}
//     </div>
//   );
// };

// export default ReportsList;

"use client";
import React, { useState, useEffect, useRef } from "react";
import ReportCard from "./ReportCard";
import { BASE_URL } from "../../../../config";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReportsList = ({ reportsData: propReportsData, isLoading }) => {
  const [reportsData, setReportsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerScreen, setCardsPerScreen] = useState(3);
  const scrollContainerRef = useRef(null);

  // Process reports data from props
  useEffect(() => {
    if (!propReportsData || propReportsData.length === 0) {
      setReportsData([]);
      return;
    }

    const mapped = propReportsData.map((pub) => ({
      image: pub.bigImage,
      title: pub?.blogTitle
        ? pub.blogTitle.substring(0, 77) + "..."
        : pub.reportTitle.substring(0, 77) + "...",
      subtitle: pub?.blogDescription ? pub.blogDescription : pub.reportId.reportSubTitle,
      id: pub?.reportId._id,
      reportTitle: pub?.blogTitle || pub.reportTitle,
      report: pub?.reportId,
    }));

    setReportsData(mapped);
  }, [propReportsData]);

  // Responsive cards per screen
  useEffect(() => {
    const updateCardsPerScreen = () => {
      if (window.innerWidth < 640) {
        setCardsPerScreen(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerScreen(2);
      } else {
        setCardsPerScreen(3);
      }
    };
    updateCardsPerScreen();
    window.addEventListener("resize", updateCardsPerScreen);
    return () => window.removeEventListener("resize", updateCardsPerScreen);
  }, []);

  // Navigation logic
  // Navigation logic
  const handleNext = () => {
    if (currentIndex + cardsPerScreen < reportsData.length) {
      setCurrentIndex((prev) => prev + cardsPerScreen); // ⬅ jump by cardsPerScreen
      if (scrollContainerRef.current) {
        const cardWidth =
          scrollContainerRef.current.querySelector(".card-container")?.offsetWidth ||
          scrollContainerRef.current.offsetWidth / cardsPerScreen;
        scrollContainerRef.current.scrollBy({
          left: cardWidth * cardsPerScreen, // ⬅ scroll multiple cards
          behavior: "smooth",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(prev - cardsPerScreen, 0)); // ⬅ jump back by cardsPerScreen
      if (scrollContainerRef.current) {
        const cardWidth =
          scrollContainerRef.current.querySelector(".card-container")?.offsetWidth ||
          scrollContainerRef.current.offsetWidth / cardsPerScreen;
        scrollContainerRef.current.scrollBy({
          left: -cardWidth * cardsPerScreen, // ⬅ scroll multiple cards
          behavior: "smooth",
        });
      }
    }
  };


  if (isLoading) {
    return <div className="text-center text-gray-500">Loading reports...</div>
  }

  if (reportsData.length === 0) {
    return <div className="text-center text-gray-500">No reports available.</div>
  }

  return (
    <div className="relative w-[81.9%] mx-auto">
      <div
        ref={scrollContainerRef}
        className="flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {reportsData.map((report, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-start card-container"
            style={{ width: `calc(${100 / cardsPerScreen}% - ${16 / cardsPerScreen}px)` }}
          >
            <ReportCard
              report={report?.report}
              reportTitle={report?.reportTitle}
              image={report.image}
              title={report.title}
              subtitle={report.subtitle}
              alt={`Report ${index + 1}`}
            />
          </div>
        ))}
      </div>
      {/* Navigation Arrows */}
      {reportsData.length > cardsPerScreen && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={{
              position: "absolute",
              top: "50%",
              left: "-9.2%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(0, 0, 0, 0.5)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={24} color={currentIndex === 0 ? "gray" : "#f0f0f0"} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex + cardsPerScreen >= reportsData.length}
            style={{
              position: "absolute",
              top: "50%",
              right: "-9.2%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(0, 0, 0, 0.5)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: currentIndex + cardsPerScreen >= reportsData.length ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={24} color={currentIndex + cardsPerScreen >= reportsData.length ? "gray" : "#f0f0f0"} />
          </button>
        </>
      )}
    </div>
  );
};

export default ReportsList;