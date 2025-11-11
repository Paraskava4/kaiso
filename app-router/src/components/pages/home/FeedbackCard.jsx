import Image from "next/image";

const FeedbackCard = ({
    customerName = "Beth Russell",
    customerRole = "Store Owner",
    customerImage = "/images/feedback-customer.webp",
    rating = 5,
    feedback = "",
    isMobile = false,
}) => {
    // Generate stars
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <div
                    key={i}
                    style={{
                        color: i <= rating ? "#FFD700" : "#E0E0E0",
                        fontSize: "20px",
                        width: "20px",
                        height: "20px",
                        display: "inline-block",
                        lineHeight: "20px",
                        textAlign: "center",
                    }}
                >
                    ★
                </div>
            );
        }
        return stars;
    };

    return (
        <div
            className={`feedback-card ${isMobile ? "mobile" : ""}`}
            style={{
                display: "flex",
                padding: "30px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "30px",
                flex: "1 0 0",
                background: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            {/* Header section: Image + Name + Rating */}
            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? "16px" : "12px",
                    alignSelf: "stretch",
                }}
            >
                {/* Customer Image */}
                <Image
                    src={customerImage}
                    alt={customerName}
                    style={{
                        width: "65px",
                        height: "65px",
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                    width={100}
                    height={100}
                    quality={100}
                />

                {/* Text + Rating Block */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "6px",
                    }}
                >
                    {/* Customer Name */}
                    <h4
                        style={{
                            color: "#1C1C1C",
                            fontFamily: "Inter",
                            fontSize: "16px",
                            fontWeight: 500,
                            margin: 0,
                        }}
                    >
                        {customerName}
                    </h4>

                    {/* Rating Stars & Text */}
                    <div
                        style={{
                            display: "flex",
                            gap: "6px",
                            alignItems: "center",
                            height: "20px",
                        }}
                    >
                        <div style={{ display: "flex", gap: "2px" }}>{renderStars()}</div>
                        <span
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#4D4D4D",
                            }}
                        >
                            {rating}/5
                        </span>
                    </div>

                    {/* Customer Role (optional) */}
                    {!isMobile && (
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#4D4D4D",
                                margin: 0,
                            }}
                        >
                            {customerRole}
                        </p>
                    )}
                </div>
            </div>

            {/* Feedback Text */}
            <p
                style={{
                    color: "#4D4D4D",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "160%",
                    margin: 0,
                    alignSelf: "stretch",
                }}
            >
                {feedback}
            </p>
        </div>
    );
};

export default FeedbackCard;
