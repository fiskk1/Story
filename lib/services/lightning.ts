import crypto from 'crypto';

type InvoiceInput = {
  amount: number;
  memo: string;
};

export function createMockInvoice({ amount, memo }: InvoiceInput) {
  const invoiceId = `inv_${crypto.randomUUID()}`;
  return {
    invoiceId,
    amount,
    paymentRequest: `lnbc${amount}${Buffer.from(memo).toString('hex').slice(0, 20)}`,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000)
  };
}

export function simulateWebhookStatus(invoiceId: string) {
  return {
    invoiceId,
    status: 'PAID' as const,
    txHash: crypto.randomBytes(16).toString('hex')
  };
}
