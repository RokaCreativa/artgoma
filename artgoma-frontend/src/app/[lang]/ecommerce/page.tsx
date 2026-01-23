import ArtworksList from "./components/ArtworksList";
import SearchByTitle from "./components/SearchByTitle";

export default function EcommercePage({
  searchParams,
}: {
  searchParams: { page: string | undefined; title: string | undefined };
}) {
  return (
    <>
      <div className="flex px-8 md:px-24 py-8">
        <SearchByTitle />
      </div>

      <ArtworksList page={searchParams?.page} title={searchParams?.title} />
    </>
  );
}
