/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/page-components/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                inter: ["Inter", "sans-serif"],
                "inter-display": ["sans-serif"],
                Inter: ["Inter", "sans-serif"],
                Inter_Display: ["sans-serif"],
            },
            colors: {
                "border-gray": "rgba(77, 77, 77, 0.30)",
                "blue-primary": "#163272",
                "text-primary": "#1C1C1C",
                "text-secondary": "#4D4D4D",
                "text-black": "#1A1A1A",
            },
            screens: {
                xs: "475px",
                "max-sm": { max: "767px" },
                "max-xs": { max: "575px" },
                "max-2xs": { max: "400px" },
                xlmid: { min: "1438px", max: "1534px" },
                lgmid: { min: "1300px", max: "1399px" },
            },
        },
    },
    plugins: [],
};
