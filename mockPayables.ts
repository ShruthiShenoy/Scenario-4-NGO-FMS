import { PayableFormData } from '../PayableForm'; // adjust the path if needed

export interface PayableInvoice {
  vendorName: string;
  vendorEmail?: string;
  vendorNumber?: string;
  invoiceId?: string;
  invoiceDate?: string;
  dueDate?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  createdBy?: string;
  amount?: number; // ✅ Added support for amount
}

export interface ApiResponseSuccess {
  success: true;
  newInvoiceId: number;
}

export interface ApiResponseError {
  success: false;
  error: string;
}

export function postPayableInvoice(invoice: PayableInvoice): Promise<ApiResponseSuccess> {
  console.log("Received invoice in mock API:", invoice);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!invoice.vendorName || invoice.vendorName.trim() === "") {
        reject({ success: false, error: "Vendor Name is required" });
        return;
      }

      if (Math.random() < 0.8) {
        resolve({
          success: true,
          newInvoiceId: Math.floor(Math.random() * 1000) + 1,
        });
      } else {
        reject({ success: false, error: "Server error, please try again." });
      }
    }, 1500);
  });
}

export const postPayableInvoiceFromForm = async (data: PayableFormData): Promise<void> => {
  console.log("Sending data:", data);

  const invoice: PayableInvoice = {
    vendorName: data.vendorName,
    vendorEmail: data.vendorEmail,
    vendorNumber: data.vendorNumber,
    invoiceId: data.invoiceId,
    invoiceDate: data.invoiceDate,
    dueDate: data.dueDate,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
    createdBy: data.createdBy,
    amount: data.amount, // ✅ Include amount in payload
  };

  const response = await postPayableInvoice(invoice);

  console.log("Invoice posted successfully with ID:", response.newInvoiceId);
};
