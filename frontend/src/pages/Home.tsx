import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import MultiVerticalSelector from "../components/MultiVerticalSelector";
import GeoSelector from "../components/GeoSelector";
import Filters from "../components/Filters";
import TopicsTable, { Topic } from "../components/TopicsTable";
import Loader from "../components/Loader";
import ExportButtons from "../components/ExportButtons";
import AnalyticsDashboard, {
  AggregatedCampaign,
} from "../components/AnalyticsDashboard";
import {
  fetchAggregatedCampaigns,
  generateCampaignTopics,
  storeCampaignTopics,
  updateCampaignFeedback,
} from "../api/apiService";

/**
 * The Home component is the main entry point of the application.
 * It renders a page with a banner, a button to toggle the analytics dashboard,
 * and a container that displays either the analytics dashboard or the campaign topics.
 * The user can select verticals and geos to generate new campaign topics.
 * The topics are displayed in a table with filters and an export button.
 * The user can also provide feedback on the topics, which is stored in the database.
 * The analytics dashboard displays aggregated data from the database.
 */
const Home: React.FC = () => {
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([
    "Travel",
  ]);
  const [selectedGeos, setSelectedGeos] = useState<string[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [feedbackStats, setFeedbackStats] = useState({ like: 0, dislike: 0 });
  const [excludedTopics, setExcludedTopics] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [aggregatedData, setAggregatedData] = useState<AggregatedCampaign[]>(
    []
  );

  useEffect(() => {
    const storedFeedback = localStorage.getItem("feedbackStats");
    if (storedFeedback) {
      setFeedbackStats(JSON.parse(storedFeedback));
    }
    const storedExclusions = localStorage.getItem("excludedTopics");
    if (storedExclusions) {
      setExcludedTopics(JSON.parse(storedExclusions));
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad && selectedGeos.length > 0) {
      handleGenerate();
      setIsInitialLoad(false);
    }
  }, [selectedGeos, isInitialLoad]);

  /**
   * Fetches aggregated campaign topics from the backend and sets the state.
   * Used when the user selects a new geo or when the page is loaded for the first time.
   */
  const fetchAggregetions = async () => {
    try {
      const data = await fetchAggregatedCampaigns();
      setAggregatedData(data);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Updates the feedback stats state and stores the new stats in local storage.
   * @param {{ like: number, dislike: number }} newStats The new feedback stats.
   */
  const updateFeedbackStats = (newStats: { like: number; dislike: number }) => {
    setFeedbackStats(newStats);
    localStorage.setItem("feedbackStats", JSON.stringify(newStats));
  };

  /**
   * Updates the excluded topics state and stores the new list of excluded topics in local storage.
   * @param {string[]} newExclusions The new list of excluded topics.
   */
  const updateExcludedTopics = (newExclusions: string[]) => {
    setExcludedTopics(newExclusions);
    localStorage.setItem("excludedTopics", JSON.stringify(newExclusions));
  };

  /**
   * Handles search input changes by filtering the topics list based on the search term.
   * The search is case-insensitive and matches against the topic title, vertical, sub-vertical, and geo.
   * If the search term is empty, the filter is cleared and the original topics list is restored.
   * A short delay is applied to avoid excessive filtering while the user is typing.
   * @param {string} term The search term entered by the user.
   */
  const handleSearch = (term: string) => {
    setLoading(true);
    setTimeout(() => {
      if (!term) {
        setFilteredTopics(topics);
        setLoading(false);
        return;
      }
      setFilteredTopics(
        topics.filter(
          (topic) =>
            topic.topicTitle.toLowerCase().includes(term.toLowerCase()) ||
            topic.vertical.toLowerCase().includes(term.toLowerCase()) ||
            topic.subVertical.toLowerCase().includes(term.toLowerCase()) ||
            topic.geo.toLowerCase().includes(term.toLowerCase())
        )
      );
      setLoading(false);
    }, 1300);
  };

  /**
   * Handles changes to the selected verticals by updating the state and storing the new selection in local storage.
   * @param {string[]} verticals The new list of selected verticals.
   */
  const handleVerticalChange = (verticals: string[]) => {
    setSelectedVerticals(verticals);
  };

  /**
   * Handles changes to the selected geos by updating the state and storing the new selection in local storage.
   * @param {string[]} geos The new list of selected geos.
   */
  const handleGeoChange = (geos: string[]) => {
    setSelectedGeos(geos);
  };

  /**
   * Parses a JSON string to extract an array of Topic objects.
   * If the input string is not valid JSON, attempts to extract and parse
   * a JSON array from within the string. Logs errors if parsing fails.
   *
   * @param {string} content - The JSON string containing Topic objects.
   * @returns {Topic[]} - An array of Topic objects or an empty array if parsing fails.
   */

  const parseResponseToTopics = (content: string): Topic[] => {
    try {
      const topics: Topic[] = JSON.parse(content);
      return topics;
    } catch (err) {
      console.error("Error parsing topics:", err);
      try {
        const start = content.indexOf("[");
        const end = content.lastIndexOf("]") + 1;
        if (start !== -1 && end !== -1) {
          const jsonString = content.substring(start, end);
          const topics: Topic[] = JSON.parse(jsonString);
          return topics;
        }
      } catch (fallbackError) {
        console.error("Fallback parsing error:", fallbackError);
      }
      return [];
    }
  };

  /**
   * Handles the "Generate Topics" button click by sending a request to the API
   * with the current selections and storing the response in state.
   * The API request includes notes about the current selections and previous
   * feedback, and asks the AI to generate topics that satisfy the given
   * constraints.
   * If the request fails, displays an error message.
   * If the request succeeds, stores the topics in state and updates the
   * feedback stats.
   */
  const handleGenerate = async () => {
    setShowAnalytics(false);
    setLoading(true);
    setError(null);
    try {
      let feedbackNote = "";
      if (feedbackStats.like || feedbackStats.dislike) {
        feedbackNote = `Note: Previous outputs received ${feedbackStats.like} likes and ${feedbackStats.dislike} dislikes. `;
      }
      let exclusionNote = "";
      if (excludedTopics.length > 0) {
        exclusionNote = `Exclude topics: ${excludedTopics.join(", ")}. `;
      }
      const verticalsStr = selectedVerticals.join(", ");
      let geoNote = "";
      if (selectedGeos.length > 0) {
        geoNote = `Geo targets: ${selectedGeos.join(", ")}. `;
      }
      const prompt = `${feedbackNote}${exclusionNote}${geoNote}
      Generate between 5 and 10 weekly campaign topics for the following vertical(s): ${verticalsStr}. 
      If more than one geo is selected, generate at least 2 topics for each selected geo. The "geo" value(s) must be ${selectedGeos.join(
        ", "
      )}
      Please output the result strictly as a JSON array where each object includes exactly these keys: "vertical", "subVertical", "topicTitle", "geo", "platform". 
      Please ensure that all values are non-empty. 
      , and "platform" should be one of: "Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok". 
      Do not include any additional text.`;

      const response = await generateCampaignTopics(prompt);
      const content = response.data.choices?.[0]?.message?.content || "";
      const parsedTopics = parseResponseToTopics(content);
      updateFeedbackStats({ like: 0, dislike: 0 });
      setTopics(parsedTopics);
      setFilteredTopics(parsedTopics);
      await storeCampaignTopics(parsedTopics);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || err.message || "Error generating topics."
      );
    } finally {
      await fetchAggregetions();
      setLoading(false);
      setShowAnalytics(true);
    }
  };

  /**
   * Updates the feedback for a single topic, and updates the feedback stats.
   * If the feedback is "dislike", adds the topic title to the excluded topics list.
   * Updates the topic in the database.
   * @param {number} index - The index of the topic in the topics array.
   * @param {"like"|"dislike"} feedback - The feedback to update.
   */
  const handleFeedback = async (
    index: number,
    feedback: "like" | "dislike"
  ) => {
    const updatedTopics = [...topics];
    updatedTopics[index].feedback = feedback;
    setTopics(updatedTopics);

    let newStats = { ...feedbackStats };
    if (feedback === "like") {
      newStats.like += 1;
    } else {
      newStats.dislike += 1;
      const topicTitle = updatedTopics[index].topicTitle;
      if (topicTitle && !excludedTopics.includes(topicTitle)) {
        updateExcludedTopics([...excludedTopics, topicTitle]);
      }
    }
    updateFeedbackStats(newStats);

    try {
      await updateCampaignFeedback(
        updatedTopics[index].topicTitle,
        updatedTopics[index].geo,
        updatedTopics[index].platform,
        feedback
      );
    } catch (err) {
      console.error("Error updating feedback in database:", err);
    } finally {
      await fetchAggregetions();
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
        borderRadius: 2,
        padding: { xs: 2, md: 4 },
        marginY: 2,
      }}
    >
      <Box padding={4}>
        {/* Banner */}
        <Box marginBottom={4}>
          <Paper
            elevation={3}
            sx={{
              padding: { xs: 2, md: 3 },
              backgroundColor: "primary.main",
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" component="h1">
              Welcome to the AI Campaign Topic Generator!
            </Typography>
            <Typography variant="overline" fontSize={12}>
              Create engaging campaign topics with the help of AI.
            </Typography>
          </Paper>
        </Box>
        <Box display="flex" justifyContent="center" marginBottom={4} gap={2}>
          <Button
            variant="contained"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </Button>
        </Box>
        <Box marginTop={4} display={"flex"} flexDirection={"column"} gap={4}>
          {showAnalytics && !loading && (
            <>
              <Divider sx={{ marginY: 4, fontSize: 18 }}>
                <Chip
                  label="Analytics Dashboard"
                  sx={{ fontSize: 25, padding: 5 }}
                  color="secondary"
                />
              </Divider>

              <AnalyticsDashboard data={aggregatedData} />
            </>
          )}

          {loading && <Loader />}

          <Divider sx={{ marginY: 4, fontSize: 18 }}>
            <Chip
              label="Campaign Topics"
              sx={{ fontSize: 25, padding: 5 }}
              color="secondary"
            />
          </Divider>
          {loading ? (
            <Loader />
          ) : error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : (
            <>
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                justifyContent="center"
                marginBottom={4}
                gap={2}
              >
                <MultiVerticalSelector
                  value={selectedVerticals}
                  onVerticalChange={handleVerticalChange}
                />
                <GeoSelector
                  value={selectedGeos}
                  onGeoChange={handleGeoChange}
                />
                {topics.length === 0 && (
                  <Button variant="outlined" onClick={handleGenerate}>
                    Generate New Topics
                  </Button>
                )}
              </Box>
              {topics.length > 0 && !loading && (
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", md: "row" }}
                  gap={2}
                  marginBottom={2}
                >
                  <Filters
                    onSearch={handleSearch}
                    onGenerate={handleGenerate}
                  />
                  <ExportButtons topics={filteredTopics} />
                </Box>
              )}

              <TopicsTable
                topics={filteredTopics}
                onFeedback={handleFeedback}
              />
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
