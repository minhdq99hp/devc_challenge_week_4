import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, List, ImageBackground, TextInput, Alert } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { render } from 'react-dom';

const backgroundImage = require("./assets/wallpaper.jpg");

const todos_data = [
  {
    id: 0,
    status: 0,
    content: "Do RN assignment"
  },
  {
    id: 1,
    status: 1,
    content: "Do Compiler assignment"
  },
  {
    id: 2,
    status: 1,
    content: "Apply new theme"
  },
  {
    id: 3,
    status: 0,
    content: "Fix bug in backend"
  },
  {
    id: 4,
    status: 0,
    content: "Hit the gym"
  },
  {
    id: 5,
    status: 1,
    content: "3km run"
  },
  {
    id: 6,
    status: 0,
    content: "Learn Forex"
  },
  {
    id: 7,
    status: 1,
    content: "3km run"
  },
  {
    id: 8,
    status: 0,
    content: "Learn Forex"
  },
];

const routeIcons = {
  Completed: "checkcircleo",
  Todos: "home",
  Active: "bars",
}

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const ScreenTitle = ({ title }) => {
  return (
    <Text style={styles.screenTitle}>{title}</Text>
  )
}

const CheckButton = ({ status, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkButton}>
      { status ? <FontAwesome5 name="check-square" size={24} color="black"/> : <FontAwesome name="square-o" size={26} color="black"/>}
    </TouchableOpacity>
  );
};

class TaskItem extends React.Component {
  constructor(props){
    super();

    this.state = {
      status: props.item.status,
    }
  }

  toggleStatus = (item) => {
    item.status = item.status ? 0 : 1;
    this.setState({status: item.status});
  };

  askForDelete = () => {
    Alert.alert(
      'Select Action',
      'What can I do for you ?',
      [
        {
          text: "View Detail",
          onPress: () => this.props.navigation.push('Detail', {item: this.props.item, index: this.props.index})
        },
        {
          text: "Delete",
          onPress: () => this.props.deleteTaskByIndex(this.props.index),
          style: 'destructive'
        },
        {
          text: "Cancel",
          style: 'cancel'
        }
      ],
      { cancelable: true }
    )
  }

  render(){
    return (
      <View style={[styles.todoTaskContainer, (this.props.item.status) ? { backgroundColor: "rgba(89, 246, 148, 0.8)" } : { backgroundColor: "rgba(255, 255, 255, 0.8)"}]}>
        <CheckButton status={this.state.status} onPress={() => this.toggleStatus(this.props.item)}/>
        <TouchableOpacity onPress={() => {this.props.navigation.push('Detail', {item: this.props.item, index: this.props.index})}} onLongPress={() => {this.askForDelete()}}
          style={{flex: 1, paddingBottom: 20, paddingRight: 20, paddingTop: 20, width: 240}}
        >
          <Text style={[styles.todoTaskText, (this.state.status) ? {textDecorationLine: "line-through"} : {}]}>{this.props.index+1}. {this.props.item.content}</Text>
        </TouchableOpacity>
        
       </View>
    );
  }
};

class AddTaskButton extends React.Component{
  constructor(props){
    super();

    this.state = {
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      value: ""
    };
  }

  onFocus(){
    this.setState({
      backgroundColor: "rgba(255, 255, 255, 0.8)"
    });
  };

  onBlur(){
    this.setState({
      backgroundColor: "rgba(255, 255, 255, 0.4)"
    });
  }

  onSubmitEditing(){
    let newItem = {
      'id': Date.now(),
      'status': 0,
      'content': this.state.value
    }
    this.props.addNewTask(newItem);
    
    this.setState({value: ''});
  }

  render(){
    return (
      <TextInput 
        style={[styles.addTasktextInput, {backgroundColor: this.state.backgroundColor}]} placeholder="Add new task..." placeholderTextColor="black" clearButtonMode="always"
        onBlur={() => this.onBlur()}
        onFocus={() => this.onFocus()}
        onSubmitEditing={() => this.onSubmitEditing()}
        value={this.state.value}
        onChangeText={newValue=>this.setState({value: newValue})}
          
      ></TextInput>
    );
  }
};

const DetailScreen = ({ route, navigation }) => {
  const { item, index } = route.params;

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 24, width: "100%", textAlign: "center"}}>{index+1}. {item.status ? "Completed" : "Active"}</Text>
      <Text style={{fontSize: 20, width: "100%", textAlign: "center"}}>{item.content}</Text>
    </View>
  )
}

class TodosScreen extends React.Component{
  constructor(props){
    super();

    this.state = {
      todos: todos_data
    };

    
  }

