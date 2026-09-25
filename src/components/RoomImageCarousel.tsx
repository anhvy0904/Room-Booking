import React, { useState } from 'react';
import { View, Image, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ImageGalleryModal } from './ImageGalleryModal';

interface RoomImageCarouselProps {
  images: string[];
  roomName: string;
}

export const RoomImageCarousel = ({ images, roomName }: RoomImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);

  const displayImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <View style={styles.container}>
      {/* Main Image Stage */}
      <View style={styles.stage}>
        <Pressable onPress={() => setFullscreenVisible(true)} style={styles.imagePressable}>
          <Image
            source={{ uri: displayImages[activeIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
            accessibilityLabel={`${roomName} ảnh ${activeIndex + 1}`}
          />
        </Pressable>

        {/* Fullscreen Button */}
        <Pressable
          style={styles.fullscreenBtn}
          onPress={() => setFullscreenVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Xem ảnh toàn màn hình"
        >
          <Maximize2 size={16} color="#FFFFFF" />
          <Text style={styles.fullscreenText}>Toàn màn hình</Text>
        </Pressable>

        {/* Left/Right Arrows when multiple images */}
        {displayImages.length > 1 && (
          <>
            <Pressable style={[styles.arrowBtn, styles.arrowLeft]} onPress={handlePrev}>
              <ChevronLeft size={20} color="#FFFFFF" />
            </Pressable>
            <Pressable style={[styles.arrowBtn, styles.arrowRight]} onPress={handleNext}>
              <ChevronRight size={20} color="#FFFFFF" />
            </Pressable>
          </>
        )}

        {/* Dots Indicator */}
        {displayImages.length > 1 && (
          <View style={styles.dotsRow}>
            {displayImages.map((_, i) => (
              <View
                key={`dot-${i}`}
                style={[styles.dot, activeIndex === i && styles.dotActive]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbsContainer}
        >
          {displayImages.map((img, i) => (
            <Pressable
              key={`thumb-${i}`}
              onPress={() => setActiveIndex(i)}
              style={[
                styles.thumbBox,
                activeIndex === i && styles.thumbBoxActive,
              ]}
            >
              <Image source={{ uri: img }} style={styles.thumb} resizeMode="cover" />
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Fullscreen Gallery Modal */}
      <ImageGalleryModal
        visible={fullscreenVisible}
        images={displayImages}
        initialIndex={activeIndex}
        onClose={() => setFullscreenVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  stage: {
    width: '100%',
    height: 260,
    backgroundColor: '#0F172A',
    position: 'relative',
    overflow: 'hidden',
  },
  imagePressable: {
    width: '100%',
    height: '100%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  fullscreenBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullscreenText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: {
    left: 12,
  },
  arrowRight: {
    right: 12,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
  thumbsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: '#F8FAFC',
  },
  thumbBox: {
    width: 64,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.7,
  },
  thumbBoxActive: {
    borderColor: '#0284c7',
    opacity: 1,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
});
