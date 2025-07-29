import { useEffect, useRef, useState } from 'react';
import api from '../api';
import { Dialog } from '@headlessui/react';

export default function MyMedia() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await api.get('/media/me/media');
      setFiles(res.data);
    } catch (err) {
      console.error('Fetch media error:', err);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/media/me/media', formData);
      fetchMedia();
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleFileInputChange = (e) => handleUpload(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleUpload(droppedFile);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/media/me/media/${id}`);
      fetchMedia();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const openPreview = (file) => {
    setSelected(file);
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">My Media</h2>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
        className="bg-blue-100 border-2 border-dashed border-blue-400 p-10 rounded-xl text-center text-blue-600 cursor-pointer hover:bg-blue-200 transition mb-8"
      >
        <p className="text-lg font-medium mb-2">Click or drag & drop to upload</p>
        <p className="text-sm text-blue-700">Supported: JPG, PNG, GIF • Max: 5MB</p>
        <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" />
      </div>

      {/* Media Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {files.map((file) => (
          <div key={file._id} className="flex flex-col items-center group">
            {/* Square tile */}
            <div
              className="relative w-full aspect-square rounded overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => openPreview(file)}
            >
              <img
                src={`http://localhost:10010/uploads/${file.filename}`}
                alt="media"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
                <button
                  className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-100 text-sm font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`http://localhost:10010/uploads/${file.filename}`);
                  }}
                >
                  Copy URL
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Editable file name */}
            <input
              className="mt-2 text-center text-sm border border-transparent focus:border-blue-500 focus:outline-none rounded p-1"
              defaultValue={file.filename}
              onDoubleClick={(e) => e.target.removeAttribute('readOnly')}
              onBlur={async (e) => {
                e.target.setAttribute('readOnly', true);
                if (e.target.value !== file.filename) {
                  try {
                    await api.put(`/media/me/media/${file._id}`, { filename: e.target.value });
                    fetchMedia();
                  } catch (err) {
                    console.error('Rename error:', err);
                  }
                }
              }}
              readOnly
            />
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-6">
          <Dialog.Panel className="bg-white max-w-3xl w-full rounded-lg overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <Dialog.Title className="text-xl font-semibold text-blue-800">Image Preview</Dialog.Title>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800 text-xl">
                &times;
              </button>
            </div>
            <div className="p-4 flex flex-col items-center">
              <img
                src={`http://localhost:10010/uploads/${selected?.filename}`}
                alt="Full"
                className="max-h-[60vh] object-contain"
              />
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => navigator.clipboard.writeText(selected?.url)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => {
                    handleDelete(selected?._id);
                    setIsOpen(false);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
