import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db as prisma } from '@/lib/db';
import { comparePassword, setSessionCookie } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  isGuest: z.boolean().optional(),
  rememberMe: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, isGuest, rememberMe } = result.data;

    // Handle Guest login
    if (isGuest) {
      const guestId = `guest_${Math.random().toString(36).substring(2, 15)}`;
      const guestEmail = `${guestId}@neurovision.local`;
      
      // Create guest user in database
      const guestUser = await prisma.user.create({
        data: {
          name: 'Guest User',
          email: guestEmail,
          password: 'guest-placeholder-password',
          role: 'guest',
        },
      });

      await setSessionCookie({
        userId: guestUser.id,
        name: guestUser.name,
        email: guestUser.email,
        role: guestUser.role,
      }, false); // Guests are session-based, don't persist 30 days

      return NextResponse.json({
        success: true,
        user: { id: guestUser.id, name: guestUser.name, email: guestUser.email, role: guestUser.role },
      });
    }

    // Handle Standard login
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.role === 'guest') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await setSessionCookie({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, !!rememberMe);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
