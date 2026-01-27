// 🧭 MIGA DE PAN: Upload Images API - Endpoint para subir imagenes a Supabase Storage
// 📍 UBICACION: src/app/api/upload-images/route.ts
// 🎯 PORQUE EXISTE: Centralizar uploads de imagenes con soporte multi-bucket
// 🔄 FLUJO: FormData (files + bucket + path) → ESTE API → Supabase Storage → URLs publicas
// 🎯 CASOS DE USO: Upload eventos, sponsors, contenido CMS (sliders, general)
// ⚠️ DEPENDENCIAS: @/lib/supabase, @/lib/storage-config
// 🚨 CUIDADO: Mantiene backward compatibility - sin bucket/path usa 'events' por defecto
// 📋 SPEC: SPEC-24-01-2026-001-GranMigracion2026

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  STORAGE_BUCKETS,
  generateUniqueFileName,
  UPLOAD_CONFIG,
  type StorageBucket,
} from "@/lib/storage-config";

interface UploadResult {
  name: string;
  url: string;
}

interface UploadResponse {
  status: "ok" | "fail";
  message: string;
  files?: UploadResult[];
}

/**
 * POST /api/upload-images
 *
 * Sube imagenes a Supabase Storage con soporte multi-bucket
 *
 * FormData params:
 * - file: File[] (required) - Archivos a subir
 * - bucket: string (optional) - Bucket destino (default: 'events')
 * - path: string (optional) - Path dentro del bucket (default: raiz)
 *
 * @example Uso basico (backward compatible - sube a 'events'):
 * const formData = new FormData();
 * formData.append('file', file);
 * fetch('/api/upload-images', { method: 'POST', body: formData });
 *
 * @example Uso con CMS:
 * const formData = new FormData();
 * formData.append('file', file);
 * formData.append('bucket', 'cms');
 * formData.append('path', 'sliders/hero');
 * fetch('/api/upload-images', { method: 'POST', body: formData });
 */
export async function POST(
  req: Request,
): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await req.formData();

    // Obtener archivos
    const files = formData.getAll("file") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json({
        status: "fail",
        message: "No files provided.",
      });
    }

    // Obtener bucket (default: 'events' para backward compatibility)
    const bucketParam = formData.get("bucket") as string | null;
    const bucket: StorageBucket = isValidBucket(bucketParam)
      ? bucketParam
      : STORAGE_BUCKETS.events;

    // Obtener path opcional dentro del bucket
    const path = formData.get("path") as string | null;

    const uploadedFiles: UploadResult[] = [];

    for (const file of files) {
      // Validar tamano
      if (file.size > UPLOAD_CONFIG.maxFileSizeBytes) {
        return NextResponse.json({
          status: "fail",
          message: `File "${file.name}" exceeds max size of ${UPLOAD_CONFIG.maxFileSizeMB}MB.`,
        });
      }

      // Generar nombre unico
      const uniqueFileName = generateUniqueFileName(file.name);

      // Construir path completo
      const filePath = path ? `${path}/${uniqueFileName}` : uniqueFileName;

      // Subir a Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: UPLOAD_CONFIG.cacheControl,
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${file.name}:`, error);
        throw new Error(`Failed to upload "${file.name}": ${error.message}`);
      }

      // Obtener URL publica
      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

      uploadedFiles.push({
        name: file.name,
        url: publicUrl,
      });
    }

    return NextResponse.json({
      status: "ok",
      message: `${uploadedFiles.length} file(s) uploaded successfully to ${bucket}.`,
      files: uploadedFiles,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error uploading files to Supabase:", errorMessage);

    return NextResponse.json({
      status: "fail",
      message: errorMessage,
    });
  }
}

/**
 * Valida si el bucket proporcionado es valido
 */
function isValidBucket(bucket: string | null): bucket is StorageBucket {
  if (!bucket) return false;
  return Object.values(STORAGE_BUCKETS).includes(bucket as StorageBucket);
}
