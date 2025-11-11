import { Suspense } from "react";

export const Loader = ({ height }) => {
    return (
        <div className="flex_center" style={{ height: height || "75vh", width: "100%" }}>
            <span className="loader"></span>
        </div>
    );
};

export const LinearProgress = () => {
    return (
        <div className="loader-container">
            <div className="progress-bar">
                <div className="progress"></div>
            </div>
        </div>
    );
};

const Loadable = (Component) => (props) => {
    return (
        <Suspense fallback={<LinearProgress />}>
            <Component {...props} />
        </Suspense>
    );
};

export default Loadable;
