import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import { fetchCountries, fetchUserCountry } from "../api/apiService";

interface GeoSelectorProps {
  value: string[];
  onGeoChange: (selected: string[]) => void;
}

/**
 * A component for selecting geo targets.
 *
 * It fetches a list of countries and sets the user's current country as the
 * default value if no selection exists. The component is controlled via the
 * `value` prop so that any user selection persists even after "Generate New Topics"
 * is clicked.
 *
 * @param {GeoSelectorProps} props - The component props.
 * @returns {JSX.Element} - A React component that renders a dropdown menu for
 *   selecting geo targets.
 */
const GeoSelector: React.FC<GeoSelectorProps> = ({ value, onGeoChange }) => {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countryNames = await fetchCountries();
        setOptions(countryNames);
      } catch (err) {
        console.error("Error fetching countries", err);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    // Only set the default if no country is selected yet.
    if (value.length === 0) {
      const setDefaultCountry = async () => {
        const userCountry = await fetchUserCountry();
        onGeoChange([userCountry]);
      };
      setDefaultCountry();
    }
  }, [value, onGeoChange]);

  return (
    <Box minWidth={300} maxWidth={700} mb={2}>
      <Autocomplete
        sx={{ width: "100%" }}
        multiple
        options={options}
        value={value}
        onChange={(_, newValue) => {
          onGeoChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Geo Targets" variant="outlined" />
        )}
      />
    </Box>
  );
};

export default GeoSelector;
