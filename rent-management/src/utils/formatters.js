// UTILITY FUNCTIONS FOR FORMATTING DATA

/**
 * format currency amount in Kenyan Shillings
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'KES 0';
  
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * format date in Kenyan locale
 * @param {string} dateString - Date string to format
 * @param {string} format - Format type ('short', 'long', 'full')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  const options = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  };
  
  return date.toLocaleDateString('en-KE', options[format] || options.short);
};

/**
 * format unit type for display
 * @param {string} unitType - Unit type from database
 * @returns {string} Formatted unit type
 */
export const formatUnitType = (unitType) => {
  if (!unitType) return '';
  return unitType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * format property type for display
 * @param {string} propertyType - Property type from database
 * @returns {string} Formatted property type
 */
export const formatPropertyType = (propertyType) => {
  if (!propertyType) return '';
  return propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
};

/**
 * truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * format phone number for display
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // format Kenyan phone number
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+254${cleaned.substring(1)}`;
  }
  
  return phoneNumber;
}; 