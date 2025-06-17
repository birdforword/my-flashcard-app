import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function UploadSubtitles({ onParsed }) {
  const onDrop = useCallback(async files => {
    const file = files[0];
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await axios.post(
        'http://localhost:4000/api/subtitles/upload',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      onParsed(res.data);  // [{offset, duration, text},…]
    } catch (err) {
      alert('字幕ファイルの解析に失敗しました');
      console.error(err);
    }
  }, [onParsed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/vtt': ['.vtt'], 'application/x-subrip': ['.srt'] }
  });

  return (
    <div
      {...getRootProps()}
      className={`p-4 border-dashed border-2 rounded text-center ${
        isDragActive ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive
        ? 'ここにファイルをドロップ'
        : '字幕ファイル（.srt/.vtt）をドラッグ＆ドロップ'}
    </div>
  );
}
