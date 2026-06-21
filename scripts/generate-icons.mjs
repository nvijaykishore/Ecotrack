import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

function createPNG(size, r = 45, g = 106, b = 79) {
  const width = size;
  const height = size;
  const raw = Buffer.alloc((width * height * 3) + height);
  let offset = 0;

  for (let y = 0; y < height; y++) {
    raw[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const cx = x - width / 2;
      const cy = y - height / 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      const radius = width * 0.42;

      if (dist < radius) {
        const factor = 1 - dist / radius * 0.3;
        raw[offset++] = Math.min(255, Math.round(r * factor + 116 * (1 - factor)));
        raw[offset++] = Math.min(255, Math.round(g * factor + 165 * (1 - factor)));
        raw[offset++] = Math.min(255, Math.round(b * factor + 127 * (1 - factor)));
      } else {
        raw[offset++] = 240;
        raw[offset++] = 247;
        raw[offset++] = 244;
      }
    }
  }

  const compressed = deflateSync(raw);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  return png;
}

[192, 512].forEach((size) => {
  const png = createPNG(size);
  writeFileSync(join(publicDir, `pwa-${size}x${size}.png`), png);
  console.log(`Generated pwa-${size}x${size}.png`);
});

const apple = createPNG(180);
writeFileSync(join(publicDir, 'apple-touch-icon.png'), apple);
console.log('Generated apple-touch-icon.png');