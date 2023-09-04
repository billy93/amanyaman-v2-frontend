import React from 'react';

const CurrencyFormatter = ({ amount }) => {
  const formatCurrency = (value) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);

    if (isNaN(numericValue)) {
      return 'Invalid amount';
    }

    const formattedCurrency = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(numericValue);

    // Replace "Rp" with "IDR" in the formatted string
    return formattedCurrency.replace('Rp', 'IDR');
  };

  const formattedCurrency = formatCurrency(amount);

  return (
    <div>
      <span>{formattedCurrency}</span>
    </div>
  );
};

export default CurrencyFormatter;
