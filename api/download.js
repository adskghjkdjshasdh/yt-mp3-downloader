import { exec } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile, readFile, unlink } from 'fs/promises';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;
  const outputPath = join(tmpdir(), `output.mp3`);

  const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${outputPath}" ${url}`;

  exec(command, { env: { PATH: `${process.env.PATH}:${ffmpegPath}` } }, async (err) => {
    if (err) return res.status(500).json({ error: 'yt-dlp failed.' });

    const file = await readFile(outputPath);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
    res.send(file);
    await unlink(outputPath);
  });
}
