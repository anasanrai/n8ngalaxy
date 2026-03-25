import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddle: Paddle | undefined;

export async function getPaddle(): Promise<Paddle> {
  if (paddle) return paddle;
  paddle = await initializePaddle({
    environment: import.meta.env.VITE_PADDLE_ENVIRONMENT as 'sandbox' | 'production',
    token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
  });
  if (!paddle) throw new Error('Paddle failed to initialize');
  return paddle;
}

export async function openPaddleCheckout(params: {
  priceId: string;
  userId: string;
  userEmail: string;
  userName: string;
  customData: Record<string, string>;
}): Promise<void> {
  const p = await getPaddle();
  await p.Checkout.open({
    items: [{ priceId: params.priceId, quantity: 1 }],
    customer: {
      email: params.userEmail,
    },
    customData: params.customData,
    settings: {
      displayMode: 'overlay',
      theme: 'dark',
      locale: 'en',
      successUrl: `${window.location.origin}/sandbox/success`,
    },
  });
}
