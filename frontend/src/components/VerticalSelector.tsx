import React, { useState } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  SelectChangeEvent,
} from "@mui/material";

interface VerticalSelectorProps {
  onVerticalChange: (vertical: string) => void;
}

/**
 * A dropdown menu for selecting a vertical.
 *
 * The component renders a dropdown menu with a label "Vertical" and
 * options for selecting a vertical. The currently selected vertical
 * is stored in component state and can be accessed via the
 * `selectedVertical` state variable. When the user selects a new
 * vertical, the component calls the `onVerticalChange` callback with
 * the newly selected vertical as an argument.
 *
 * @param {VerticalSelectorProps} props - The component props.
 * @param {function} props.onVerticalChange - A callback invoked when the
 *   selection changes, receiving the new selected vertical as an argument.
 * @returns {JSX.Element} - A React component for selecting a vertical.
 */
const VerticalSelector: React.FC<VerticalSelectorProps> = ({
  onVerticalChange,
}) => {
  const [selectedVertical, setSelectedVertical] = useState("Automotive");

  /**
   * Handles changes to the selected vertical by updating the component state
   * and calling the `onVerticalChange` callback with the newly selected vertical.
   *
   * @param {SelectChangeEvent<string>} event - The event emitted by the select
   *   component when the selection changes.
   */

  const handleChange = (event: SelectChangeEvent<string>) => {
    const vertical = event.target.value as string;
    setSelectedVertical(vertical);
    onVerticalChange(vertical);
  };

  return (
    <Box width={200} mb={2}>
      <FormControl fullWidth>
        <InputLabel id="vertical-select-label">Vertical</InputLabel>
        <Select
          labelId="vertical-select-label"
          value={selectedVertical}
          label="Vertical"
          onChange={handleChange}
        >
          <MenuItem value="Automotive">Automotive</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="Wellness">Wellness</MenuItem>
          {/* Add more verticals as needed */}
        </Select>
      </FormControl>
    </Box>
  );
};

export default VerticalSelector;
