import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

export interface Topic {
  vertical: string;
  subVertical: string;
  topicTitle: string;
  geo: string;
  platform: string;
  feedback?: "like" | "dislike" | null;
}

interface TopicsTableProps {
  topics: Topic[];
  onFeedback: (index: number, feedback: "like" | "dislike") => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

/**
 * A table component that displays a list of topics with their attributes and feedback options.
 *
 * The table adapts its layout for mobile view by hiding less critical columns.
 * Each row in the table includes columns for vertical, sub-vertical, topic title, geo,
 * platform, and feedback. Users can provide feedback ("like" or "dislike") for each topic
 * using corresponding buttons.
 *
 * @param {TopicsTableProps} props - The component props.
 * @param {Topic[]} props.topics - An array of topic objects to be displayed in the table.
 * @param {function} props.onFeedback - A callback function executed when the feedback button is clicked,
 *   receiving the topic index and feedback type ("like" or "dislike") as arguments.
 * @returns {JSX.Element} - A React component rendering a table of topics.
 */

const TopicsTable: React.FC<TopicsTableProps> = ({ topics, onFeedback }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table
        sx={{ minWidth: isMobile ? 500 : 650 }}
        aria-label="customized table"
      >
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Vertical</StyledTableCell>
            {/* Hide less critical columns on mobile */}
            {!isMobile && <StyledTableCell>Sub-Vertical</StyledTableCell>}
            <StyledTableCell>Topic</StyledTableCell>
            {!isMobile && <StyledTableCell>GEO</StyledTableCell>}
            {!isMobile && <StyledTableCell>Platform</StyledTableCell>}
            <StyledTableCell>Feedback</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {topics.map((topic, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{topic.vertical}</StyledTableCell>
              {!isMobile && (
                <StyledTableCell>{topic.subVertical}</StyledTableCell>
              )}
              <StyledTableCell>{topic.topicTitle}</StyledTableCell>
              {!isMobile && <StyledTableCell>{topic.geo}</StyledTableCell>}
              {!isMobile && (
                <StyledTableCell>{topic.platform || "N/A"}</StyledTableCell>
              )}
              <StyledTableCell>
                <IconButton
                  onClick={() => onFeedback(index, "like")}
                  color={topic.feedback === "like" ? "primary" : "default"}
                >
                  <ThumbUpIcon />
                </IconButton>
                <IconButton
                  onClick={() => onFeedback(index, "dislike")}
                  color={topic.feedback === "dislike" ? "error" : "default"}
                >
                  <ThumbDownIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopicsTable;
