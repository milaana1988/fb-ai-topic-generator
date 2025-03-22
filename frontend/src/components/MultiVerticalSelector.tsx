import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface MultiVerticalSelectorProps {
  value: string[];
  onVerticalChange: (selected: string[]) => void;
}

const verticalOptions = [
  "Entertainment",
  "Automotive",
  "Finance",
  "Wellness",
  "Technology",
  "Retail",
  "Travel",
  "Fashion",
  "Sports",
];

/**
 * A component that allows users to select multiple verticals from a dropdown menu.
 *
 * The component renders a dropdown menu with a list of vertical options
 * and allows multiple selections. The selected verticals are managed through
 * the `value` prop and can be updated using the `onVerticalChange` callback.
 * The component adapts its layout for mobile devices by adjusting its width.
 *
 * @param {MultiVerticalSelectorProps} props - The component props.
 * @param {string[]} props.value - An array of currently selected verticals.
 * @param {function} props.onVerticalChange - A callback invoked when the selection changes,
 * receiving the new list of selected verticals as an argument.
 * @returns {JSX.Element} - A React component that renders a multi-select dropdown for verticals.
 */

const MultiVerticalSelector: React.FC<MultiVerticalSelectorProps> = ({
  value,
  onVerticalChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Handles changes to the selected verticals in the multi-select dropdown.
   *
   * This function updates the selection by invoking the `onVerticalChange`
   * callback with the new array of selected verticals.
   *
   * @param {SelectChangeEvent<string[]>} event - The change event from the
   * select component, containing the updated list of selected verticals.
   */

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = event.target.value as string[];
    onVerticalChange(newValue);
  };

  return (
    <Box width={isMobile ? "100%" : 300} mb={2}>
      <FormControl fullWidth>
        <InputLabel id="multi-vertical-label">Verticals</InputLabel>
        <Select
          labelId="multi-vertical-label"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label="Verticals" />}
        >
          {verticalOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MultiVerticalSelector;
