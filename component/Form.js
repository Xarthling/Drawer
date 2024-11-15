import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';  

const Form = ({ onSubmit, initialData, closeModal }) => {
  const [formData, setFormData] = useState({ name: '', email: '', userType: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.UserFirstname,
        email: initialData.UserEmail,
        userType: initialData.UserType || '', 
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: '', email: '', userType: '' });  // Reset form
    closeModal();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
      />
      
      <SelectList
        setSelected={(value) => handleChange('userType', value)}
        data={[
          { key: '1', value: 'Student' },
          { key: '2', value: 'Teacher' },
          { key: '3', value: 'Admin' }
        ]}
        save="value"
        placeholder="Select User Type"
        defaultOption={{ key: formData.userType, value: formData.userType }} 
        boxStyles={styles.dropdown} 
      />
      
      <Button title={initialData ? 'Update User' : 'Add User'} onPress={handleSubmit} />
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
  }
});

export default Form;
