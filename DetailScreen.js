import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

// Update this URL with your actual sheetdb.io API URL
const API_URL = "https://sheetdb.io/api/v1/rqf7dg6nls7b3";

const updateRowByAWB = async (awbNumber, updatedFields) => {

  console.log(typeof awbNumber);
  try {
    // Construct the URL with the AWB Number
    const url = `${API_URL}/id/${awbNumber}`;

    // Send a PATCH request to update the row
    const response = await axios.patch(
      url,
      {
        data: {
          NUMBER_OF_PACKAGES:updatedFields.NUMBER_OF_PACKAGES,
          IMAGE_LIST_OF_FORM: "null",
          IMAGE_COMPLETE_PRODUCTS_PICTURE:"null",
          IMAGE_FORM:"null",
          WEIGHTAPX:updatedFields.WEIGHTAPX
        },
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update the row");
    }

    console.log("Row updated successfully");
  } catch (error) {
    console.error("Error updating row:", error);
  }
};

function DetailScreen({ route }) {
  const { user } = route.params;
  const [numPackages, setNumPackages] = useState(1);
  const [productImage, setProductImage] = useState(null);
  const [weightImage, setWeightImage] = useState(null);
  const [additionalImage, setAdditionalImage] = useState(null);
  const [weight, setWeight] = useState(user.WEIGHTAPX || ""); // Initialize with user's weight

  const incrementPackages = () => setNumPackages(numPackages + 1);
  const decrementPackages = () =>
    setNumPackages(numPackages > 1 ? numPackages - 1 : 1);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const details = {
      WEIGHTAPX: weight,
      IMAGE_FORM: productImage,
      IMAGE_COMPLETE_PRODUCTS_PICTURE: weightImage,
      IMAGE_LIST_OF_FORM: additionalImage,
      NUMBER_OF_PACKAGES: numPackages,
    };

    await updateRowByAWB(user.AWB_NUMBER, details);
    // Optionally, reset the form or navigate back
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>AWB No:</Text>
        <Text style={styles.value}>{user.AWB_NUMBER}</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.NAME}</Text>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{user.ADDRESS}</Text>
        <Text style={styles.label}>Weight Apx:</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="Enter weight"
        />
        <Text style={styles.label}>Preferred Date&Time:</Text>
        <Text style={styles.value}>{user.PREFERRED_DATE_TIME}</Text>
        <View style={styles.packageContainer}>
          <Text style={styles.label}>Number of Packages:</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={decrementPackages}
              style={styles.counterButton}
            >
              <Text style={styles.counterText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.value}>{numPackages}</Text>
            <TouchableOpacity
              onPress={incrementPackages}
              style={styles.counterButton}
            >
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Product Image:</Text>
        <View style={styles.buttonWrapper}>
          <Button
            title="Upload Image"
            onPress={() => pickImage(setProductImage)}
            color="#6a1b9a" // Purple color for button
          />
        </View>
        {productImage && (
          <Image source={{ uri: productImage }} style={styles.image} />
        )}

        <Text style={styles.label}>Weight Image:</Text>
        <View style={styles.buttonWrapper}>
          <Button
            title="Upload Image"
            onPress={() => pickImage(setWeightImage)}
            color="#6a1b9a" // Purple color for button
          />
        </View>
        {weightImage && (
          <Image source={{ uri: weightImage }} style={styles.image} />
        )}

        <Text style={styles.label}>Additional Image:</Text>
        <View style={styles.buttonWrapper}>
          <Button
            title="Upload Image"
            onPress={() => pickImage(setAdditionalImage)}
            color="#6a1b9a" // Purple color for button
          />
        </View>
        {additionalImage && (
          <Image source={{ uri: additionalImage }} style={styles.image} />
        )}

        <View style={styles.buttonWrapper1}>
          <Button
            title="Submit"
            onPress={handleSubmit}
            color="#6a1b9a" // Purple color for button
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    overflow: "scroll",
    height: "100vh",
    backgroundColor: "#f0f2f5", // Light gray background
  },
  container: {
    padding: 20,
    backgroundColor: "#f0f2f5", // Light gray background
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000", // Black color for labels
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: "#000", // Black color for values
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1c4e9",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  packageContainer: {
    marginVertical: 20,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  counterButton: {
    backgroundColor: "#d1c4e9", // Light purple for counter buttons
    padding: 10,
    borderRadius: 5,
  },
  counterText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6a1b9a", // Purple color for counter text
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  buttonWrapper: {
    marginVertical: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  buttonWrapper1: {
    marginVertical: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 80,
  },
});

export default DetailScreen;
