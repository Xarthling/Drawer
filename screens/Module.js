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
} from "react-native";
import assessmentModules from "../data/assessmentModules.json";
import Form from '../component/form';

export default function Module() {
  const [modules, setModules] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModules(assessmentModules);
  }, []);

  const placeholders = {
    moduleName: 'Enter Module Name',
    moduleCode: 'Enter Module Code',
    moduleLevel: 'Enter Module Level',
    moduleLeaderName: 'Enter Module Leader Name',
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>List modules</Text>
      <TouchableOpacity
        style={styles.btncont}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addbtn}>+ Add module</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scroll}>
        {modules.map((module) => (
          <View key={module.ModuleID} style={styles.moduleCard}>
            <Image source={{ uri: module.ModuleImage }} style={styles.moduleImage} />
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleName}>
                {module.ModuleCode} {module.ModuleName}
              </Text>
              <Text style={styles.moduleLevel}>Level: {module.ModuleLevel}</Text>
              <Text style={styles.moduleLeader}>Leader: {module.ModuleLeaderName}</Text>
            </View>
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
          <Form closeModal={() => setModalVisible(false)} placeholders={placeholders} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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
  moduleCard: {
    flexDirection: "row",
    width: "95%",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginBottom: 10,
  },
  moduleImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  moduleInfo: {
    justifyContent: "center",
  },
  moduleName: {
    fontSize: 16,
    color: "black",
  },
  moduleLevel: {
    fontSize: 14,
    color: "grey",
  },
  moduleLeader: {
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});