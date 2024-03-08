import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";

// Colors for the pie chart sections
const colors = ["#E53629", "#2CD23E", "#4149C3"];

// Dimensions of the device screen
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// Functional component for rendering the pie chart
const PieChartComponent = ({ data }) => (
  <PieChart
    data={data}
    width={windowWidth - 16}
    height={220}
    chartConfig={{
      backgroundColor: "#1cc910",
      backgroundGradientFrom: "#eff3ff",
      backgroundGradientTo: "#efefef",
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
    }}
    style={{
      marginVertical: 8,
      borderRadius: 16,
    }}
    accessor="population"
    backgroundColor="transparent"
    paddingLeft="15"
    absolute
  />
);

// Functional component for rendering the Categories screen
const CategoriesScreen = ({ navigation }) => {
  // State variables
  const [todoData, setTodoData] = useState([]);
  const [selected, setSelected] = useState("done");
  const [percentageList, setPercentageList] = useState([]);
  const [total, setTotal] = useState(null);

  // Function to update the count and data based on selected filter
  const changeCount = async () => {
    // Retrieve todos from AsyncStorage
    const todos = await AsyncStorage.getItem("todos");
    const parsedTodos = JSON.parse(todos) || [];

    // Filter todos based on completion status
    const completed = parsedTodos.filter((todo) => todo.completed === true);
    const notCompleted = parsedTodos.filter((todo) => todo.completed === false);

    // Calculate counts based on selected filter
    let totalData;
    if (selected === "done") {
      // Count completed todos
      const todoCount = completed?.reduce((acc, todo) => {
        acc[todo.option] = (acc[todo.option] || 0) + 1;
        return acc;
      }, {});
      // Prepare data for pie chart
      totalData = Object.entries(todoCount).map(([option, count]) => ({
        population: count,
        name: option,
      }));
    } else {
      // Count pending todos
      const todoCount = notCompleted?.reduce((acc, todo) => {
        acc[todo.option] = (acc[todo.option] || 0) + 1;
        return acc;
      }, {});
      // Prepare data for pie chart
      totalData = Object.entries(todoCount).map(([option, count]) => ({
        population: count,
        name: option,
      }));
    }

    // Sort data based on category order
    const sortedData = totalData.sort((a, b) => {
      const order = { work: 1, private: 2, other: 3 };
      return order[a.name] - order[b.name];
    });

    // Calculate total count
    setTotal(sortedData?.reduce((acc, prev) => prev.population + acc, 0));
    // Update percentage list
    setPercentageList(sortedData);

    // Assign colors to pie chart sections
    const pieChartData = sortedData.map((item) => {
      if (item.name === "work") {
        return { ...item, color: colors[0] };
      } else if (item.name === "private") {
        return { ...item, color: colors[1] };
      } else if (item.name === "other") {
        return { ...item, color: colors[2] };
      }
    });

    // Update pie chart data
    setTodoData(pieChartData);
  };

  // Effect hook to trigger count update on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      changeCount();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Render pie chart if data available */}
      {todoData && todoData.length > 0 ? (
        <View>
          {/* Render pie chart component */}
          <PieChartComponent
            data={todoData}
            style={{ marginBottom: windowHeight * 0.04 }}
          />

          {/* Dropdown for selecting filter */}
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setSelected(value);
                  changeCount();
                }}
                items={[
                  { label: "Done", value: "done" },
                  { label: "Pending", value: "pending" },
                ]}
                value={selected}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          {/* Render percentage list */}
          <View>
            {percentageList.map((item) => (
              <View key={item.name} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemText}>
                  {((item.population / total) * 100).toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        // Render message if no data available
        <Text>No data available</Text>
      )}
    </View>
  );
};

// Stylesheet for CategoriesScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edf1ff",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    paddingHorizontal: windowWidth * 0.05,
    paddingVertical: windowHeight * 0.015,
    marginVertical: windowHeight * 0.01,
    marginHorizontal: windowWidth * 0.05,
    borderRadius: windowWidth * 0.03,
    backgroundColor: "white",
    elevation: 10,
    borderWidth: 1,
    borderColor: "black",
    overflow: "hidden",
  },
  itemText: {
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: windowWidth * 0.03,
    elevation: 10,
    borderWidth: 1,
    borderColor: "black",
    overflow: "hidden",
    marginVertical: windowHeight * 0.04,
    marginHorizontal: windowWidth * 0.05,
  },
});

// Stylesheet for RNPickerSelect component
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingVertical: windowHeight * 0.015,
    paddingHorizontal: windowWidth * 0.04,
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
    paddingHorizontal: windowWidth * 0.2,
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

export default CategoriesScreen;
