import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import Form from "../component/form.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("http://192.168.18.24:3000/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error loading users from server:", error);
      }
    };
    loadData();
  }, []);

  const handleCreateOrUpdateUser = async (newUser) => {
    const formattedUser = {
      UserID: newUser.UserID,
      UserFirstname: newUser.firstName || "Dummy",
      UserLastname: newUser.lastName || "Dummy",
      UserEmail: newUser.email || "Dummy",
      UserImageURL: newUser.UserImageURL || "https://default-image-url.com",
      UserType: newUser.userType || "Dummy",
      UserYear: newUser.UserYear || "2023-24",
    };

    try {
      const response = editMode
        ? await fetch(`http://192.168.18.24:3000/users/${currentUser.UserID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedUser),
          })
        : await fetch("http://192.168.18.24:3000/create-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedUser),
          });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          console.error("Server response:", errorData);
        } else {
          const errorText = await response.text();
          console.error("Server response is not JSON:", errorText);
        }
        throw new Error("Failed to save user");
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        editMode
          ? prevUsers.map((user) =>
              user.UserID === updatedUser.UserID ? updatedUser : user
            )
          : [...prevUsers, updatedUser]
      );

      setModalVisible(false);
      setEditMode(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error saving user to server:", error);
    }
  };

  const handleDeleteUser = async (userID) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const response = await fetch(`http://192.168.18.24:3000/users/${userID}`, {
              method: "DELETE",
            });
            if (response.ok) {
              setUsers(users.filter((user) => user.UserID !== userID));
            } else {
              throw new Error("Failed to delete user");
            }
          } catch (error) {
            console.error("Error deleting user:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

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
            <Image
              source={{ uri: user.UserImageURL }}
              style={styles.userImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.UserFirstname} {user.UserLastname}</Text>
              <Text style={styles.userEmail}>{user.UserEmail}</Text>
              <Text style={styles.userType}>{user.UserType}</Text>
            </View>
            <TouchableOpacity
              onPress={() => openEditModal(user)}
              style={styles.editButton}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteUser(user.UserID)}
              style={styles.deleteButton}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide">
        <Form
          onSubmit={handleCreateOrUpdateUser}
          initialData={currentUser}
          closeModal={() => setModalVisible(false)}
        />
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
  editButton: {
    padding: 5,
    backgroundColor: "#007bff",
    borderRadius: 3,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
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