  addNewTask(item){
    let newTodos = this.state.todos;
    newTodos.push(item);
    this.setState({todos: newTodos});
  }

  deleteTaskByIndex(index){
    let newTodos = this.state.todos
    newTodos.splice(index, 1);
    this.setState(prevState => ({todos: newTodos}));
  }

  render(){
    return (
      <View style={styles.container}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScreenTitle title="Todolist"/>
        <ScrollView contentContainerStyle={{alignItems: "center", width: "100%"}}>
          <View style={styles.taskList}>
            {this.state.todos.map((item, index) => <TaskItem item={item} key={index} index={index} navigation={this.props.navigation} style={styles.TaskItem} deleteTaskByIndex={this.deleteTaskByIndex.bind(this)}></TaskItem>)}
          </View>
          <AddTaskButton style={styles.addTasktextInput} addNewTask={this.addNewTask.bind(this)}/>
          
          <View style={{height: 2, backgroundColor: "grey", width: 300, marginBottom: 800}}></View>
        </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

class CompletedTodosScreen extends React.Component{
  constructor(props){
    super();

    this.state = {
      todos: todos_data
    };

    
  }

  addNewTask(item){
    let newTodos = this.state.todos;
    newTodos.push(item);
    this.setState({todos: newTodos});
  }

  deleteTaskByIndex(index){
    let newTodos = this.state.todos
    newTodos.splice(index, 1);
    this.setState(prevState => ({todos: newTodos}));
  }

  render(){
    return (
      <View style={styles.container}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScreenTitle title="Completed Tasks"/>
        <ScrollView contentContainerStyle={{alignItems: "center", width: "100%"}}>
        <View style={styles.taskList}>
            {this.state.todos.map((item, index) => {
            if(item.status == 0) return;
            return <TaskItem item={item} key={index} index={index} navigation={this.props.navigation} style={styles.TaskItem} deleteTaskByIndex={this.deleteTaskByIndex.bind(this)}></TaskItem>
            
            })}
          </View>
        </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

class ActiveTodosScreen extends React.Component{
  constructor(props){
    super();

    this.state = {
      todos: todos_data
    };

    
  }

  addNewTask(item){
    let newTodos = this.state.todos;
    newTodos.push(item);
    this.setState({todos: newTodos});
  }

  deleteTaskByIndex(index){
    let newTodos = this.state.todos
    newTodos.splice(index, 1);
    this.setState(prevState => ({todos: newTodos}));
  }

  render(){
    return (
      <View style={styles.container}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScreenTitle title="Active Tasks"/>
        <ScrollView contentContainerStyle={{alignItems: "center", width: "100%"}}>
          <View style={styles.taskList}>
            {this.state.todos.map((item, index) => {
            if(item.status == 1) return;
            return <TaskItem item={item} key={index} index={index} navigation={this.props.navigation} style={styles.TaskItem} deleteTaskByIndex={this.deleteTaskByIndex.bind(this)}></TaskItem>
            
            })}
          </View>
        </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const TodosStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Todos">
      <Stack.Screen name="Todos" component={TodosScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
};

const CompletedTodosStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="CompletedTodos">
      <Stack.Screen name="CompletedTodos" component={CompletedTodosScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
};

const ActiveTodosStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="ActiveTodos">
      <Stack.Screen name="ActiveTodos" component={ActiveTodosScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
};


export default class App extends React.Component {
  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Todos"
          screenOption={({ route }) => ({
            tabBarIcon: ({ focused }) => (
              <AntDesign
                name={routeIcons[route.name]}
                size={24}
                color={focused ? "blue" : "grey"}
              />
            ),
          })}
          tabBarOptions={{
            activateTintColor: "blue",
            inactiveTintColor: "grey",
            labelStyle: {
              width: "100%"
            }
          }}
        >
          <Tab.Screen name="Completed" component={CompletedTodosStackScreen}/>
          <Tab.Screen name="Todos" component={TodosStackScreen}/>
          <Tab.Screen name="Active" component={ActiveTodosStackScreen}/>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: "100%",
  },
  screenTitle: {
    fontSize: 24,
    textAlign: "center",
    paddingTop: 40,
    paddingBottom: 20,
    width: "100%",
  },
  taskList: {
    paddingRight: 40,
    paddingLeft: 40,
  },
  todoTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    margin: 5,
    borderRadius: 5,
    width: 300
  },
  todoTaskText: {
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
    alignItems: "center",
  },
  addTasktextInput: {
    height: 40,
    width: 300,
    paddingLeft: 20,
    marginTop: 15,
  },
  checkButton:{
    paddingLeft: 20,
    paddingRight: 5,
  }
});
