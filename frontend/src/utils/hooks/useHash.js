import { useEffect, useState } from "react";

function useHash() {
    const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash : "");

    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash);
        window.addEventListener("hashchange", onHashChange);

        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    return hash;
}

export default useHash;
