const FilterTabs = ({ activeTab = "allReports", resultCount, onTabChange }) => {
    const tabs = [
        { label: "All Results", value: "allData" },
        { label: "Reports", value: "allReports" },
        { label: "Blogs", value: "blogs" },
        { label: "News articles", value: "articles" },
    ];

    return (
        <nav className="flex h-[55px] pb-5 justify-between items-start shrink-0 self-stretch border-b-[0.5px] border-[rgba(67,70,75,0.30)]">
            <div className="flex items-start gap-5" role="tablist">
                {tabs.map((tab, index) => (
                    <button
                        key={index + 1}
                        role="tab"
                        aria-selected={activeTab === tab?.label}
                        onClick={() => onTabChange && onTabChange(tab)}
                        className={`text-base leading-6 outline-none focus:outline-none px-1 ${
                            activeTab === tab?.value ? "font-medium text-zinc-900" : "text-zinc-700 hover:text-zinc-900"
                        }`}
                    >
                        {tab?.label}
                    </button>
                ))}
            </div>
            <div className="text-base leading-6 text-sky-900">{resultCount} Results</div>
        </nav>
    );
};

export default FilterTabs;
