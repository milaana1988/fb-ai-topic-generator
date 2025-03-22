import React, { useState } from "react";
import { TextField, Button, Box, useTheme, useMediaQuery } from "@mui/material";

interface FiltersProps {
  onSearch: (term: string) => void;
  onGenerate: () => void;
}

/**
 * A component that renders a search bar and a button to generate new topics.
 *
 * The component displays a text input field and a button with a search icon.
 * When the user enters a search term and clicks the search button, the
 * `onSearch` callback is called with the current value of the `searchTerm`
 * state as an argument. The component also displays a button with a
 * "Generate New Topics" label. When the user clicks this button, the
 * `onGenerate` callback is called.
 *
 * The component adapts its layout to the screen size. On mobile devices, the
 * search bar and button are stacked vertically, while on larger screens they
 * are displayed side by side.
 */
const Filters: React.FC<FiltersProps> = ({ onSearch, onGenerate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Triggers a search action with the current search term.
   *
   * This function calls the `onSearch` callback with the current value of
   * the `searchTerm` state, allowing the parent component to perform
   * a search based on the user's input.
   */

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      gap={2}
      mb={2}
      alignItems="center"
    >
      <TextField
        label="Search Topics"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        fullWidth={isMobile}
      />
      <Box width={isMobile ? "100%" : "auto"}>
        <Button variant="contained" onClick={handleSearch} fullWidth={isMobile}>
          Search
        </Button>
      </Box>
      <Box width={isMobile ? "100%" : "auto"}>
        <Button variant="outlined" onClick={onGenerate} fullWidth={isMobile}>
          Generate New Topics
        </Button>
      </Box>
    </Box>
  );
};

export default Filters;
