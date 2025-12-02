import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, getUserById } from '../services/api';

export default function ProfileScreen({ route, navigation }) {
  const { user: authUser, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check if we are viewing another user's profile
  const paramsUser = route?.params?.user;
  const isPublic = !!paramsUser;
  // Form State
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState(null); // { uri, base64 }
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (displayUser) {
      setBio(displayUser.bio || '');
      setAddress(displayUser.address || '');
      setPhone(displayUser.phone || '');
      setUpiId(displayUser.upiId || '');
      setAccountHolderName(displayUser.accountHolderName || '');
    }
  }, [displayUser]);

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setQrCodeImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        bio,
        address,
        phone,
        upiId,
        accountHolderName,
        qrCodeBase64: qrCodeImage ? `data:image/jpeg;base64,${qrCodeImage.base64}` : undefined,
      };

      const res = await updateUserProfile(updateData);
      const updatedUser = res.data.data;

      // Update local auth context
      await updateUser(updatedUser);
      Alert.alert('Success', 'Profile updated successfully');
      setQrCodeImage(null); // Reset pending image
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isPublic ? 'User Profile' : 'My Profile'}</Text>

      <View style={styles.card}>
        <Row label="Name" value={displayUser?.name || '-'} />
        <Row label="Email" value={displayUser?.email || '-'} />
        <Row label="Role" value={displayUser?.role || '-'} />
        {isPublic && displayUser?.location && <Row label="Location" value={displayUser.location} />}
      </View>

      {/* QR Code Section */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.headerRow} onPress={() => setShowQr(!showQr)}>
          <Text style={styles.sectionTitle}>Payment QR Code</Text>
          <Text>{showQr ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showQr && (
          <View style={styles.sectionContent}>
            {/* Display Existing or New QR */}
            {(qrCodeImage || (displayUser?.qrCode && displayUser.qrCode.url)) ? (
              <Image
                source={{ uri: qrCodeImage ? qrCodeImage.uri : displayUser.qrCode.url }}
                style={styles.qrImage}
              />
            ) : (
              <Text style={styles.mutedText}>No QR Code uploaded</Text>
            )}

            <Text style={styles.accountName}>
              {accountHolderName || displayUser?.accountHolderName || 'No Account Name'}
            </Text>

            {!isPublic && (
              <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                <Text style={styles.uploadBtnText}>Upload New QR</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Details Section */}
      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Additional Details</Text>

        {isPublic ? (
          <>
            <Row label="Bio" value={displayUser?.bio || '-'} />
            <Row label="Address" value={displayUser?.address || '-'} />
            <Row label="Phone" value={displayUser?.phone || '-'} />
            <Row label="UPI ID" value={displayUser?.upiId || '-'} />
          </>
        ) : (
          <View style={styles.form}>
            <Input label="Account Holder Name" value={accountHolderName} onChangeText={setAccountHolderName} />
            <Input label="Bio" value={bio} onChangeText={setBio} multiline />
            <Input label="Address" value={address} onChangeText={setAddress} multiline />
            <Input
              label="Phone"
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, '').slice(0, 10))}
              keyboardType="phone-pad"
            />
            <Input label="UPI ID" value={upiId} onChangeText={setUpiId} />

            <PrimaryButton
              title={saving ? 'Saving...' : 'Save Details'}
              onPress={handleSave}
              disabled={saving}
              style={{ marginTop: 12 }}
            />
          </View>
        )}
      </View>

      {!isPublic && (
        <PrimaryButton
          title={loading ? 'Logging out...' : 'Logout'}
          onPress={onLogout}
          disabled={loading}
          style={{ backgroundColor: Colors.error, marginTop: 20, marginBottom: 40 }}
        />
      )}
    </ScrollView>
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

function Input({ label, value, onChangeText, multiline, keyboardType }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholder={`Enter ${label}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { color: Colors.muted, flex: 1 },
  value: { color: Colors.text, fontWeight: '700', flex: 2, textAlign: 'right' },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  sectionContent: { alignItems: 'center', marginTop: 16 },
  qrImage: { width: 200, height: 200, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  accountName: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  mutedText: { color: Colors.muted, fontStyle: 'italic', marginBottom: 8 },
  uploadBtn: { backgroundColor: Colors.secondary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  uploadBtnText: { color: Colors.primary, fontWeight: '600' },

  form: { gap: 12 },
  inputContainer: { marginBottom: 8 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: Colors.background },
});
