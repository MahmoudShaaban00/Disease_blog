'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // اقرأ التوكن من localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // لو التوكن مش موجود، أرجع المستخدم لـ login
      router.replace('/login');
      setIsAuthenticated(false);
    } else {
      // لو موجود، خلي الـ ProtectedRoute يظهِر المحتوى
      setIsAuthenticated(true);
    }
  }, [router]);

  // إذا الحالة لسه بتتحدد، ممكن تعرض null (loading) عشان ما يعرضش الصفحة لحد ما يعرف
  if (isAuthenticated === null) return null;

  // لو مش مصرح، ما تعرضش المحتوى
  if (!isAuthenticated) return null;

  // لو مسموح، عرض المحتوى
  return <>{children}</>;
}
