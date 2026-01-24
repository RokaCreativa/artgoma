import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const bucketName = "events"; // Nombre fijo del bucket en Supabase, ajusta si es diferente

  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const uploadedFiles: { name: string; url: string }[] = [];

    for (const file of files) {
      // Crear nombre único para evitar colisiones
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Convertir File a Buffer para subida si es necesario, 
      // pero en App Router se puede pasar el blob directo

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      uploadedFiles.push({ name: file.name, url: publicUrl });
    }

    return NextResponse.json({
      status: "ok",
      message: "Files uploaded successfully.",
      files: uploadedFiles,
    });
  } catch (error: any) {
    console.error("Error uploading files to Supabase:", error);
    return NextResponse.json({
      status: "fail",
      message: error.message || "Failed to upload files.",
    });
  }
}
