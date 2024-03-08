import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import TouchableScale from "react-native-touchable-scale";
import { Image } from "react-native";
import TodosScreen from "../screens/TodosScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Import your custom tab bar icons
import todosIcon from "../assets/list.png";
import categoriesIcon from "../assets/hexagon.png";
import profileIcon from "../assets/user.png";

const MainNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconSource;

            if (route.name === "Todos") {
              iconSource = focused ? todosIcon : todosIcon;
            } else if (route.name === "Categories") {
              iconSource = focused ? categoriesIcon : categoriesIcon;
            } else if (route.name === "Profile") {
              iconSource = focused ? profileIcon : profileIcon;
            }

            // Render the custom image as tab bar icon
            return (
              <Image
                source={iconSource}
                style={{ width: size, height: size, tintColor: color }}
              />
            );
          },
          tabBarButton: (props) => (
            <TouchableScale
              activeScale={2}
              tension={50}
              friction={7}
              {...props}
            />
          ),
          tabBarStyle: { backgroundColor: "black" },
        })}
        tabBarOptions={{
          activeTintColor: "#98d86b",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen

          name="Todos"
          component={TodosScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
