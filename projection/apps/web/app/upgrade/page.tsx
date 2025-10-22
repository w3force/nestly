"use client";
import React from "react";
import { Box } from "@mui/material";
import { PlansComparison } from "../../components/PlansComparison";

export default function UpgradePage() {
  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#F5F5F5", pb: 10 }}>
        <PlansComparison />
      </Box>
    </>
  );
}
