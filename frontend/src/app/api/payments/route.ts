import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paymentKey, orderId, amount } = body;

        // Toss Payments Confirm Logic
        // const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        //   method: 'POST',
        //   headers: {
        //     Authorization: `Basic ${Buffer.from(process.env.TOSS_PAYMENTS_SECRET_KEY + ':').toString('base64')}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ paymentKey, orderId, amount }),
        // });

        // Mock success for Sandbox
        return NextResponse.json({
            success: true,
            message: 'Payment confirmed (Sandbox)',
            data: { paymentKey, orderId, amount }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
    }
}
