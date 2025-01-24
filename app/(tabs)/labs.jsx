import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useRef } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import HealthConcernItem from "../../components/lab/HealthConcernItem";
import { Colors } from "../../constants/Colors";
import BookTestItem from "../../components/lab/BookTestItem";
import TestPackage from "../../components/lab/TestPackage";
import { router, useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchLabTests, fetchPackages } from "../../api/labApis";
import LabCard from "../../components/lab/LabCard";
import { useAuth } from "../../context/AuthContext";
import Skeleton from "../../components/ui/Skeleton";

// Image mapping object
const images = {
  flask: require("../../assets/images/flask.png"),
  "medical-report": require("../../assets/images/medical-report.png"),
  "x-ray": require("../../assets/images/x-ray.png"),
};

const TopHeadings = ({ image, heading }) => {
  return (
    <View style={styles.labcategoryItem}>
      <Image source={images[image]} style={styles.labcategoryImage} />
      <Text style={styles.labcategoryText}>{heading}</Text>
    </View>
  );
};

export default function Labs() {
  const scrollViewRef = useRef(null); //both ref for scrolling to initial position when screen focused
  const flatListRef = useRef(null);
  const { authState } = useAuth();
  const {
    data: labTests,
    isFetching: isTestsFetching,
    isLoading: isTestsLoading,
    refetch: refetchTests,
  } = useQuery({
    queryKey: ["labtestsmin"],
    queryFn: () => fetchLabTests(true, authState.token),
  });
  const {
    data: packages,
    isFetching: packagesFeching,
    isLoading: isPackagesLoading,
    refetch: refetchPackages,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: () => fetchPackages(true, authState.token),
  });

  useFocusEffect(
    useCallback(() => {
      refetchTests();
      refetchPackages();
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    }, [])
  );

  // this component is rendered for package flatlist
  const renderPackages = ({ item }) => (
    <View style={styles.packageWrapper}>
      <TestPackage
        id={item?.id}
        title={item.package_name}
        description={item.about}
        labTests={item.testslength}
        price={item.price}
        test_number={item.test_number}
        isHomeCollection={item.home_collection}
        incart={item?.incart || false}
      />
    </View>
  );
  const Separator = () => <View style={styles.separator} />;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.labcategory}>
          <TopHeadings image="flask" heading="Book Lab Tests" />
          <TopHeadings image="medical-report" heading="Popular Health Checks" />
          <TopHeadings image="x-ray" heading="X-Ray, Scan & MRI" />
        </View>

        {/* Health concern tests section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTop}>
            <Text style={styles.sectionHeading}>Health Concern Tests</Text>
            <PrimaryButton
              title="View more"
              rounded="sm"
              backgroundColor={Colors.buttonGreen}
            />
          </View>
          <View style={styles.healthConcernList}>
            <HealthConcernItem category="Diabetes" imageSource={images.flask} />
            <HealthConcernItem category="Diabetes" imageSource={images.flask} />
            <HealthConcernItem category="Diabetes" imageSource={images.flask} />
            <HealthConcernItem category="Diabetes" imageSource={images.flask} />
            <HealthConcernItem category="Diabetes" imageSource={images.flask} />
            <HealthConcernItem category="Diabetes" imageSource={images.flask} />
          </View>
        </View>

        {/* Book test section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTop}>
            <Text style={styles.sectionHeading}>Book Popular Tests</Text>
            <PrimaryButton
              onPress={() => router.push("/screens/lab/allLabTests")}
              title="View more"
              rounded="sm"
              backgroundColor={Colors.buttonGreen}
            />
          </View>
          <View style={styles.testList}>
            {isTestsLoading ? (
              <PopularTestsSkeleton />
            ) : (
              // If data is loaded, map through and display the tests,guys if somany data iss showing better to use Flatlist
              labTests?.length > 0 &&
              labTests.map((test) => (
                <BookTestItem
                  key={test.id}
                  id={test?.id}
                  name={test?.name}
                  price={test?.mrp}
                  test_number={test?.test_number}
                  incart={test?.incart || false}
                />
              ))
            )}
          </View>
        </View>
        {/* Popular Packages */}
        <View
          style={[
            styles.sectionContainer,
            {
              paddingHorizontal: 0,
            },
          ]}
        >
          <View
            style={[
              styles.sectionTop,
              {
                paddingHorizontal: 15,
              },
            ]}
          >
            <Text style={styles.sectionHeading}>Popular Packages</Text>
            <PrimaryButton
              onPress={() => router.push("/screens/lab/allPackages")}
              title="View more"
              rounded="sm"
              backgroundColor={Colors.buttonGreen}
            />
          </View>
          <View style={styles.packageScroll}>
            {isPackagesLoading ? (
              <FlatList
                ref={flatListRef}
                data={[1, 2]}
                renderItem={() => (
                  <View style={styles.packageWrapper}>
                    <PopularPackageSkeleton />
                  </View>
                )}
                keyExtractor={(item) => item.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={Separator}
              />
            ) : (
              <FlatList
                ref={flatListRef}
                data={packages}
                renderItem={renderPackages}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={Separator}
              />
            )}
          </View>
        </View>

        {/* Top labs Near you */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTop}>
            <Text style={styles.sectionHeading}>Top Labs Near You</Text>
            <PrimaryButton
              title="View more"
              rounded="sm"
              backgroundColor={Colors.buttonGreen}
            />
          </View>
          <View style={styles.testList}>
            <LabCard />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },

  labcategory: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  labcategoryItem: {
    paddingVertical:5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    width: "33%", // Approximation for 3 equal columns
    aspectRatio: 1, // Keep the aspect ratio of 1:1
  },
  labcategoryImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: "contain",
  },
  labcategoryText: {
    width: "80%",
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    height: 32,
    fontWeight: 600,
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
  },

  sectionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "500",
  },
  healthConcernList: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  testList: {
    marginTop: 20,
  },
  separator: {
    width: 20, // gap between items
    backgroundColor: "transparent",
  },
  packageWrapper: {
    marginVertical: 20,
    marginHorizontal: 10,
    maxWidth: 310,
    minWidth: 310,
  },
});

