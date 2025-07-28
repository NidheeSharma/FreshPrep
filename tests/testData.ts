export const TestData = {
  // Test card numbers for different scenarios
  cards: {
    validVisa: '4000056655665556',
    invalidCard: '1234567890123456',
    insufficientFunds: '4000008260003178',
    expiredCard: '4000000000000069', // Will use expired date
  },
  
  // Expiry dates
  expiry: {
    valid: '12/26',
    expired: '01/23',
    current: '12/24',
  },
  
  // CVV codes
  cvv: {
    valid: '123',
    invalid: '12',
    twoDigit: '12',
  },
  
  // User data
  users: {
    sender: {
      name: 'John Doe',
      email: 'john@test.com',
    },
    recipient: {
      name: 'Jane Doe',
      email: 'jane@test.com',
    },
  },
  
  // Gift card amounts
  amounts: {
    mostPopular: '$100',
    amount100: '100',
  },
  
  // URLs
  urls: {
    giftCard: '/gift',
  },
};