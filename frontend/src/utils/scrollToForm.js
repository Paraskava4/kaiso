/**
 * Utility functions for scrolling to forms and redirecting to custom-reports page
 */

/**
 * Redirects to custom-reports page and scrolls to the CTA form section
 * @param {string} formType - Type of form to display ('hero', 'help', 'cta1', 'cta2')
 * @param {Object} router - Next.js router instance
 * @param {Object} reportInfo - Optional report information for dynamic pageName
 */
export const redirectToCustomReports = (formType = 'cta1', router, reportInfo = null) => {
    if (!router) {
        console.error('Router instance is required for redirectToCustomReports');
        return;
    }

    // Create dynamic pageName based on report info
    const createPageName = (basePageName, reportInfo) => {
        if (reportInfo && reportInfo.reportCode) {
            // Format: "{Report Number}'s Free Consultation"
            return `${reportInfo.reportCode}'s Free Consultation`;
        }
        return basePageName;
    };

    // Define form configurations for different button sources
    const formConfigs = {
        hero: {
            title: "Request a Custom Report",
            type: "Other",
            buttonText: "Request a Custom Report",
            successMessage: "Message sent successfully!",
            pageName: createPageName("Custom Reports Hero(Request a Custom Report)", reportInfo)
        },
        help: {
            title: "Request a Custom Report",
            type: "Other",
            buttonText: "Request a Custom Report",
            successMessage: "Message sent successfully!",
            pageName: createPageName("Custom Reports Help(Request a Custom Report)", reportInfo)
        },
        cta1: {
            title: "Submit a Custom Request",
            type: "Other",
            buttonText: "Submit a Custom Request",
            successMessage: "Message sent successfully!",
            pageName: createPageName("Custom Reports(Submit a Custom Request)", reportInfo)
        },
        cta2: {
            title: "Book a Consultation",
            type: "Other",
            buttonText: "Book a Consultation",
            successMessage: "Message sent successfully!",
            pageName: createPageName("Custom Reports(Book a Consultation)", reportInfo)
        }
    };

    // Store the form configuration in sessionStorage to pass to the custom-reports page
    const formConfig = formConfigs[formType] || formConfigs.cta1;
    sessionStorage.setItem('customReportsFormConfig', JSON.stringify(formConfig));
    sessionStorage.setItem('scrollToForm', 'true');

    // Navigate to custom-reports page
    router.push('/custom-reports');
};

/**
 * Creates a redirect handler function for a specific form type
 * @param {string} formType - Type of form to display
 * @param {Object} router - Next.js router instance
 * @param {Object} reportInfo - Optional report information for dynamic pageName
 * @returns {Function} Handler function for button clicks
 */
export const createRedirectHandler = (formType, router, reportInfo = null) => {
    return () => redirectToCustomReports(formType, router, reportInfo);
};

/**
 * Scrolls to the CTA form section and triggers form configuration update
 * @param {string} formType - Type of form to display ('hero', 'help', 'cta1', 'cta2')
 * @param {Function} updateFormCallback - Callback function to update form configuration
 */
export const scrollToCtaForm = (formType, updateFormCallback) => {
    // Define form configurations for different button sources
    const formConfigs = {
        hero: {
            title: "Request a Custom Report",
            type: "Other",
            buttonText: "Request a Custom Report",
            successMessage: "Message sent successfully!",
            pageName: "Custom Reports Hero(Request a Custom Report)"
        },
        help: {
            title: "Request a Custom Report",
            type: "Other", 
            buttonText: "Request a Custom Report",
            successMessage: "Message sent successfully!",
            pageName: "Custom Reports Help(Request a Custom Report)"
        },
        cta1: {
            title: "Submit a Custom Request",
            type: "Other",
            buttonText: "Submit a Custom Request", 
            successMessage: "Message sent successfully!",
            pageName: "Custom Reports(Submit a Custom Request)"
        },
        cta2: {
            title: "Book a Consultation",
            type: "Other",
            buttonText: "Book a Consultation",
            successMessage: "Message sent successfully!",
            pageName: "Custom Reports(Book a Consultation)"
        }
    };

    // Get the form configuration for the specified type
    const formConfig = formConfigs[formType];
    
    if (!formConfig) {
        console.error(`Invalid form type: ${formType}`);
        return;
    }

    // Update form configuration if callback provided
    if (updateFormCallback && typeof updateFormCallback === 'function') {
        updateFormCallback(formConfig);
    }

    // Scroll to the actual form section with better targeting
    setTimeout(() => {
        // First try to find the actual form content
        const formContent = document.querySelector('[data-form-content]');
        const formTarget = document.querySelector('[data-form-target]');
        const ctaFormSection = document.querySelector('[data-cta-form-section]');

        if (formContent) {
            // Scroll to the form content with top alignment
            formContent.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else if (formTarget) {
            // Scroll to the form container
            formTarget.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else if (ctaFormSection) {
            // Calculate position to scroll past the CTA section to the form
            const elementRect = ctaFormSection.getBoundingClientRect();
            const elementTop = elementRect.top + window.pageYOffset;

            window.scrollTo({
                top: elementTop + 600, // Scroll past the CTA section to the form
                behavior: 'smooth'
            });
        }
    }, 200);
};

/**
 * Creates a scroll handler function for a specific form type
 * @param {string} formType - Type of form to display
 * @param {Function} updateFormCallback - Callback function to update form configuration
 * @returns {Function} Handler function for button clicks
 */
export const createScrollHandler = (formType, updateFormCallback) => {
    return () => scrollToCtaForm(formType, updateFormCallback);
};
