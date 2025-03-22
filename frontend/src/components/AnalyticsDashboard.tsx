import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export interface AggregatedCampaign {
  vertical: string;
  subVertical: string;
  topicTitle: string;
  geo: string;
  platform: string;
  count: number;
  feedbackStats: {
    likes: number;
    dislikes: number;
  };
}

interface AnalyticsDashboardProps {
  data: AggregatedCampaign[];
}

/**
 * A dashboard component that displays aggregated campaign data.
 * The component renders 4 charts:
 * - Vertical Distribution: A pie chart showing the distribution of campaigns
 *   by vertical.
 * - Platform Distribution: A pie chart showing the distribution of campaigns
 *   by platform.
 * - Feedback Summary: A bar chart showing the total likes and dislikes of all
 *   campaigns.
 * - Geo Distribution: A bar chart showing the distribution of campaigns by geo.
 * The component takes an array of AggregatedCampaign objects as a prop.
 * @prop {AggregatedCampaign[]} data The array of aggregated campaign data.
 * @returns {React.ReactElement} The rendered dashboard component.
 */
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const verticalCounts = data.reduce((acc, campaign) => {
    const key = campaign.vertical || "Unknown";
    acc[key] = (acc[key] || 0) + campaign.count;
    return acc;
  }, {} as { [key: string]: number });

  const verticalData = {
    labels: Object.keys(verticalCounts),
    datasets: [
      {
        label: "Vertical Distribution",
        data: Object.values(verticalCounts),
        backgroundColor: [
          "#8E44AD",
          "#3498DB",
          "#27AE60",
          "#F1C40F",
          "#E74C3C",
          "#34495E",
          "#4BC0C0",
          "#FF6384",
          "#36A2EB",
        ],
      },
    ],
  };

  const platformCounts = data.reduce((acc, campaign) => {
    const key = campaign.platform || "N/A";
    acc[key] = (acc[key] || 0) + campaign.count;
    return acc;
  }, {} as { [key: string]: number });

  const platformData = {
    labels: Object.keys(platformCounts),
    datasets: [
      {
        label: "Platform Distribution",
        data: Object.values(platformCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const totalFeedback = data.reduce(
    (acc, campaign) => {
      acc.like += campaign.feedbackStats?.likes || 0;
      acc.dislike += campaign.feedbackStats?.dislikes || 0;
      return acc;
    },
    { like: 0, dislike: 0 }
  );

  const feedbackData = {
    labels: ["Likes", "Dislikes"],
    datasets: [
      {
        label: "Feedback Summary",
        data: [totalFeedback.like, totalFeedback.dislike],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  const geoCounts = data.reduce((acc, campaign) => {
    const key = campaign.geo || "Unknown";
    acc[key] = (acc[key] || 0) + campaign.count;
    return acc;
  }, {} as { [key: string]: number });

  const geoData = {
    labels: Object.keys(geoCounts),
    datasets: [
      {
        label: "Geo Distribution",
        data: Object.values(geoCounts),
        backgroundColor: Object.keys(geoCounts).map(
          () => "#" + Math.floor(Math.random() * 16777215).toString(16)
        ),
      },
    ],
  };

  // Chart options to ensure responsiveness
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {/* Each grid item takes full width on extra-small screens and 1/4 on medium+ screens */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 1, height: 300 }}>
            <Typography variant="subtitle1">Vertical Distribution</Typography>
            <Box sx={{ height: "80%" }}>
              <Pie data={verticalData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 1, height: 300 }}>
            <Typography variant="subtitle1">Platform Distribution</Typography>
            <Box sx={{ height: "80%" }}>
              <Pie data={platformData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 1, height: 300 }}>
            <Typography variant="subtitle1">Feedback Summary</Typography>
            <Box sx={{ height: "80%" }}>
              <Bar data={feedbackData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 1, height: 300 }}>
            <Typography variant="subtitle1">Geo Distribution</Typography>
            <Box sx={{ height: "80%" }}>
              <Bar data={geoData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
