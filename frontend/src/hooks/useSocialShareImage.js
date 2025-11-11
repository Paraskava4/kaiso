import { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';

/**
 * Custom hook to fetch and manage social share image from API
 * @returns {Object} { socialShareImage, loading, error }
 */
export const useSocialShareImage = () => {
  const [socialShareImage, setSocialShareImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocialShareImage = async () => {
      try {
        if (!BASE_URL) {
          throw new Error("BASE_URL is not configured");
        }

        const response = await fetch(`${BASE_URL}/report/getButtonWithoutAuth`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch social share image");
        }

        const data = await response.json();

        let imageUrl = null;
        if (
          data?.status === 200 &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          const buttonData = data.data[0];
          imageUrl = buttonData.socialShareImage || null;
        }

        if (imageUrl) {
          // if it's a full url (e.g. starts with http), use directly
          setSocialShareImage(
            imageUrl.startsWith("http")
              ? imageUrl
              : `${BASE_URL}/images/${imageUrl}`
          );
        } else {
          setSocialShareImage(`${BASE_URL}/images/default-social-share.png`);
        }
      } catch (err) {
        setError(err.message);
        setSocialShareImage(`${BASE_URL}/images/default-social-share.png`);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialShareImage();
  }, []);

  return { socialShareImage, loading, error };
};
