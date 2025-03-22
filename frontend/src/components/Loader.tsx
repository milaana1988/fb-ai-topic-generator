import React from "react";
import { Box, CircularProgress } from "@mui/material";

/**
 * A {@link CircularProgress} with a gradient stroke.
 *
 * The gradient is from #e01cd5 to #1CB5E0.
 *
 * @returns A GradientCircularProgress component.
 */

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
        size={80}
      />
    </React.Fragment>
  );
}

/**
 * A full-screen loader component with a gradient progress circle.
 *
 * This component centers the GradientCircularProgress in a full-height
 * container with a minimum height of 200px.
 *
 * @returns A Loader component.
 */

const Loader: React.FC = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
  >
    <GradientCircularProgress />
  </Box>
);

export default Loader;
