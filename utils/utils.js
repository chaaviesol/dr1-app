import { Dimensions } from "react-native";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const convertDateToDDMMYYYY = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const triggerHapticFeedback = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Trigger medium haptic feedback
};

export { convertDateToDDMMYYYY, width,triggerHapticFeedback };
