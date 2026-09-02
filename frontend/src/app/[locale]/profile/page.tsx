"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "pt";

  useEffect(() => {
    router.replace(`/${locale}/settings`);
  }, [locale, router]);

  return null;
}
