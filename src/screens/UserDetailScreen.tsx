import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useAppDispatch} from '../store/hooks';
import {updateUser, revertUser} from '../store/reducers/users';
import {RootStackParamList} from '../navigation/types';
import {User} from '../types/user';
import FormField from '../components/FormField';
import {colors} from '../styles/colors';

type DetailRouteProp = RouteProp<RootStackParamList, 'UserDetail'>;

const EditSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: Yup.string()
    .min(7, 'Enter a valid phone number')
    .required('Phone is required'),
  website: Yup.string()
    .matches(
      /^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/.*)?$/,
      'Enter a valid website URL',
    )
    .required('Website is required'),
  street: Yup.string().required('Street is required'),
  city: Yup.string().required('City is required'),
  zipcode: Yup.string().required('Zip code is required'),
  companyName: Yup.string().required('Company name is required'),
});

interface EditValues {
  name: string;
  email: string;
  phone: string;
  website: string;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  companyName: string;
}

const SectionHeader = ({title}: {title: string}) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const InfoRow = ({label, value}: {label: string; value: string}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const UserDetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const dispatch = useAppDispatch();

  const [currentUser, setCurrentUser] = useState<User>(route.params.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initials = (() => {
    const parts = currentUser.name.trim().split(' ');
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  })();

  const initialValues: EditValues = {
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    website: currentUser.website,
    street: currentUser.address.street,
    suite: currentUser.address.suite,
    city: currentUser.address.city,
    zipcode: currentUser.address.zipcode,
    companyName: currentUser.company.name,
  };

  const handleSave = useCallback(
    async (values: EditValues) => {
      setIsSaving(true);
      const updatedUser: User = {
        ...currentUser,
        name: values.name,
        email: values.email,
        phone: values.phone,
        website: values.website,
        address: {
          ...currentUser.address,
          street: values.street,
          suite: values.suite,
          city: values.city,
          zipcode: values.zipcode,
        },
        company: {
          ...currentUser.company,
          name: values.companyName,
        },
      };

      const originalUser = {...currentUser};

      dispatch(updateUser(updatedUser));
      setCurrentUser(updatedUser);
      setIsEditing(false);

      try {
        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            Math.random() > 0.05
              ? resolve()
              : reject(new Error('Network error'));
          }, 600);
        });

        setIsSaving(false);
        Alert.alert('Success', 'User updated successfully!');
      } catch (err: any) {
        dispatch(revertUser(originalUser));
        setCurrentUser(originalUser);
        setIsSaving(false);
        Alert.alert(
          'Update Failed',
          'Could not save changes. Your edits have been reverted.',
          [
            {text: 'Dismiss'},
            {text: 'Edit Again', onPress: () => setIsEditing(true)},
          ],
        );
      }
    },
    [currentUser, dispatch],
  );

  const handleCancelEdit = useCallback((resetForm: () => void) => {
    resetForm();
    setIsEditing(false);
  }, []);

  const renderDetailView = () => (
    <ScrollView
      style={styles.flexView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.heroName}>{currentUser.name}</Text>
        <Text style={styles.heroUsername}>@{currentUser.username}</Text>
        {isSaving && (
          <View style={styles.savingBadge}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.savingText}>Saving…</Text>
          </View>
        )}
      </View>

      {/* Contact */}
      <View style={styles.card}>
        <SectionHeader title="Contact" />
        <InfoRow label="Email" value={currentUser.email} />
        <InfoRow label="Phone" value={currentUser.phone} />
        <InfoRow label="Website" value={currentUser.website} />
      </View>

      {/* Address */}
      <View style={styles.card}>
        <SectionHeader title="Address" />
        <InfoRow
          label="Street"
          value={`${currentUser.address.street}${
            currentUser.address.suite ? ', ' + currentUser.address.suite : ''
          }`}
        />
        <InfoRow label="City" value={currentUser.address.city} />
        <InfoRow label="Zip Code" value={currentUser.address.zipcode} />
      </View>

      {/* Company */}
      <View style={styles.card}>
        <SectionHeader title="Company" />
        <InfoRow label="Name" value={currentUser.company.name} />
        <InfoRow label="Tagline" value={currentUser.company.catchPhrase} />
        <InfoRow label="Business" value={currentUser.company.bs} />
      </View>

      <TouchableOpacity
        style={styles.editButton}
        activeOpacity={0.8}
        onPress={() => setIsEditing(true)}>
        <Text style={styles.editButtonText}>✏️ Edit User</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderEditForm = () => (
    <Formik
      initialValues={initialValues}
      validationSchema={EditSchema}
      onSubmit={handleSave}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <KeyboardAvoidingView
          style={styles.flexView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={styles.flexView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <SectionHeader title="Basic Info" />
              <FormField
                label="Full Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={errors.name}
                touched={touched.name}
                autoCapitalize="words"
              />
              <FormField
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormField
                label="Phone"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                error={errors.phone}
                touched={touched.phone}
                keyboardType="phone-pad"
              />
              <FormField
                label="Website"
                value={values.website}
                onChangeText={handleChange('website')}
                onBlur={handleBlur('website')}
                error={errors.website}
                touched={touched.website}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <View style={styles.card}>
              <SectionHeader title="Address" />
              <FormField
                label="Street"
                value={values.street}
                onChangeText={handleChange('street')}
                onBlur={handleBlur('street')}
                error={errors.street}
                touched={touched.street}
              />
              <FormField
                label="Suite / Apt (optional)"
                value={values.suite}
                onChangeText={handleChange('suite')}
                onBlur={handleBlur('suite')}
              />
              <FormField
                label="City"
                value={values.city}
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
                error={errors.city}
                touched={touched.city}
              />
              <FormField
                label="Zip Code"
                value={values.zipcode}
                onChangeText={handleChange('zipcode')}
                onBlur={handleBlur('zipcode')}
                error={errors.zipcode}
                touched={touched.zipcode}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View style={styles.card}>
              <SectionHeader title="Company" />
              <FormField
                label="Company Name"
                value={values.companyName}
                onChangeText={handleChange('companyName')}
                onBlur={handleBlur('companyName')}
                error={errors.companyName}
                touched={touched.companyName}
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelEdit(resetForm)}
                activeOpacity={0.8}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isSubmitting && styles.saveButtonDisabled,
                ]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
                activeOpacity={0.8}>
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );

  return (
    <View style={styles.container}>
      {isEditing ? renderEditForm() : renderDetailView()}
    </View>
  );
};

export default UserDetailScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flexView: {flex: 1},
  scrollContent: {padding: 16, paddingBottom: 40},
  hero: {alignItems: 'center', marginBottom: 20},
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {color: '#fff', fontWeight: '800', fontSize: 28},
  heroName: {fontSize: 22, fontWeight: '700', color: colors.text},
  heroUsername: {fontSize: 14, color: colors.secondary, marginTop: 4},
  savingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    gap: 6,
  },
  savingText: {color: '#fff', fontSize: 12, fontWeight: '600'},
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {fontSize: 14, color: colors.secondary, flex: 1},
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {color: '#fff', fontSize: 16, fontWeight: '700'},
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {color: colors.text, fontSize: 15, fontWeight: '600'},
  saveButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonDisabled: {opacity: 0.7},
  saveButtonText: {color: '#fff', fontSize: 15, fontWeight: '700'},
});
