import Head from 'next/head';
import { useSocialShareImage } from '@/hooks/useSocialShareImage';
import { useNavbarSEOData } from '@/utils/hooks/useMetadata';

const SocialShareMeta = ({ 
    customImage = null,
    customTitle = null,
    customDescription = null 
}) => {
    const { socialShareImage, loading, error } = useSocialShareImage();
    // Always get SEO data for the landing page for consistent social sharing
    const { seoData, isLoading: seoLoading } = useNavbarSEOData('Landing Page', 'Landing Page');

    // Use custom image if provided, otherwise use the API image
    const imageUrl = customImage || socialShareImage;

    // Use custom title/description if provided, otherwise use SEO data from the landing page
    const ogTitle = customTitle || seoData?.seoTitle;
    const ogDescription = customDescription || seoData?.metaDescription;

    // Don't render meta tags if data is still loading and no custom data is provided
    if ((loading && !customImage) || (seoLoading && !customTitle && !customDescription)) {
        return null;
    }

    console.log("title:",ogTitle,"Desription:",ogDescription,"image",imageUrl);
    return (
        
        <Head>
            {/* Canonical Link - shows current URL in address bar */}
            <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
            
            <meta property="og:type" content="website" />
            {ogTitle && <meta property="og:title" content={ogTitle} />}
            {ogDescription && <meta property="og:description" content={ogDescription} />}
            {imageUrl && <meta property="og:image" content={imageUrl} />}
            {imageUrl && <meta property="og:image:width" content="1200" />}
            {imageUrl && <meta property="og:image:height" content="630" />}
            
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            {ogTitle && <meta name="twitter:title" content={ogTitle} />}
            {ogDescription && <meta name="twitter:description" content={ogDescription} />}
            {imageUrl && <meta name="twitter:image" content={imageUrl} />}

            {/* LinkedIn Meta Tags */}
            {ogTitle && <meta property="linkedin:title" content={ogTitle} />}
            {ogDescription && <meta property="linkedin:description" content={ogDescription} />}
            {imageUrl && <meta property="linkedin:image" content={imageUrl} />}
            
            {/* General Meta Tags */}
            {imageUrl && <meta name="image" content={imageUrl} />}
        </Head>
    );
};

export default SocialShareMeta;
