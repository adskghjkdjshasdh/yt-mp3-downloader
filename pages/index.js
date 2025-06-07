import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleDownload = async () => {
    setStatus('Downloading...');
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      setStatus('Failed to download.');
      return;
    }

    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'audio.mp3';
    a.click();
    setStatus('Download complete!');
  };

  return (
    <main>
      <h1>YouTube MP3 Downloader</h1>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Paste YouTube URL"
      />
      <button onClick={handleDownload}>Download MP3</button>
      <p>{status}</p>
    </main>
  );
}
