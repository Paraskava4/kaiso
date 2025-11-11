import Image from "next/image";

const SearchHeader = ({ searchTerm = "Green Energy", onSearchChange, onClear }) => {
    return (
        <header className="flex px-[10px] py-3 justify-between items-center self-stretch h-[46px] border-b-[0.5px] border-[#8E8F96]">
            <div className="flex gap-2 items-center flex-1">
                <Image src="/icons/search.webp" alt="Search" className="w-5 h-5" width={100} height={100} quality={100} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="text-lg font-medium text-zinc-900 max-sm:text-base bg-transparent border-none outline-none focus:outline-none flex-1"
                    placeholder="Search..."
                />
            </div>
            <button onClick={onClear} className="outline-none focus:outline-none" aria-label="Clear search">
                <Image src="/icons/Close.svg" alt="Close" className="w-5 h-5" width={100} height={100} quality={100} />
            </button>
        </header>
    );
};

export default SearchHeader;
