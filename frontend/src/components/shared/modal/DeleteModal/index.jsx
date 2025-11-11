"use client";
import React from 'react';
import { Info } from 'lucide-react';
import CommonModal from '../../commonModal/commonModal';
import CommonButton from '../../CommonButton';

const DeleteModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  itemName = "this item",
  isLoading = false,
  description = "This action cannot be undone.",
  type = "item",
  title = "Confirm Deletion",
  confirmText = "Delete",
  cancelText = "Cancel"
}) => {
  const handleConfirm = () => {
    !isLoading && onConfirm?.();
  };

  const handleCancel = () => {
    !isLoading && onClose?.();
  };

  return (
    <CommonModal
      open={isOpen}
      onClose={handleCancel}
      title={title}
      width="sm"
    >
      {/* Icon and Content */}
      <div className="flex flex-col items-center mb-6 space-y-4">
        <div className="p-4 bg-red-100 rounded-full">
          <Info size={40} className="text-red-600" />
        </div>

        <h3 className="text-lg font-medium text-center text-gray-900">
          Delete "{itemName}"?
        </h3>

        <div className="flex items-start p-3 text-sm text-gray-600 bg-gray-50 rounded-lg">
          <p>
            {description}
            {type === 'role' && (
              <span className="block mt-1">
                Users assigned to this role will lose access to related features.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <CommonButton
          onClick={handleCancel}
          disabled={isLoading}
          variant="secondary"
          className="flex-1"
        >
          {cancelText}
        </CommonButton>
        <CommonButton
          onClick={handleConfirm}
          disabled={isLoading}
          loading={isLoading}
          variant="primary"
          className="flex-1"
        >
          {confirmText}
        </CommonButton>
      </div>
    </CommonModal>
  );
};

export default DeleteModal;