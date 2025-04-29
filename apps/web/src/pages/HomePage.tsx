import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import Layout from '../components/Layout';
import { SongUploadResponse } from 'shared-types';

export default function HomePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = (response: SongUploadResponse) => {
    // Redirect to the analysis page using the songId
    navigate(`/analysis/${response.songId}`);
  };

  return (
    <Layout>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
          Generate Boxing Combos from Music
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload an MP3 track to automatically generate boxing combinations synced to the beat and energy of your music.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-md max-w-xl mx-auto">
          {error}
        </div>
      )}

      <FileUpload 
        onUploadSuccess={handleUploadSuccess}
        maxFileSizeMB={15}
      />

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-3">How It Works</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Upload Your Music:</strong> Select an MP3 file up to 15MB in size.
          </li>
          <li>
            <strong>Analysis:</strong> Our system analyzes the BPM (tempo) and energy profile of your track.
          </li>
          <li>
            <strong>Generate Combos:</strong> Boxing combinations are created that match the rhythm and intensity of your music.
          </li>
          <li>
            <strong>Customize:</strong> Regenerate any combo you don't like with a single click.
          </li>
        </ol>
      </div>
    </Layout>
  );
}