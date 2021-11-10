import React from 'react';
import {View, TextInput, Image, StyleSheet} from 'react-native';

const Searchbar: React.FC = () => {
  return (
    <View style={styles.searchBoxWrapper}>
      <TextInput placeholder="Search Course" style={styles.input} />
      <Image
        source={require('../../assets/search-icon.png')}
        style={styles.iconSearch}
      />
    </View>
  );
};

export default Searchbar;

const styles = StyleSheet.create({
  searchBoxWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BEBAB3',
    height: 56,
    borderRadius: 12,
    marginVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 16,
  },
  iconSearch: {
    margin: 18,
  },
});
