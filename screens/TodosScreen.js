// Importing necessary modules
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import Checkbox from "expo-checkbox";

// Getting window dimensions
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Main component for TodosScreen
const TodosScreen = () => {
  // State variables initialization
  const [todos, setTodos] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [selectedOption, setSelectedOption] = useState("work");
  const [completed, setCompleted] = useState(false);

  // Loading todos from AsyncStorage on component mount
  useEffect(() => {
    (async function () {
      const getTodos = await AsyncStorage.getItem("todos");
      const parsedTodos = JSON.parse(getTodos) || [];
      setTodos(parsedTodos);
    })();
  }, []);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Function to handle addition of a new todo
  const handleAddTodo = async () => {
    try {
      if (!newTodo.trim()) {
        // Alert or feedback for empty todo
        return;
      }

      // Creating new todo object
      const todo = {
        content: newTodo,
        option: selectedOption,
        completed: false,
      };

      // Updating todos state
      setTodos([...todos, todo]);

      // Saving todos to AsyncStorage
      await AsyncStorage.setItem("todos", JSON.stringify([...todos, todo]));

      // Resetting states
      setNewTodo("");
      setSelectedOption("work");
      setCompleted(false);
      toggleModal();
    } catch (error) {
      console.error("Error saving todo to AsyncStorage:", error);
    }
  };

  // Function to toggle todo completion state
  const handleCheckboxToggle = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;

    setTodos(updatedTodos);

    // Saving updated todos to AsyncStorage
    AsyncStorage.setItem("todos", JSON.stringify(updatedTodos)).catch(
      (error) => {
        console.error("Error saving updated todos to AsyncStorage:", error);
      }
    );
  };

  // Function to render individual todo item
  const renderItem = ({ item, index }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: windowHeight * 0.02,
        marginHorizontal: windowWidth * 0.05,
        paddingVertical: windowHeight * 0.02,
        paddingHorizontal: windowWidth * 0.03,
        backgroundColor: item.completed ? "#929292" : "#FFF",
        borderRadius: windowWidth * 0.04,
        borderWidth: 1,
        borderColor: "black",
        height: windowHeight * 0.07,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: windowWidth * 0.01,
      }}
    >
      <Checkbox
        value={item.completed}
        onValueChange={() => handleCheckboxToggle(index)}
        color={item.completed ? "#98d86b" : "black"}
        style={{
          borderColor: "black",
          borderRadius: windowWidth * 0.01,
        }}
      />
      <Text style={{ marginHorizontal: windowWidth * 0.03 }}>
        {item.content}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#edf1ff", overflow: "hidden" }}>
      <Text style={styles.textStyle}>Todo</Text>

      {/* FlatList to render todos */}
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{ paddingHorizontal: windowWidth * 0.02, ...styles.shadow }}
      />

      {/* Button to add new todo */}
      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Text style={{ fontSize: windowWidth * 0.08, color: "#616161" }}>
          +
        </Text>
      </TouchableOpacity>

      {/* Modal for adding new todo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text
              style={{
                color: "black",
                fontSize: windowWidth * 0.048,
                fontWeight: "bold",
              }}
            >
              X
            </Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Enter Todo Content"
            value={newTodo}
            onChangeText={(text) => setNewTodo(text)}
            style={{ ...styles.input, marginVertical: windowHeight * 0.04 }}
          />
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "black",
              overflow: "hidden",
            }}
          >
            <RNPickerSelect
              onValueChange={(value) => setSelectedOption(value)}
              items={[
                { label: "Work", value: "work" },
                { label: "Private", value: "private" },
                { label: "Other", value: "other" },
              ]}
              value={selectedOption}
              style={pickerSelectStyles}
            />
          </View>

          {/* Button to submit new todo */}
          <TouchableOpacity
            title="Submit"
            style={styles.Submit}
            onPress={handleAddTodo}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: windowWidth * 0.08,
                color: "#616161",
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// Styles for components
const styles = StyleSheet.create({
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#98d86b",
    padding: windowWidth * 0.03,
    margin: windowWidth * 0.05,
    borderRadius: windowWidth * 0.03,
    elevation: 5,
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "rgba(0, 0, 0, 0.75)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: windowWidth * 0.012,
  },
  textStyle: {
    marginHorizontal: windowWidth * 0.07,
    marginVertical: windowHeight * 0.02,
    fontSize: windowWidth * 0.12,
    fontWeight: "bold",
    textShadowColor: "rgba(178,181,191,255)",
    textShadowOffset: {
      width: windowWidth * 0.01,
      height: windowWidth * 0.01,
    },
    textShadowRadius: windowWidth * 0.02,
    marginTop: windowHeight * 0.05,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edf1ff",
    padding: windowWidth * 0.05,
    borderTopLeftRadius: windowWidth * 0.05,
    borderTopRightRadius: windowWidth * 0.05,
    borderbottomletRadius: windowWidth * 0.05,
    borderTopRightRadius: windowWidth * 0.05,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: windowWidth * 0.012,
  },
  Submit: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#98d86b",
    padding: windowWidth * 0.02,
    paddingHorizontal: windowWidth * 0.2,
    margin: windowWidth * 0.05,
    marginVertical: windowHeight * 0.04,
    borderRadius: windowWidth * 0.07,
    elevation: 5,
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "rgba(0, 0, 0, 0.75)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: windowWidth * 0.012,
  },
  input: {
    marginVertical: windowHeight * 0.01,
    borderBottomWidth: 1,
    padding: windowWidth * 0.02,
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: windowHeight * 0.03,
    right: windowWidth * 0.03,
    backgroundColor: "transparent",
    padding: windowWidth * 0.025,
    borderRadius: windowWidth * 0.9,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
});

// Styles for picker select
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingVertical: windowHeight * 0.015,
    paddingHorizontal: windowWidth * 0.03,
    backgroundColor: "#FFF",
    borderRadius: windowWidth * 0.04,
    borderWidth: 1,
    borderColor: "black",
    height: windowHeight * 0.07,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: windowWidth * 0.01,
  },
  inputAndroid: {
    paddingVertical: windowHeight * 0.015,
    paddingHorizontal: windowWidth * 0.4,
    backgroundColor: "#FFF",
    borderRadius: windowWidth * 0.04,
    borderWidth: 1,
    borderColor: "black",
    height: windowHeight * 0.07,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: windowWidth * 0.01,
  },
});

export default TodosScreen;
