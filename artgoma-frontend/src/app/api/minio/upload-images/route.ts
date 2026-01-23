import appConfig from "@/configs/config";
import { createBucketIfNotExists, minioClient } from "@/minio/minioClient";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req: Request) {
  const bucketName = appConfig.minio.bucketName;
  // await createBucketIfNotExists(bucketName);

  const formData = await req.formData();
  const files = formData.getAll("file") as File[];

  try {
    const uploadedFiles: { name: string; url: string }[] = [];
    for (const file of files) {
      // Convertir el ReadableStream del navegador a un Readable de Node.js
      const fileStream = Readable.from(file.stream() as any);

      // Definir la ruta del archivo en el bucket
      const filePath = `events/${file.name}`;

      // Subir el archivo a MinIO
      await minioClient.putObject(bucketName, filePath, fileStream, {
        "Content-Type": file.type,
      });

      // Construir la URL del archivo subido
      const minioEndpoint = appConfig.minio.endpoint;
      const fileUrl = `https://${minioEndpoint}/${bucketName}/${encodeURIComponent(filePath)}`;

      // Guardar el nombre y la URL del archivo
      uploadedFiles.push({ name: file.name, url: fileUrl });
    }

    return NextResponse.json({
      status: "ok",
      message: "Files uploaded successfully.",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({
      status: "fail",
      message: "Failed to upload files.",
    });
  }
}
