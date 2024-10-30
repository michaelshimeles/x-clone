"use client"
import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageSrc, altText }: {
  isOpen: boolean,
  onClose: () => void,
  imageSrc: string,
  altText: string
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative z-10 max-w-4xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;