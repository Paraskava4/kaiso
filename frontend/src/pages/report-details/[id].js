import ReportDetails from "@/components/pages/report-details/ReportDetails";

export async function getStaticPaths() {
    // Return the list of possible values for id
    // Pre-generate paths for common report IDs
    return {
        paths: [{ params: { id: "1" } }, { params: { id: "2" } }, { params: { id: "3" } }, { params: { id: "4" } }, { params: { id: "5" } }],
        fallback: false, // Changed from true to false for static export compatibility
    };
}

export async function getStaticProps({ params }) {
    return {
        props: {
            id: params.id,
        },
    };
}

export default function ReportDetailsPage({ id }) {
    return <ReportDetails id={id} />
}
