"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { changePassword } from "@/api/auth/profile";
import { getCurrentUserId } from "@/utils/axiosInstance";
import { Dialog, IconButton } from "@mui/material";
import { X } from "lucide-react";

const PasswordField = ({
  label,
  value,
  onChange,
  id,
  required = false
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={id}
        className="text-sm text-gray-600 font-medium"
      >
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="password"
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="******"
      />
    </div>
  );
};



function ChangePassword({ open, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    validatePasswords(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    validatePasswords(newPassword, e.target.value);
  };

  const validatePasswords = (newPass, confirmPass) => {
    if (confirmPass && newPass !== confirmPass) {
      setHasError(true);
      setErrorMessage("Password not matched");
    } else if (newPass && newPass.length < 6) {
      setHasError(true);
      setErrorMessage("Password must be at least 6 characters long");
    } else {
      setHasError(false);
      setErrorMessage("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setHasError(true);
      setErrorMessage("Password not matched");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setHasError(true);
      setErrorMessage("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setHasError(true);
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }

      await changePassword(userId, newPassword);
      toast.success("Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setHasError(false);
      setErrorMessage("");
      // Close the modal after successful password change
      if (onClose) onClose();
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to change password. Please try again.";
      setErrorMessage(errorMsg);
      setHasError(true);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    setHasError(false);
    setErrorMessage("");
    if (onClose) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          padding: 0,
          margin: '16px',
          maxWidth: '400px',
        }
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
          <IconButton
            onClick={handleCancel}
            size="small"
            sx={{ color: '#6B7280' }}
          >
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            id="new-password"
            required
          />

          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            id="confirm-password"
            required
          />

          {/* Error Message */}
          {hasError && errorMessage && (
            <div className="text-left">
              <span className="text-red-500 text-sm">
                {errorMessage}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || hasError || !newPassword || !confirmPassword}
              className="w-full max-w-[190px] bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full max-w-[190px] border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </Dialog>
  );
}

export default ChangePassword;