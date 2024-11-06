import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Modal, TouchableOpacity, TextInput, Button, Image } from 'react-native';

const PetsList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
        const json = await response.json();
        setAnimals(json); 
        console.log(json);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false); 
      }
    };
    fetchAnimals();
  }, []);

  const findAnimalById = () => {
    const foundAnimal = animals.find(animal => animal.id.toString() === searchId);
    if (foundAnimal) {
      setSelectedAnimal(foundAnimal);
      setModalVisible(true);
    } else {
      setErrorModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAnimal(null);
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedAnimal(item);
      setModalVisible(true); 
    }}>
      <View style={styles.animalContainer}>
        <Text style={styles.animalName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Введите ID животного"
        value={searchId}
        onChangeText={setSearchId}
        keyboardType="numeric"
      />
      <Button title="Найти" onPress={findAnimalById} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={animals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
      
      {selectedAnimal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>ID: {selectedAnimal.id}</Text>
              <Text style={styles.modalText}>Имя: {selectedAnimal.name}</Text>
              <Text style={styles.modalText}>Категория: {selectedAnimal.category?.name || 'Неизвестен'}</Text>
              {selectedAnimal.photoUrls?.length > 0 && (
                <Image source={{ uri: selectedAnimal.photoUrls[0] }} style={styles.animalImage} />
              )}
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={closeErrorModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Не найдено</Text>
            <TouchableOpacity onPress={closeErrorModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  animalContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  animalName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  animalImage: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PetsList;
