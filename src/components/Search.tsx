type SearchProps = {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}
const Search: React.FC<SearchProps> = ({searchTerm,setSearchTerm}) => {
  return (
    <div className="search">
        <div>
            <img src="search.png" alt="search" />
            <input type="text" name="" id="" placeholder="Search through thousands of movies" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
    </div>
  )
}

export default Search