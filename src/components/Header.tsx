import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';

export type Props = {
  label: string;
  onPress: () => void;
};

const Header: React.FC<Props> = ({label, onPress}) => {
  return (
    <View style={styles.headerView}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.containView}>
          <Image
            source={require('../../assets/back-button.png')}
            style={{height: 40, width: 40, marginTop: 6}}
          />
          <Text style={styles.textLabel}>{label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerView: {
    height: 50,
  },
  containView: {
    flexDirection: 'row',
  },
  iconLabel: {
    marginHorizontal: 16,
  },
  textLabel: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
    color: '#3C3A36',
    marginLeft: 112,
  },
});
