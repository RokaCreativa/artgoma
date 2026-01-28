// Endpoint temporal para forzar revalidación de cache
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { tag, path } = await req.json();

    if (tag) {
      revalidateTag(tag, "max");
      console.log(`✅ Revalidated tag: ${tag}`);
    }

    if (path) {
      revalidatePath(path);
      console.log(`✅ Revalidated path: ${path}`);
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${tag ? `tag: ${tag}` : ''} ${path ? `path: ${path}` : ''}`
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to revalidate' }, { status: 500 });
  }
}
