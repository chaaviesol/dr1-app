import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../constants/Colors";
import { useRouter } from "expo-router";

import { useAuth } from "../context/AuthContext";

import useUserProfile from "../hooks/useUserProfile";
import Snackbar from "react-native-snackbar";
import PrimaryButton from "./PrimaryButton";
import Skeleton from "./ui/Skeleton";

const CustomerProfile = () => {
  const { authState, authLogout } = useAuth();
  const { userProfile, loading, setUserProfile } = useUserProfile(authState);
  const router = useRouter();

  const handleLogout = () => {
    authLogout();
    setUserProfile({});
    Snackbar.show({
      text: "You are logged out",
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <View style={styles.customerProfileCard}>
      <View style={styles.customerProfileCardContainer}>
        {/* User Info */}
        <View style={styles.customerProfileNameCard}>
          <View style={styles.customerProfileNameCardLeft}>
            <Image
              source={
                userProfile?.image
                  ? { uri: userProfile?.image } // For remote images
                  : require("../assets/images/newavatar.jpg") // For local fallback image
              }
              style={styles.profileImage}
            />

            <View style={styles.nameContainer}>
              <Text style={styles.name}>{userProfile?.name}</Text>
              {userProfile?.ageGroup && (
                <Text style={styles.ageGroup}>{userProfile?.ageGroup}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.customerProfileContactCard}>
          <View style={styles.textIconSet}>
            <Ionicons
              name="call"
              size={20}
              color={Colors.iconColor}
              style={{ margin: 0, padding: 0 }}
            />
            <Text style={styles.contactText}>+91 {userProfile?.phone_no}</Text>
          </View>
          <View style={styles.textIconSet}>
            <Ionicons
              name="mail"
              size={20}
              color={Colors.iconColor}
              style={{ margin: 0, padding: 0 }}
            />
            <Text style={styles.contactText}>{userProfile?.email}</Text>
          </View>

          <View style={styles.textIconSet}>
            <Ionicons name="location" size={20} color={Colors.iconColor} />
            <Text style={styles.contactText}>{userProfile?.pincode}</Text>
          </View>
          {/* 
          {userProfile?.gender && (
            <View style={styles.textIconSet}>
              <Ionicons name="location" size={20} color="black" />
              <Text style={styles.contactText}>{userProfile?.gender}</Text>
            </View>
          )} */}
        </View>

        {/* edit btn */}

        <View style={{ marginVertical: "5", width: "100%" }}>
          <PrimaryButton
            onPress={() => router.push("/screens/(authenticated)/editProfile")}
            title="Edit profile"
            rounded="lg"
            width="100%"
            height={45}
          />
        </View>
        {/* //two button */}
        <View style={styles.btnContainer}>
          <PrimaryButton
            onPress={() =>
              router.push(
                "/screens/(authenticated)/pharmacyscreens/orders/myorders"
              )
            }
            title="My orders"
            rounded="lg"
            width="45%"
            height={45}
            backgroundColor="#d6d8ff"
            textColor={Colors.primary}
          />
          <PrimaryButton
            onPress={() =>
              Alert.alert(
                "No Data",
                "Sorry, there is no data available at the moment."
              )
            }
            title="Second opinion"
            rounded="lg"
            width="45%"
            height={45}
            backgroundColor="#d6d8ff"
            textColor={Colors.primary}
          />
        </View>

        {/* Profile Menu */}
        <View style={styles.profileMenuItem}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "No Data",
                "Sorry, there is no data available at the moment."
              )
            }
          >
            <View style={styles.menuItem}>
              <View style={styles.flexCenter}>
                <View style={styles.iconBg}>
                  <Ionicons
                    name="call"
                    size={20}
                    color={Colors.primary}
                    style={{ margin: 0, padding: 0 }}
                  />
                </View>
                <Text style={styles.menuText}>My queries</Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.greyIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => router.push("/screens/(authenticated)/forgotPassword")}>
            <View style={styles.menuItem}>
              <View style={styles.flexCenter}>
                <View style={styles.iconBg}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={Colors.iconColor}
                    style={{ margin: 0, padding: 0 }}
                  />
                </View>

                <View>
                  <Text style={styles.menuText}>Change password</Text>
                  <Text style={styles.smallText}>Reset your password</Text>
                </View>
              </View>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.greyIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "No Data",
                "Sorry, there is no data available at the moment."
              )
            }
          >
            <View style={styles.menuItem}>
              <View style={styles.flexCenter}>
                <View style={styles.iconBg}>
                  <Ionicons
                    name="person-sharp"
                    size={20}
                    color={Colors.iconColor}
                    style={{ margin: 0, padding: 0 }}
                  />
                </View>
                <View>
                  <Text style={styles.menuText}>Help</Text>
                  <Text style={styles.smallText}>Dr1 helpline</Text>
                </View>
              </View>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.greyIcon}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20 }}></View>
        <PrimaryButton
          borderColor="red"
          onPress={handleLogout}
          title="Logout"
          rounded="lg"
          width="100%"
          height={45}
          backgroundColor="white"
          textColor="red"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customerProfileCard: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: Colors.whiteBackground,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: Colors.whiteBackground,
  },

  customerProfileCardContainer: {
    marginTop: 20,
  },
  customerProfileNameCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerProfileNameCardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    objectFit: "cover",
  },
  flexCenter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: {
    marginLeft: 20,
  },
  name: {
    fontWeight: "bold",
  },
  ageGroup: {
    color: "green",
    fontSize: 14,
    borderRadius: 50,
    marginTop: 4,
    fontWeight: "200",
    textAlign: "left",
  },
  customerProfileNameCardRight: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoBtn: {
    marginTop: 10,
    paddingVertical: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 50,
  },
  btnContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "5",
    width: "100%",
  },
  editProfileIcon: {
    backgroundColor: "#e4eaff",
    height: 30,
    width: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  customerProfileContactCard: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textIconSet: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  iconBg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    height: 50,
    width: 50,
    backgroundColor: Colors.backgroundTwo,
  },
  icon: {
    color: Colors.iconColor,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "300",
  },
  profileMenuItem: {
    paddingTop: 10,
  },
  orderIcons: {
    marginRight: 5,
    margin: 0,
    padding: 0,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "300",
  },
  smallText: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "300",
  },
  logoutItem: {
    marginTop: 10,
    color: "#C45050",
  },

  // skeletonstyles

  center: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  profileMenu: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    gap: 20,
  },
});
export default CustomerProfile;

