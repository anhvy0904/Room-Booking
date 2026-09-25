import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react-native';
import { BrandLogo } from '../components/BrandLogo';
import { Screen } from '../components/Screen';
import { signInWithGoogle } from '../api/googleAuth';
import { signInWithEmail, signUpWithEmail } from '../api/auth';
import { getAuthErrorMessage } from '../utils/authErrors';
import { useBookingStore } from '../store/useBookingStore';

export default function SignInScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);

  const handleEmailAuth = async () => {
    if (pending.current) return;
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }
    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Mật khẩu phải có tối thiểu 6 ký tự.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Xác nhận mật khẩu không trùng khớp.');
        return;
      }
    }

    pending.current = true;
    setBusy(true);
    setError('');

    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name || undefined);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (cause) {
      setError(getAuthErrorMessage(cause));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (cause) {
      setError(getAuthErrorMessage(cause));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  const handleGuestSignIn = () => {
    useBookingStore.getState().setUser({
      id: 'demo-student-vku',
      name: 'Nguyễn Thị Ánh Vy (Demo)',
      email: 'vy.23it323@vku.udn.vn',
    });
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* Brand Header */}
          <View style={styles.logoArea}>
            <BrandLogo size={90} showName={false} />
            <Text style={styles.brandTitle}>VKU Bookroom</Text>
            <Text style={styles.brandSubtitle}>Hệ thống đặt phòng học trực tuyến</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Mode Switcher */}
            <View style={styles.switcher}>
              <Pressable
                onPress={() => { setMode('signin'); setError(''); }}
                style={[styles.switchTab, mode === 'signin' && styles.switchTabActive]}
              >
                <Text style={[styles.switchText, mode === 'signin' && styles.switchTextActive]}>
                  Đăng nhập
                </Text>
              </Pressable>
              <Pressable
                onPress={() => { setMode('signup'); setError(''); }}
                style={[styles.switchTab, mode === 'signup' && styles.switchTabActive]}
              >
                <Text style={[styles.switchText, mode === 'signup' && styles.switchTextActive]}>
                  Đăng ký
                </Text>
              </Pressable>
            </View>

            {/* Display Name field (Sign Up only) */}
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Họ và tên</Text>
                <View style={styles.inputWrapper}>
                  <User size={18} color="#64748B" />
                  <TextInput
                    style={styles.input}
                    placeholder="VD: Nguyễn Văn A"
                    placeholderTextColor="#94A3B8"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email sinh viên VKU</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="name.21it@vku.udn.vn"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="Tối thiểu 6 ký tự"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
                </Pressable>
              </View>
            </View>

            {/* Confirm Password Field (Sign Up only) */}
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={18} color="#64748B" />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#94A3B8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}

            {/* Error Message */}
            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Primary Action Button */}
            <Pressable
              disabled={busy}
              onPress={handleEmailAuth}
              style={({ pressed }) => [
                styles.submitBtn,
                (pressed || busy) && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={mode === 'signin' ? "Đăng nhập" : "Đăng ký tài khoản"}
            >
              {busy ? (
                <ActivityIndicator color="#005A5D" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>
                    {mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản mới'}
                  </Text>
                  <ArrowRight size={18} color="#005A5D" />
                </>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>HOẶC</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In */}
            <Pressable
              disabled={busy}
              onPress={handleGoogleSignIn}
              style={({ pressed }) => [
                styles.googleBtn,
                (pressed || busy) && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Tiếp tục với Google"
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleBtnText}>Tiếp tục với Google</Text>
            </Pressable>

            {/* Guest / Demo Sign In */}
            <Pressable
              disabled={busy}
              onPress={handleGuestSignIn}
              style={({ pressed }) => [
                styles.guestBtn,
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Trải nghiệm nhanh với tài khoản Khách"
            >
              <Sparkles size={16} color="#0F766E" />
              <Text style={styles.guestBtnText}>Trải nghiệm nhanh (Khách Demo)</Text>
            </Pressable>

            <View style={styles.privacyRow}>
              <ShieldCheck size={14} color="#64748B" />
              <Text style={styles.privacyText}>
                Hệ thống xác thực bảo mật chuẩn Firebase Auth
              </Text>
            </View>
          </View>

          <Text style={styles.footerText}>
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG VIỆT - HÀN
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    alignItems: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  switcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  switchTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  switchTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 8,
  },
  eyeBtn: {
    padding: 6,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    lineHeight: 18,
  },
  submitBtn: {
    minHeight: 48,
    backgroundColor: '#B1E5E6',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#005A5D',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  googleBtn: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  guestBtn: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0FDFA',
    marginTop: 10,
  },
  guestBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F766E',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
  privacyText: {
    fontSize: 11,
    color: '#64748B',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#94A3B8',
    marginTop: 24,
    textAlign: 'center',
  },
});
