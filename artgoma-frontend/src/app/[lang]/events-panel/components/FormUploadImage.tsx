"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { createFormData, MAX_FILE_SIZE_NEXTJS_ROUTE } from "@/minio/fileUploadHelpers";
import { cn } from "@/lib/utils";
import { Check, CloudUpload, CloudUploadIcon, LoaderIcon, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";

type PreviewFile = {
  file: File;
  previewUrl: string;
};

type UploadFileResponse = {
  status: string;
  message: string;
  files: {
    name: string;
    url: string;
  }[];
};

export function UploadFilesRoute({
  setImagesToUpload,
  imagesToUpload,
}: {
  setImagesToUpload: React.Dispatch<React.SetStateAction<string[]>>;
  imagesToUpload: string[];
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);

  const [isPending, startTransition] = useTransition();

  const handleFileChange = (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPreviewFiles((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setPreviewFiles((prev) => {
      const updatedPreviews = [...prev];
      URL.revokeObjectURL(updatedPreviews[index].previewUrl);
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
  };

  const uploadToServer = () => {
    if (previewFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    startTransition(async () => {
      const files = previewFiles.map((preview) => preview.file);
      const formData = createFormData(files);

      const response = await fetch("/api/minio/upload-images", {
        method: "POST",
        body: formData,
      });

      const body: UploadFileResponse = await response.json();

      if (body.status === "ok") {
        toast({
          variant: "default",
          title: "Successful",
          description: "Images uploaded succesfuly!",
        });

        const imagePaths = body.files.map((image) => image.url);

        setImagesToUpload(imagePaths);
      } else {
        toast({
          variant: "destructive",
          title: "Erros",
          description: `Unexpected error. ${body.message}`,
        });
      }
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="file" className="text-white text-xs">
        Upload images
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "flex flex-col items-center gap-2 w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-red-500/30 transition",
          imagesToUpload.length > 0 && "hidden"
        )}
      >
        <CloudUploadIcon stroke="red" />
        <p className="text-white">
          <span>
            {previewFiles.length > 0
              ? `${previewFiles.length} file(s) selected`
              : "Drag and drop files here or click to upload"}
          </span>
          <br />
          <span className="text-xs">Upload Max file size: {MAX_FILE_SIZE_NEXTJS_ROUTE / (1024 * 1024)} MB</span>
        </p>
        <input
          disabled={isPending}
          id="file"
          ref={fileInputRef}
          type="file"
          name="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files!)}
        />
      </div>

      {previewFiles.length > 0 && (
        <div className="mt-4 flex gap-3 max-w-full overflow-x-scroll overflow-hidden scrollbar pb-4">
          {previewFiles.map((preview, index) => (
            <div key={index} className="relative flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden">
              <Image
                src={preview.previewUrl}
                alt={`Preview ${index + 1}`}
                width={250}
                height={250}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                hidden={isPending || imagesToUpload.length > 0}
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
              >
                <X stroke="white" height={15} width={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        className="mt-3 space-x-2 max-w-fit hover:opacity-80"
        onClick={uploadToServer}
        disabled={previewFiles.length === 0 || (imagesToUpload.length > 0 && true)}
        type="button"
      >
        {isPending ? (
          <>
            <span>Uploading</span> <LoaderIcon height={18} width={18} className="animate-spin" />
          </>
        ) : imagesToUpload.length > 0 ? (
          <>
            <span className="text-green-400">Successfuly uploaded</span>
            <Check height={18} width={18} className="stroke-green-400" />
          </>
        ) : (
          <>
            <span>Uplod images</span> <CloudUpload height={18} width={18} />
          </>
        )}
      </Button>
    </div>
  );
}
