"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { X } from 'lucide-react';
import CommonButton from '../../CommonButton';

const DeleteDomainModal = ({
    open = false,
    onClose,
    onConfirm,
    isLoading = false,
    selectedCount = 0,
    confirmationText = "John Doe's"
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleClose = () => {
        setInputValue('');
        onClose?.();
    };

    const handleConfirm = () => {
        if (inputValue === confirmationText && !isLoading) {
            onConfirm?.();
        }
    };

    const isConfirmDisabled = inputValue !== confirmationText || isLoading;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    padding: '8px',
                    maxWidth: '500px'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '20px 24px 16px 24px',
                fontSize: '18px',
                fontWeight: 600,
                color: '#1f2937'
            }}>
                Delete Report Domain
                <IconButton
                    onClick={handleClose}
                    sx={{ 
                        color: '#6b7280',
                        '&:hover': { backgroundColor: '#f3f4f6' }
                    }}
                >
                    <X size={24} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: '0 24px 24px 24px' }}>
                {/* Trash Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg 
                            width="40" 
                            height="40" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#6b7280" 
                            strokeWidth="1.5"
                            className="text-gray-500"
                        >
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" />
                        </svg>
                    </div>
                </div>

                {/* Warning Text */}
                <div className="text-center mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed">
                        This action will permanently delete all records and details of categories,
                        <br />
                        and all report will be individule.
                    </p>
                </div>

                {/* Confirmation Input */}
                <div className="mb-6">
                    <p className="text-gray-700 text-sm mb-3">
                        To confirm, type "{confirmationText}" in the box below.
                    </p>
                    <TextField
                        fullWidth
                        placeholder={`Type "${confirmationText}" to confirm`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f9fafb',
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#d1d5db',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#3b82f6',
                                },
                            },
                            '& .MuiInputBase-input': {
                                padding: '12px 14px',
                                fontSize: '14px',
                            }
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <CommonButton
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        loading={isLoading}
                        variant="primary"
                        className="flex-1 !bg-red-600 hover:!bg-red-700 !text-white"
                    >
                        Delete
                    </CommonButton>
                    <CommonButton
                        onClick={handleClose}
                        disabled={isLoading}
                        variant="secondary"
                        className="flex-1 !text-gray-700 !border-gray-300 hover:!bg-gray-50"
                    >
                        Cancel
                    </CommonButton>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDomainModal;
