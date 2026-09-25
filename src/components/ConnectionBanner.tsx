import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';

interface ConnectionBannerProps {
  isError?: boolean;
  onRetry?: () => void;
}

export const ConnectionBanner = ({ isError, onRetry }: ConnectionBannerProps) => {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'ononline' in window) {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!isOnline) {
    return (
      <View style={[styles.banner, styles.offlineBanner]}>
        <WifiOff size={15} color="#FFFFFF" />
        <Text style={styles.bannerText}>
          Mất kết nối mạng. Đang hiển thị dữ liệu bộ nhớ tạm.
        </Text>
      </View>
    );
  }

  if (isError && onRetry) {
    return (
      <View style={[styles.banner, styles.errorBanner]}>
        <Text style={styles.bannerText}>
          Chưa thể đồng bộ dữ liệu mới nhất.
        </Text>
        <Pressable onPress={onRetry} style={styles.retryBtn}>
          <RefreshCw size={13} color="#FFFFFF" />
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 100,
  },
  offlineBanner: {
    backgroundColor: '#DC2626',
  },
  errorBanner: {
    backgroundColor: '#D97706',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
