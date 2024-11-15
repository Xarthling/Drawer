import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';  

const Form = ({ onSubmit, initialData, closeModal }) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.UserFirstname || '',
    lastName: initialData?.UserLastname || '',
    email: initialData?.UserEmail || '',
    userType: initialData?.UserType || '',
    UserImageURL: initialData?.UserImageURL || '',
    UserYear: initialData?.UserYear || '2023-24'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.UserFirstname || '',
        lastName: initialData.UserLastname || '',
        email: initialData.UserEmail || '',
        userType: initialData.UserType || '',
        UserImageURL: initialData.UserImageURL || '',
        UserYear: initialData.UserYear || '2023-24'
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData); // Send the formatted user data to the parent component
    setFormData({ firstName: '', lastName: '', email: '', userType: '', UserImageURL: '', UserYear: '2023-24' }); // Reset form
    closeModal();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="User Type"
        value={formData.userType}
        onChangeText={(text) => handleChange('userType', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={formData.UserImageURL}
        onChangeText={(text) => handleChange('UserImageURL', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="User Year"
        value={formData.UserYear}
        onChangeText={(text) => handleChange('UserYear', text)}
        style={styles.input}
      />
      <Button title={initialData ? 'Update User' : 'Add User'} onPress={handleSubmit} />
      <Button style={styles.cancle} title="Cancel" onPress={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
  cancle :{
    backgroundColor: 'red',
  }
});

export default Form;
