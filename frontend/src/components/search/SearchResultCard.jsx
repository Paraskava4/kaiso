import Image from "next/image";
import { ISO_toDateFormat } from "../shared/dateFormat";

const SearchResultCard = ({ publishDate = "", category = "", sector = "", title, description, onReadMore }) => {
    return (
        <article className="flex py-5 flex-col items-start gap-5 self-stretch border-b-[0.5px] border-[rgba(67,70,75,0.30)]">
            <div className="flex pr-[200px] flex-col items-start gap-2 self-stretch">
                <div className="flex items-start gap-3 self-stretch">
                    <span className="text-sm leading-6 text-zinc-700">Publish Date: {ISO_toDateFormat(`${publishDate}`, "dd-MM-yyyy")}</span>
                    <span className="text-sm leading-6 text-zinc-700">{category}</span>
                    <span className="text-sm leading-6 text-zinc-700">{sector}</span>
                </div>
                <h2 className="self-stretch text-lg font-medium leading-7 text-zinc-900 max-sm:text-base">{title}</h2>
                <p className="self-stretch text-base leading-6 text-zinc-700 max-sm:text-sm">{description}</p>
            </div>
            <button
                onClick={onReadMore}
                className="flex items-center gap-[10px] outline-none focus:outline-none hover:opacity-80 transition-opacity"
                aria-label={`Read more about ${title}`}
            >
                <span className="text-base leading-6 text-red-600">Read more</span>
                <Image src="/icons/Service-Arrow.webp" alt="Arrow" className="w-4 h-4" width={100} height={100} quality={100} />
            </button>
        </article>
    );
};

export default SearchResultCard;
