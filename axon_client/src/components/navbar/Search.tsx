const Search = () => {
	return (
		<button
			type="button"
			className="flex w-fit  text-[13px] opacity-60 hover:opacity-100 transition-all  gap-[10px]"
		>
			<img
				width={18}
				height={18}
				src="/assets/searchIcon.svg"
				className=""
				alt="icon_search"
			/>
			<span className="leading-normal">Search</span>
		</button>
	);
};

export default Search;
