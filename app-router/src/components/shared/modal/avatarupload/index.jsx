"use client";
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import CommonButton from '../../CommonButton';
import CommonModal from '../../commonModal/commonModal';

const UploadArea = ({ onFileSelect, isDragOver, onDragOver, onDragLeave, onDrop }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => fileInputRef.current?.click();
  const handleKeyDown = (e) => (e.key === 'Enter' || e.key === ' ') && handleClick();
  const handleFileChange = (e) => e.target.files?.[0] && onFileSelect(e.target.files[0]);

  return (
    <section
      className={`flex flex-col justify-center px-5 py-8 mt-5 w-full bg-white rounded-md border-sky-900 border-dashed border-[0.5px] max-md:max-w-full cursor-pointer transition-colors ${
        isDragOver ? 'bg-sky-50 border-sky-600' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      tabIndex={0}
      role="button"
      aria-label="Upload avatar picture"
    >
      <div className="flex gap-2.5 items-center self-center p-2.5 w-10 h-10 bg-gray-100 rounded-lg">
        <Upload className="w-5 h-5 text-gray-600" aria-hidden="true" />
      </div>
      <p className="mt-1 text-sm text-center text-zinc-500">Upload Avatar Picture</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-describedby="upload-description"
      />
      <span id="upload-description" className="sr-only">
        Supported formats: JPG, PNG, GIF. Maximum file size: 5MB.
      </span>
    </section>
  );
};

const ActionButtons = ({ onSave, onCancel, hasFile, isLoading }) => (
  <div className="flex gap-5 mt-5 w-full text-base max-md:max-w-full">
    <CommonButton
      onClick={onSave}
      disabled={!hasFile || isLoading}
      loading={isLoading}
      variant="primary"
      className="flex-1"
      aria-label="Save avatar picture"
    >
      Save
    </CommonButton>
    <CommonButton
      onClick={onCancel}
      disabled={isLoading}
      variant="secondary"
      className="flex-1"
      aria-label="Cancel avatar upload"
    >
      Cancel
    </CommonButton>
  </div>
);

const AvatarUpload = ({
  isOpen = false,
  onSave,
  onCancel,
  maxFileSize = 5 * 1024 * 1024,
  title = "Add a Avatar"
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return false;
    }
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${maxFileSize / (1024 * 1024)}MB.`);
      return false;
    }
    setError('');
    return true;
  };

  const handleFileSelect = (file) => validateFile(file) && setSelectedFile(file);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragOver(false); e.dataTransfer.files[0] && handleFileSelect(e.dataTransfer.files[0]); };

  const handleSave = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    try {
      await onSave?.(selectedFile);
      setSelectedFile(null);
    } catch {
      setError('Failed to save avatar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError('');
    onCancel?.();
  };

  return (
    <CommonModal
      open={isOpen}
      onClose={handleCancel}
      title={title}
      width="sm"
    >
      <div className="w-full">
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {selectedFile && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700" role="status">
            Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
          </div>
        )}

        <UploadArea
          onFileSelect={handleFileSelect}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />

        <ActionButtons
          onSave={handleSave}
          onCancel={handleCancel}
          hasFile={!!selectedFile}
          isLoading={isLoading}
        />
      </div>
    </CommonModal>
  );
};

export default AvatarUpload;