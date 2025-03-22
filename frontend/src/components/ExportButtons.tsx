import React from "react";
import { Button, Box, useTheme, useMediaQuery } from "@mui/material";
import { Topic } from "./TopicsTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonsProps {
  topics: Topic[];
}

/**
 * A React component that renders two buttons for exporting a list of topics in
 * CSV and PDF formats. The buttons are styled with MUI and adapt their layout for
 * mobile devices.
 *
 * @param {ExportButtonsProps} props - The component props.
 * @param {Topic[]} props.topics - An array of topic objects to be exported.
 * @returns {JSX.Element} - A React component rendering two export buttons.
 */
const ExportButtons: React.FC<ExportButtonsProps> = ({ topics }) => {
  /**
   * Converts an array of topic objects to a CSV string.
   *
   * The first row of the CSV is the header, and each subsequent row
   * represents a topic. The columns are "vertical", "subVertical", "topicTitle",
   * "geo", and "platform". If the topic's platform is missing, it is
   * represented as an empty string.
   *
   * @param {Topic[]} topics - An array of topic objects to be converted.
   * @returns {string} - A CSV string representing the topics.
   */
  const convertTopicsToCSV = (topics: Topic[]): string => {
    if (topics.length === 0) return "";

    const header = [
      "vertical",
      "subVertical",
      "topicTitle",
      "geo",
      "platform",
    ].join(",");

    const rows = topics.map((topic) => {
      return [
        topic.vertical,
        topic.subVertical,
        topic.topicTitle,
        topic.geo,
        topic.platform || "",
      ]
        .map((field) => `"${field}"`)
        .join(",");
    });

    return [header, ...rows].join("\r\n");
  };

  /**
   * Downloads a CSV file containing the topics in the given array.
   *
   * The function creates a Blob with the CSV data and uses the URL
   *.createObjectURL() method to generate a URL for the Blob. A new
   * <a> element is created with the generated URL and the download
   * attribute set to "topics.csv", and the element is then clicked to
   * trigger the download.
   */
  const downloadCSV = () => {
    const csv = convertTopicsToCSV(topics);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "topics.csv");
    link.click();
  };

  /**
   * Downloads a PDF file containing the topics in the given array.
   *
   * The function creates a new jsPDF document and uses the autoTable
   * plugin to generate a table from the topics array. The table has
   * columns for "Vertical", "Sub-Vertical", "Topic", "GEO", and "Platform",
   * and includes the topic title and geo in the "Topic" and "GEO" columns
   * respectively. The platform is included in the "Platform" column if
   * present, otherwise an empty string is used. The table is styled with
   * a font size of 8 and a header background color of #1698BE. The
   * document is saved as "topics.pdf".
   */
  const downloadPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "Vertical", dataKey: "vertical" },
      { header: "Sub-Vertical", dataKey: "subVertical" },
      { header: "Topic", dataKey: "topicTitle" },
      { header: "GEO", dataKey: "geo" },
      { header: "Platform", dataKey: "platform" },
    ];

    const rows = topics.map((topic) => ({
      vertical: topic.vertical,
      subVertical: topic.subVertical,
      topicTitle: topic.topicTitle,
      geo: topic.geo,
      platform: topic.platform || "",
    }));

    autoTable(doc, {
      columns: columns,
      body: rows,
      margin: { top: 20 },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      didDrawPage: function (data: any) {
        doc.text("Campaign Topics", data.settings.margin.left, 10);
      },
    });

    doc.save("topics.pdf");
  };

  // Responsive adjustments for mobile devices.
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      gap={2}
      mb={2}
      alignItems="center"
    >
      <Button
        variant="contained"
        color="primary"
        onClick={downloadCSV}
        fullWidth={isMobile}
      >
        Download CSV
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={downloadPDF}
        fullWidth={isMobile}
      >
        Download PDF
      </Button>
    </Box>
  );
};

export default ExportButtons;
