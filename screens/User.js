import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, ScrollView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import assessmentUsers from "../data/assessmentUsers.json";
import Form from '../component/Form';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUsers = await AsyncStorage.getItem('users');
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        } else {
          await AsyncStorage.setItem('users', JSON.stringify(assessmentUsers));
          setUsers(assessmentUsers);
        }
      } catch (error) {
        console.error('Error loading users from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

  // Save data to AsyncStorage
  const saveUsers = async (updatedUsers) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers); // Ensure state is updated after saving
    } catch (error) {
      console.error('Error saving users to AsyncStorage:', error);
    }
  };

  // Handle create or update user
  const handleCreateOrUpdateUser = (newUser) => {
    let updatedUsers;

    if (editMode && currentUser) {
      updatedUsers = users.map(user => 
        user.UserID === currentUser.UserID ? { ...user, ...newUser } : user
      );
    } else {
      updatedUsers = [...users, { ...newUser, UserID: Date.now() }];
    }

    console.log("Updated Users:", updatedUsers); // Check if new user is added
    saveUsers(updatedUsers);  // Save updated users to AsyncStorage
    setModalVisible(false);
    setEditMode(false);
    setCurrentUser(null);
  };

  // Handle delete user
  const handleDeleteUser = (userID) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          const updatedUsers = users.filter(user => user.UserID !== userID);
          setUsers(updatedUsers);
          saveUsers(updatedUsers);  // Save updated users to AsyncStorage
        },
        style: "destructive",
      },
    ]);
  };

  // Open edit modal
  const openEditModal = (user) => {
    setCurrentUser(user);
    setEditMode(true);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>List Users</Text>
      <TouchableOpacity
        style={styles.btncont}
        onPress={() => {
          setModalVisible(true);
          setEditMode(false);
          setCurrentUser(null);
        }}
      >
        <Text style={styles.addbtn}>+ Add User</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scroll}>
        {users.map((user) => (
          <View key={user.UserID} style={styles.userCard}>
            <Image source={{ uri: user.UserImageURL }} style={styles.userImage} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.UserFirstname} {user.UserLastname}</Text>
              <Text style={styles.userEmail}>{user.UserEmail}</Text>
              <Text style={styles.userType}>{user.UserType}</Text>
            </View>
            <TouchableOpacity onPress={() => openEditModal(user)} style={styles.editButton}>
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteUser(user.UserID)} style={styles.deleteButton}>
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Form
            initialData={currentUser}
            onSubmit={handleCreateOrUpdateUser}
            closeModal={() => setModalVisible(false)}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(false);
              setEditMode(false);
              setCurrentUser(null);
            }}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  heading: {
    alignSelf: "flex-start",
    width: "100%",
    fontSize: 18,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  btncont: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  addbtn: {
    textAlign: "center",
    width: "95%",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "grey",
    padding: 10,
    borderRadius: 5,
  },
  scroll: {
    width: "100%",
  },
  userCard: {
    flexDirection: "row",
    width: "95%",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    color: "black",
  },
  userEmail: {
    fontSize: 14,
    color: "grey",
  },
  userType: {
    fontSize: 14,
    color: "grey",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: "#dd404ee0",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  editButton: {
    padding: 5,
    backgroundColor: "#007bff",
    borderRadius: 3,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 10
  },
  deleteButton: {
    padding: 5,
    backgroundColor: "#d9534f",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Users;
