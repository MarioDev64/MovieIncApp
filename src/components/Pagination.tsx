import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPreviousPage, onNextPage }) => {
  return (
    <View style={styles.pagination}>
      <IconButton
        icon="chevron-left"
        disabled={currentPage === 1}
        onPress={onPreviousPage}
        accessibilityLabel="Previous page"
      />
      <Text style={styles.pageText}>{`Page ${currentPage} of ${totalPages}`}</Text>
      <IconButton
        icon="chevron-right"
        disabled={currentPage === totalPages}
        onPress={onNextPage}
        accessibilityLabel="Next page"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  pageText: {
    flex: 1, 
    textAlign: 'center',
  },
});

export default Pagination;