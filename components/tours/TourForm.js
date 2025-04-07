// components/tours/TourForm.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

import Input from '../ui/Input';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';

const TourForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  exhibits = [],
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [date, setDate] = useState(initialData.date || '');
  const [selectedExhibits, setSelectedExhibits] = useState(initialData.exhibits || []);
  const [errors, setErrors] = useState({});
  
  // For date time picker, you might want to use a library like 'react-native-modal-datetime-picker'
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name) {
      newErrors.name = 'Tour name is required';
    }
    
    if (!date) {
      newErrors.date = 'Tour date is required';
    }
    
    if (selectedExhibits.length === 0) {
      newErrors.exhibits = 'Please select at least one exhibit';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        id: initialData.id,
        name,
        description,
        date,
        exhibits: selectedExhibits,
      });
    }
  };
  
  const toggleExhibit = (exhibitId) => {
    if (selectedExhibits.includes(exhibitId)) {
      setSelectedExhibits(selectedExhibits.filter(id => id !== exhibitId));
    } else {
      setSelectedExhibits([...selectedExhibits, exhibitId]);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Input
        label="Tour Name"
        placeholder="Enter tour name"
        value={name}
        onChangeText={setName}
        error={errors.name}
      />
      
      <Input
        label="Description"
        placeholder="Enter tour description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      
      <Input
        label="Date & Time"
        placeholder="Select date and time"
        value={date}
        // You would normally set this to open a date time picker
        onChangeText={setDate}
        error={errors.date}
      />
      
      <Typography variant="h3" style={styles.sectionTitle}>
        Select Exhibits
      </Typography>
      
      {errors.exhibits && (
        <Typography variant="caption" color="error" style={styles.errorText}>
          {errors.exhibits}
        </Typography>
      )}
      
      <View style={styles.exhibitsList}>
        {exhibits.map(exhibit => (
          <Card 
            key={exhibit.id}
            style={[
              styles.exhibitCard,
              selectedExhibits.includes(exhibit.id) && styles.selectedExhibit
            ]}
            onPress={() => toggleExhibit(exhibit.id)}
          >
            <View style={styles.exhibitCardContent}>
              <Typography variant="body" numberOfLines={1}>
                {exhibit.name}
              </Typography>
              
              <Typography variant="caption" color="light" numberOfLines={1}>
                {exhibit.category}
              </Typography>
            </View>
            
            <Typography variant="h3">
              {selectedExhibits.includes(exhibit.id) ? '✓' : ''}
            </Typography>
          </Card>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          style={styles.cancelButton}
        />
        
        <Button
          title={initialData.id ? "Update Tour" : "Create Tour"}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.md,
  },
  sectionTitle: {
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  errorText: {
    marginBottom: SIZES.sm,
  },
  exhibitsList: {
    marginBottom: SIZES.lg,
  },
  exhibitCard: {
    marginBottom: SIZES.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exhibitCardContent: {
    flex: 1,
    marginRight: SIZES.xs,
  },
  selectedExhibit: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.md,
    marginBottom: SIZES.xl,
  },
  cancelButton: {
    flex: 1,
    marginRight: SIZES.md,
  },
  submitButton: {
    flex: 2,
  },
});

export default TourForm;