const expiryDateString = '31/12/2024'; 
// const expiryDate = new Date(
  const parts = expiryDateString.split("-");
  if (parts.length === 3) {
    const expiredDate = new Date(
      parseInt(parts[2], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[0], 10)
    );
  }
  // parseInt(expiryDateString.split('-')[2], 10), 
  // parseInt(expiryDateString.split('-')[1], 10) - 1, 
  // parseInt(expiryDateString.split('-')[0], 10) 
// );
// console.log(expiredDate,'---------------------');
const currentDate = new Date();
console.log(currentDate,'-------------cd');

if (expiryDate > currentDate) {
  console.log('The expiry date has passed. The coupon is expired.');
} else {
  console.log('The coupon is still valid.');
}
