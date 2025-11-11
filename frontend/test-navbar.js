// Test script to verify navbar data transformation
const { transformNavbarData } = require('./src/utils/navbarTransform');

// Sample API response (truncated for testing)
const apiResponse = {
    "status": 200,
    "message": "Page data get successfully",
    "data": [
        {
            "_id": "68765bd80d79e617918864b1",
            "name": "Landing Page",
            "siteMenu": [
                {
                    "_id": "68765c940d79e617918864df",
                    "name": "Landing Page",
                    "siteSubMenu": []
                }
            ]
        },
        {
            "_id": "68765bef0d79e617918864b5",
            "name": "Our Expertise",
            "siteMenu": [
                {
                    "_id": "68765d1d0d79e617918864e7",
                    "name": "Syndicate Reports",
                    "siteSubMenu": [
                        {
                            "_id": "68765eaa0d79e61791886654",
                            "name": "Global Report"
                        },
                        {
                            "_id": "68765ec60d79e61791886693",
                            "name": "Regional Report"
                        }
                    ]
                },
                {
                    "_id": "68765d290d79e617918864ed",
                    "name": "Custom Reports and Solutions",
                    "siteSubMenu": []
                }
            ]
        },
        {
            "_id": "68765c130d79e617918864c1",
            "name": "Blogs & News",
            "siteMenu": []
        },
        {
            "_id": "68765c220d79e617918864c5",
            "name": "About Us",
            "siteMenu": []
        }
    ]
};

const result = transformNavbarData(apiResponse);
