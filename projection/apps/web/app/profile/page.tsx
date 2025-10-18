"use client";
import React, { Suspense } from "react";
import { ProfileContent } from "../../components/ProfileContent";
import { Box } from "@mui/material";

export default function ProfilePage() {
  return (
    <Suspense fallback={<Box>Loading profile...</Box>}>
      <ProfileContent />
    </Suspense>
  );
}
