import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { AlertTriangle } from "lucide-react";

const DeleteBlogDomainModal = ({ open, onClose, onConfirm, selectedCount }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="delete-blog-domain-modal"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    textAlign: 'center'
                }}
            >
                <div className="flex justify-center mb-4">
                    <AlertTriangle className="w-6 h-6"
                        sx={{ 
                            fontSize: 48, 
                            color: '#f59e0b' 
                        }} 
                    />
                </div>

                <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                    Delete Domain{selectedCount > 1 ? 's' : ''}
                </Typography>

                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                    Are you sure you want to delete {selectedCount} domain{selectedCount > 1 ? 's' : ''}? 
                    This action cannot be undone.
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ minWidth: 100 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onConfirm}
                        sx={{
                            minWidth: 100,
                            bgcolor: '#dc2626',
                            '&:hover': {
                                bgcolor: '#b91c1c'
                            }
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteBlogDomainModal;
