import { StyleSheet, View } from 'react-native';
import PetsList from './src/PetsList';

export default function App() {
  return (
    <View style={styles.container}>
      <PetsList/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
