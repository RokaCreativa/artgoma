import PaginationBar from "./PaginationBar";
import ArtworkCard from "./ArtworkCard";

export interface Artwork {
  id: string;
  title: string;
  height: string;
  width: string;
  price: string;
  genre: { name: string };
  artists: { name: string; photo: string }[];
  techniques: { name: string }[];
  photos: { photo: string; description: string }[];
}

interface ArtworkResponse {
  results: Artwork[];
  count: number;
}

const fetchArtworks = async (page: string, title: string): Promise<ArtworkResponse> => {
  const response = await fetch(
    `https://artwork-api.myaipeople.com/api/artworks/?page=${page}&page_size=12&query=${title}&active=true`
  );
  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }
  return response.json();
};

const ArtworksList = async ({ page, title }: { page: string | undefined; title: string | undefined }) => {
  const artworks = await fetchArtworks(page || "1", title || "");

  return (
    <div className="px-8 md:px-24">
      <div className="masonry sm:masonry-sm md:masonry-md">
        {artworks.results.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>

      <PaginationBar page={page} totalArtWorks={artworks.count} />
    </div>
  );
};

export default ArtworksList;
