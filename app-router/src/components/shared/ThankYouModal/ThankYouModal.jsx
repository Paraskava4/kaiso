import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { CheckCircle } from "lucide-react";

const ThankYouModal = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="thank-you-dialog"
            maxWidth="sm"
            fullWidth={true}
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    padding: "20px",
                },
            }}
        >
            <DialogContent>
                <div className="flex flex-col items-center justify-center text-center py-6 px-4">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Thank You
                    </h2>

                    {/* Green Checkmark Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 text-base leading-relaxed max-w-md">
                        Thank You For Your Response!<br />
                        Our Executive will get back to you soon
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ThankYouModal;
