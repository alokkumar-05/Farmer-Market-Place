import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ route, navigation }) {
  const { user: authUser, logout } = useAuth();
  const [loading, setLoading] = React.useState(false);

  // Check if we are viewing another user's profile
  const publicUser = route?.params?.user;
  const isPublic = !!publicUser;
  const displayUser = isPublic ? publicUser : authUser;

  React.useLayoutEffect(() => {
    if (isPublic) {
      navigation.setOptions({ title: 'Profile' });
    }
  }, [navigation, isPublic]);

  const onLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (e) {
      Alert.alert('Error', 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isPublic ? 'User Profile' : 'My Profile'}</Text>
      <View style={styles.card}>
        <Row label="Name" value={displayUser?.name || '-'} />
        <Row label="Email" value={displayUser?.email || '-'} />
        <Row label="Role" value={displayUser?.role || '-'} />
      </View>
      {!isPublic && (
        <PrimaryButton title={loading ? 'Logging out...' : 'Logout'} onPress={onLogout} disabled={loading} />
      )}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { color: Colors.muted },
  value: { color: Colors.text, fontWeight: '700' },
});
