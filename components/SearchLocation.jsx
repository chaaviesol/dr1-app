import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { useLocationContext } from "../../../../../contexts/LocationContext"; // Assuming you're still using this context
import axios from "axios";
import { debounce } from "lodash";
import { BASE_URL } from "../config";

const vad = async (searchTerm) => {
  try {
    const response = await axios.post(`${BASE_URL}/googlemap/searchlocation`, {
      query: searchTerm,
    });
    console.log(response);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching places:", error);
  }
};

function SearchLocationModal({ isOpen, setOpen,getCords }) {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  //   const { getCurrentLocation, fetchingLocationPending } = useLocationContext();

  const close = () => {
    setOpen(false);
    clearSearchInput();
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  useEffect(() => {
    if (searchTerm?.length > 2) {
      setIsLoading(true);
      setFetchError(null); // Reset error state before making the request
      vad(searchTerm)
        .then((data) => {
          setSuggestions(data.data);
        })
        .catch((error) => {
          setFetchError("Failed to fetch suggestions. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSuggestions([]); // Reset suggestions when search term is less than 3 characters
    }
  }, [searchTerm]);

  const handleSearchLocation = (event) => {
    const value = event.nativeEvent.text;
    setInputValue(value);
    if (value?.length < 3) {
      if (suggestions?.length > 0) setSuggestions([]);
    } else {
      debouncedSearch(value);
    }
  };

  // Clear search inputs
  const clearSearchInput = () => {
    setSearchTerm("");
    setInputValue("");
    setSuggestions([]);
  };

  const fetchPlaceDetails = async (placeId,placeName) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/googlemap/fetchplacedata`,
        {placeId}
      );
      //get cords and pass name to state
      getCords(response.data.lat,response.data.lng,placeName)
      
    //   const placeDetails = response.data.result;

    //   const lat = placeDetails.geometry.location.lat;
    //   const lng = placeDetails.geometry.location.lng;

    //   return { lat, lng };
    } catch (error) {
      console.error("Error fetching place details:", error);
      throw error;
    }
  };

  return (
    <Modal
      visible={isOpen}
      onRequestClose={close}
      transparent
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              onChange={handleSearchLocation}
              placeholder="Search Location"
              maxLength={40}
              value={inputValue}
            />
            {inputValue && (
              <TouchableOpacity
                onPress={clearSearchInput}
                style={styles.clearIconContainer}
              >
                <Ionicons name="close" size={20} style={styles.clearIcon} />
              </TouchableOpacity>
            )}
          </View>

          {/* Suggestions */}
          {inputValue.length > 2 && isLoading && (
            <ActivityIndicator size="small" color="#0000ff" />
          )}

          {fetchError && <Text style={styles.errorText}>{fetchError}</Text>}

          {inputValue.length > 2 && suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={()=>fetchPlaceDetails(item.place_id,item?.description)}
                >
                  <Ionicons
                    name="location"
                    size={20}
                    style={styles.suggestionIcon}
                  />
                  <Text style={styles.suggestionText} numberOfLines={1}>
                    {item?.description}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              style={styles.suggestionsContainer}
            />
          )}

          {/* Current Location Button */}
          {!inputValue && <View></View>}
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
  },
  searchContainer: {
    position: "relative",
    marginBottom: 20,
  },
  searchInput: {
    height: 45,
    paddingLeft: 42,
    paddingRight: 15,
    backgroundColor: "#eef1ff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
    fontWeight: "400",
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    left: 15,
    transform: [{ translateY: -10 }],
    color: "#8c8c8c",
  },
  clearIconContainer: {
    position: "absolute",
    top: "50%",
    right: 15,
    transform: [{ translateY: -10 }],
  },
  clearIcon: {
    color: "#8c8c8c",
  },
  suggestionsContainer: {
    maxHeight: 200,
    paddingHorizontal: 10,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  suggestionIcon: {
    color: "#8c8c8c",
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#3a65fd",
    borderRadius: 30,
    marginBottom: 20,
  },
  locationIcon: {
    marginLeft: 10,
    color: "white",
  },
  blinking: {
    animation: "blinking 1s infinite",
  },
  locationButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  recentLocationsContainer: {
    marginTop: 20,
  },
  recentLocationsHeader: {
    color: "#8c8c8c",
    fontSize: 16,
    marginBottom: 10,
  },
  recentLocationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  recentLocationIcon: {
    color: "#8c8c8c",
  },
  recentLocationText: {
    marginLeft: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
};

export default SearchLocationModal;
