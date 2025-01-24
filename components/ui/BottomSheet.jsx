import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Keyboard,
} from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { debounce } from "lodash";
import { BASE_URL } from "../../config";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Colors } from "../../constants/Colors";

const vad = async (searchTerm) => {
  try {
    const response = await axios.post(`${BASE_URL}/googlemap/searchlocation`, {
      query: searchTerm,
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching places:", error);
  }
};

// Forward the ref to the BottomSheet
const Sheet = React.forwardRef((props, ref) => {
  const { getCords } = props;
  const snapPoints = useMemo(() => ["60%", "60%", "80%"], []);

  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const inputRef = useRef(null);

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

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

  // useEffect(() => {
  //   // Focus the TextInput when the component is mounted
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, []);

  const handleChangeText = (value) => {
    setInputValue(value);
    if (value.length > 2) {
      debouncedSearch(value); // Trigger debounced search for API call
    } else {
      setSuggestions([]); // Clear suggestions if the input is too short
    }
  };

  // Clear search inputs
  const clearSearchInput = () => {
    setInputValue("");
    setSearchTerm("");
    setSuggestions([]);
  };

  const fetchPlaceDetails = async (placeId, placeName) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/googlemap/fetchplacedata`,
        { placeId }
      );
      //get cords and pass name to state
      getCords(response.data.lat, response.data.lng, placeName);
    } catch (error) {
      console.error("Error fetching place details:", error);
      throw error;
    }
  };

  // Close the BottomSheet
  const closeSheet = () => {
    Keyboard.dismiss(); // Dismiss the keyboard first
    setTimeout(() => {
      ref.current?.close(); // Close the BottomSheet after a short delay
    }, 200);
  };
  const handleSheetChange = (index) => {
    // Refocus the input field when the sheet is expanded
    if (index === 0 && inputRef.current) {
      // when sheet is expanded (snapPoint 0)
      inputRef.current.focus(); // Focus the input with a small delay
    }
  };

  return (
    <BottomSheetModal
      ref={ref} // Pass the ref to BottomSheet here
      index={0} // Default snap point (you can change it dynamically)
      snapPoints={snapPoints}
      backdropComponent={BottomSheetBackdrop}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      handleIndicatorStyle={{ opacity: 0 }}
      onChange={handleSheetChange}

      // backgroundStyle={{ backgroundColor: "grey" }}
      // handleIndicatorStyle={{ backgroundColor: "white" }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.modalContent}>
          <View
            style={{
              height: 50,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Text style={{ fontWeight: 500, fontSize: 18 }}>
              Find Nearest Landmark
            </Text>
            <AntDesign
              name="close"
              size={24}
              color={Colors.greyIcon}
              onPress={closeSheet}
              style={styles.closeButton}
            />
          </View>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: "50%",
                left: 15,
                transform: [{ translateY: -10 }],
                zIndex: 1,
              }}
            >
              <Ionicons name="search" size={20} color={Colors.greyIcon} />
            </TouchableOpacity>
            <BottomSheetTextInput
              ref={inputRef}
              style={styles.searchInput}
              onChangeText={handleChangeText}
              placeholder="Search for area, street name.."
              maxLength={40}
              defaultValue={inputValue}
            />
            {inputValue && (
              <TouchableOpacity
                onPress={clearSearchInput}
                style={styles.clearIconContainer}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={Colors.greyIcon}
                />
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
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={suggestions}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() =>
                    fetchPlaceDetails(item.place_id, item?.description)
                  }
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
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    // borderTopColor:"black",
    // borderRadius:15,
    // borderWidth:StyleSheet.hairlineWidth
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 24,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    zIndex: 1, // Ensure the button is above other content
  },
  searchContainer: {
    position: "relative",
    marginVertical: 10,
  },
  searchInput: {
    height: 45,
    paddingLeft: 48,
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
    color: Colors.greyIcon,
    zIndex: 1,
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
});

export default Sheet;
