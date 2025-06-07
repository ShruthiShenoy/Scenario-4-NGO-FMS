import React, { useState } from 'react';
import { Box } from '@mui/material';
import PayableForm, { PayableFormData } from './PayableForm'; // Make sure path is correct based on your folder structure
import { postPayableInvoiceFromForm } from './api/mockPayables';

const DashboardPage: React.FC = () => {
  const [payables, setPayables] = useState<PayableFormData[]>([]);

  const handleCreatePayable = async (data: PayableFormData) => {
    // Call your mock API POST function
    await postPayableInvoiceFromForm(data);
    // If no error, add to local state list
    setPayables((prev) => [...prev, data]);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <h1>Dashboard</h1>
      <PayableForm onSubmit={handleCreatePayable} />
      {/* You can add display of payables list here */}
    </Box>
  );
};

export default DashboardPage;

