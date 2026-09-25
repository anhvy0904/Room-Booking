import { Image, StyleSheet, Text, View } from 'react-native';

export const BrandLogo = ({ size = 56, showName = true }: { size?: number; showName?: boolean }) => (
  <View style={styles.brand}>
    <Image source={require('../../assets/bookroom-logo.png')} style={{ width: size, height: size, borderRadius: size * 0.25 }} accessibilityLabel="Logo VKU Bookroom: mèo và hoa hướng dương" />
    {showName && <View>
      <Text style={styles.name}>VKU Bookroom</Text>
      <Text style={styles.tagline}>Hãy đặt lịch để có người iu</Text>
    </View>}
  </View>
);

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { color: '#104B50', fontSize: 20, fontWeight: '800' },
  tagline: { color: '#52706E', fontSize: 12, marginTop: 4 },
});
