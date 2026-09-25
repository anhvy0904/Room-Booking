import React, { useState } from 'react';
import { View, Image, StyleSheet, Modal, Pressable, Text } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface ImageGalleryModalProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export const ImageGalleryModal = ({ visible, images, initialIndex = 0, onClose }: ImageGalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.counter}>{currentIndex + 1} / {images.length}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Đóng">
            <X size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Main Image Area */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: currentImage }} style={styles.mainImage} resizeMode="contain" />

          {images.length > 1 && (
            <>
              <Pressable style={[styles.navBtn, styles.navLeft]} onPress={handlePrev}>
                <ChevronLeft size={30} color="#FFFFFF" />
              </Pressable>
              <Pressable style={[styles.navBtn, styles.navRight]} onPress={handleNext}>
                <ChevronRight size={30} color="#FFFFFF" />
              </Pressable>
            </>
          )}
        </View>

        {/* Thumbnail Row */}
        {images.length > 1 && (
          <View style={styles.thumbnailRow}>
            {images.map((img, idx) => (
              <Pressable
                key={`${img}-${idx}`}
                onPress={() => setCurrentIndex(idx)}
                style={[
                  styles.thumbWrapper,
                  currentIndex === idx && styles.thumbActive,
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbImage} resizeMode="cover" />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'space-between',
    paddingVertical: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  counter: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  navLeft: {
    left: 16,
  },
  navRight: {
    right: 16,
  },
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  thumbWrapper: {
    width: 64,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.6,
  },
  thumbActive: {
    borderColor: '#38BDF8',
    opacity: 1,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
});
