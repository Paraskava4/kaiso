import Image from "next/image";
const IndustryCard = ({ name, iconNumber }) => {
    return (
        <div
            className="industry-item"
            style={{
                display: "flex",
                width: "120px",
                height: "150px",
                minWidth: "120px",
                minHeight: "150px",
                padding: "8px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "16px",
                aspectRatio: "1/1",
                borderRadius: "12px",
                transition: "transform 0.2s",
                "&:hover": {
                    transform: "scale(1.05)",
                },
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "44px",
                    height: "44px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                    aspectRatio: "1/1",
                }}
            >
                <Image
                    src={`/icons/Industry-icon${iconNumber}.webp`}
                    alt={`${name} icon`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                    width={100}
                    height={100}
                    quality={100}
                    loading="lazy"
                />
            </div>
            <p
                style={{
                    color: "var(--1C1C1C, #1C1C1C)",
                    textAlign: "center",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "140%",
                    textTransform: "capitalize",
                    margin: "0",
                }}
            >
                {name}
            </p>
        </div>
    );
};

export default IndustryCard;
