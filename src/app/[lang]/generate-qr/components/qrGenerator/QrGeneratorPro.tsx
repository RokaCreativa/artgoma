"use client";

import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { Check, Copy, Download, Settings } from "lucide-react";
import Selector from "./select/Selector";
import Image from "next/image";
import { ICollaborator } from "@/queries/getCollaborators";
import { IEvent } from "@/queries/getActiveEvents";

const QrGeneratorPro = ({ collaborators, events }: { collaborators: ICollaborator[]; events: IEvent[] }) => {
  const [urlParams, setUrlParams] = useState<{ collaborator?: string; eventSlug?: string }>({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [useEventURL, setUseEventURL] = useState(false); // Switch entre colaboradores y eventos

  const downloadQR = () => {
    const canvas: any = document.getElementById("myqr");
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "myqr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Construir la URL condicionalmente
  const buildURL = () => {
    let url = useEventURL ? "https://artgoma.myaipeople.com/en/events" : "https://artgoma.myaipeople.com";

    if (useEventURL && urlParams.eventSlug) {
      url += `/${urlParams.eventSlug}`;
    }
    if (urlParams.collaborator) {
      url += `${useEventURL ? "?" : "/en?"}code=${urlParams.collaborator}`;
    }

    return url;
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 relative px-2">
      <div className="flex gap-2 py-4">
        <Settings /> QrGenerator:
      </div>

      {/* Switch entre colaboradores y eventos */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useEventURL} onChange={(e) => setUseEventURL(e.target.checked)} />
          Use Event URL
        </label>
      </div>

      <div className="flex flex-wrap justify-between gap-4 my-4 py-1 px-2 border rounded-xl text-xs md:text-sm lg:text-base w-full mx-4">
        <p className="text-wrap">{buildURL()}</p>
        <button
          className="active:scale-125 active:rotate-180"
          onClick={() => {
            navigator.clipboard.writeText(buildURL());
            setCopySuccess(true);
            setTimeout(() => {
              setCopySuccess(false);
            }, 3000);
          }}
        >
          {copySuccess ? <Check height={15} width={15} /> : <Copy height={15} width={15} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Selector para eventos */}
        {useEventURL && (
          <Selector
            setUrlParams={(value) => setUrlParams((prev) => ({ ...prev, eventSlug: value }))}
            items={events.map((e) => ({ id: e.id, name: e.name, value: e.slug }))}
            placeholder="Select an event"
          />
        )}

        {/* Selector para colaboradores */}
        <Selector
          setUrlParams={(value) => setUrlParams((prev) => ({ ...prev, collaborator: value }))}
          items={collaborators.map((c) => ({ id: c.id, name: c.name, value: c.code }))}
          placeholder="Select a collaborator"
        />

        <div className="flex flex-col">
          <div className="relative flex justify-center items-center rounded-xl border shadow-md overflow-hidden">
            <Image
              className="bg-black p-1 absolute z-20 rounded-l-full"
              src={"/logo-artgoma.svg"}
              alt="Logo Goma"
              width={50}
              height={50}
            />
            <QRCode
              id="myqr"
              value={buildURL()}
              bgColor="#ffffff"
              eyeRadius={[
                [8, 8, 0, 8], // top/left eye
                [8, 8, 8, 0], // top/right eye
                [8, 0, 8, 8], // bottom/left
              ]}
              eyeColor={[
                "#d31313", // top/left eye
                "#000000",
                "#000000",
              ]}
              qrStyle="squares"
              logoPaddingStyle="circle"
            />
          </div>
          <button type="button" onClick={downloadQR} className="mt-4 w-full flex gap-4">
            Download
            <Download />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrGeneratorPro;