const ProfileSkeleton = () => {
  return (
    <View style={{ flex: 1, paddingVertical: 15 }}>
      <View style={{ marginTop: 20 }}>
        {/* User Info Skeleton */}
        <View style={styles.center}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Skeleton height={60} width={60} borderRadius={30} theme="light" />
            <View style={{ marginLeft: 20 }}>
              <Skeleton height={10} width={105} borderRadius={5} />
              <View style={{ height: 10 }} />
              <Skeleton height={10} width={105} borderRadius={5} />
            </View>
          </View>
        </View>

        {/* Contact Info Skeleton */}
        <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
          <View style={styles.contactInfo}>
            <Skeleton height={10} width="60%" borderRadius={5} />
          </View>
          <View style={styles.contactInfo}>
            <Skeleton height={10} width="60%" borderRadius={5} />
          </View>
          <View style={styles.contactInfo}>
            <Skeleton height={10} width="60%" borderRadius={5} />
          </View>
        </View>

        {/* Edit Profile Button Skeleton */}
        <View style={{ marginVertical: 15, width: "100%" }}>
          <Skeleton height={45} width="100%" borderRadius={26} />
        </View>

        {/* Two buttons Skeleton */}
        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: "5",
            width: "100%",
          }}
        >
          <Skeleton height={45} width="45%" borderRadius={26} />
          <Skeleton height={45} width="45%" borderRadius={26} />
        </View>

        {/* Profile Menu Skeleton */}
        <View style={{ paddingTop: 10 }}>
          <View style={styles.profileMenu}>
            <Skeleton height={45} width={45} borderRadius={30} theme="light" />
            <Skeleton height={10} width="30%" borderRadius={5} />
          </View>
          <View style={styles.profileMenu}>
            <Skeleton height={45} width={45} borderRadius={30} theme="light" />
            <Skeleton height={10} width="30%" borderRadius={5} />
          </View>
          <View style={styles.profileMenu}>
            <Skeleton height={45} width={45} borderRadius={30} theme="light" />
            <Skeleton height={10} width="30%" borderRadius={5} />
          </View>
        </View>

        {/* Logout Button Skeleton */}
        <View style={{ marginTop: 40 }}>
          <Skeleton height={45} width="100%" borderRadius={26} />
        </View>
      </View>
    </View>
  );
};
