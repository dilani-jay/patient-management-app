export const isValidZipCode = (zip: string): boolean => {
    const zipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return zipCodeRegex.test(zip);
};

export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{5,15}$/;
    return phoneRegex.test(phone);
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
