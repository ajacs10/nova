import sharp from 'sharp';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const OUTPUT_MIME_TYPE = 'image/webp' as const;

export type AvatarInputMimeType = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ValidationResult {
  success: boolean;
  sanitizedBuffer?: Buffer;
  mimeType?: typeof OUTPUT_MIME_TYPE;
  error?: string;
}

const MAGIC_BYTES: Record<AvatarInputMimeType, (buffer: Buffer) => boolean> = {
  'image/jpeg': (buffer) =>
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff,
  'image/png': (buffer) =>
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/webp': (buffer) =>
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP',
};

function isSupportedMimeType(value: string): value is AvatarInputMimeType {
  return value in MAGIC_BYTES;
}

export async function validateAndSanitizeAvatar(
  buffer: Buffer,
  declaredMimeType: string,
): Promise<ValidationResult> {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return { success: false, error: 'O ficheiro de avatar é inválido.' };
  }

  if (buffer.length > MAX_AVATAR_SIZE) {
    return { success: false, error: 'O avatar não pode exceder 2 MB.' };
  }

  if (!isSupportedMimeType(declaredMimeType)) {
    return { success: false, error: 'Formato de avatar não suportado.' };
  }

  if (!MAGIC_BYTES[declaredMimeType](buffer)) {
    return { success: false, error: 'O conteúdo do avatar não corresponde ao formato declarado.' };
  }

  try {
    const sanitizedBuffer = await sharp(buffer, { failOn: 'error', limitInputPixels: 25_000_000 })
      .rotate()
      .resize(256, 256, { fit: 'cover', position: 'center' })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    return {
      success: true,
      sanitizedBuffer,
      mimeType: OUTPUT_MIME_TYPE,
    };
  } catch {
    return { success: false, error: 'Não foi possível processar o avatar.' };
  }
}