export const PopularTestsSkeleton = () => {
  return (
    <>
      {[1, 2].map((i) => (
        <View
          key={i}
          style={{
            height: 70,
            borderWidth: 0.6,
            borderColor: "rgba(0, 0, 0, 0.08)",
            borderRadius: 20,
            justifyContent: "space-between",
            paddingLeft: 12,
            marginVertical: 8,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{ width: "50%", display: "flex", alignItems: "flex-start" }}
          >
            <Skeleton height={10} width="60%" borderRadius={20} />
            <View style={{ height: 10 }} />
            <Skeleton height={10} width="25%" borderRadius={20} />
          </View>
          <View
            style={{
              width: "50%",
              display: "flex",
              alignItems: "flex-end",
              paddingRight: 20,
            }}
          >
            <Skeleton height={15} width="28%" borderRadius={20} />
          </View>
        </View>
      ))}
    </>
  );
};
export const PopularPackageSkeleton = () => {
  return (
    <View
      style={{
        padding: 14,
        borderWidth: 0.1,
        borderRadius: 16,
        height: 210,
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <View>
        <Skeleton width="60%" height={8} borderRadius={8} />
        <View style={{ height: 15 }} />
        <Skeleton
          width="90%"
          height={8}
          borderRadius={8}
          style={{ marginTop: 8 }}
        />
        <View style={{ height: 10 }} />
        <Skeleton
          width="90%"
          height={8}
          borderRadius={8}
          style={{ marginTop: 8 }}
        />
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
      >
        <View style={{ marginLeft: 12 }}>
          <Skeleton width="60%" height={20} borderRadius={8} />
        </View>
        <View style={{ marginLeft: 12 }}>
          <Skeleton width="60%" height={10} borderRadius={8} />
        </View>
      </View>

      <View
        style={{
          flexDirection: "column",
          marginTop: 5,
          gap: 10,
        }}
      >
        <Skeleton width={60} height={10} borderRadius={8} />
      </View>

      <Skeleton width={60} height={10} borderRadius={8} />
    </View>
  );
};
