import Image from "next/image";
import React from "react";
import { Artwork } from "./ArtworksList";

const ArtworkItem = ({ artwork }: { artwork: Artwork }) => {
  return (
    <div className="break-inside p-4 bg-white/80 border rounded-lg mb-8 transition-shadow hover:shadow-lg hover:shadow-red-700">
      <div className="overflow-hidden rounded-lg">
        <Image
          src={artwork?.photos[0]?.photo || "/placeholder.jpg"}
          alt={artwork?.title || "Artgoma picture"}
          width={500}
          height={500}
          className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      <div className="mt-2 text-sm text-gray-700">
        <h2 className="font-semibold text-lg">{artwork?.title}</h2>
        <p>
          <strong>Precio:</strong> ${artwork?.price}
        </p>
        <p>
          <strong>Dimensiones:</strong> {artwork?.width} x {artwork?.height} cm
        </p>

        <div className="flex gap-2 items-center pt-2">
          {artwork?.artists?.[0]?.photo && (
            <Image
              src={artwork?.artists[0].photo || "/placeholder.jpg"}
              alt={artwork?.title || "Artist picture"}
              width={20}
              height={20}
              quality={100}
              sizes="80vw"
              className="w-10 h-auto object-cover rounded-full"
              priority
            />
          )}

          <p>{artwork?.artists.map((a) => a?.name).join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

export default ArtworkItem;
