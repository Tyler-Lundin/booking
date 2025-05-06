import { EmbedSettings } from '@/types/custom.types';

export type Industry = {
  id: string;
  name: string;
  description: string;
  defaultSettings: Partial<EmbedSettings>;
  availableBookingTypes: string[];
  customFields?: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
    required: boolean;
    options?: string[];
    placeholder?: string;
  }[];
};

export const industries: Industry[] = [
  {
    id: 'barbershop',
    name: 'Barbershop',
    description: 'For barbershops and hair salons',
    defaultSettings: {
      industry: 'barbershop',
      min_booking_notice_hours: 24,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: ['haircut', 'beard-trim', 'coloring', 'styling'],
      secure_booking: false,
    },
    availableBookingTypes: ['haircut', 'beard-trim', 'coloring', 'styling'],
    customFields: [
      {
        id: 'hair_length',
        label: 'Hair Length',
        type: 'select',
        required: true,
        options: ['short', 'medium', 'long'],
      },
      {
        id: 'special_requests',
        label: 'Special Requests',
        type: 'textarea',
        required: false,
        placeholder: 'Any specific requests or notes for your appointment',
      },
    ],
  },
  {
    id: 'tattoo',
    name: 'Tattoo Studio',
    description: 'For tattoo studios and artists',
    defaultSettings: {
      industry: 'tattoo',
      min_booking_notice_hours: 48,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: ['consultation', 'tattoo', 'touch-up', 'cover-up'],
      secure_booking: true,
    },
    availableBookingTypes: ['consultation', 'tattoo', 'touch-up', 'cover-up'],
    customFields: [
      {
        id: 'tattoo_size',
        label: 'Tattoo Size',
        type: 'select',
        required: true,
        options: ['small', 'medium', 'large', 'custom'],
      },
      {
        id: 'body_part',
        label: 'Body Part',
        type: 'text',
        required: true,
        placeholder: 'Where will the tattoo be placed?',
      },
      {
        id: 'reference_images',
        label: 'Reference Images',
        type: 'textarea',
        required: false,
        placeholder: 'Please provide any reference images or descriptions',
      },
    ],
  },
  {
    id: 'optometry',
    name: 'Optometry',
    description: 'For optometrists and eye care clinics',
    defaultSettings: {
      industry: 'optometry',
      min_booking_notice_hours: 24,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: ['eye-exam', 'contact-lens-fitting', 'frame-selection', 'follow-up'],
      secure_booking: true,
    },
    availableBookingTypes: ['eye-exam', 'contact-lens-fitting', 'frame-selection', 'follow-up'],
    customFields: [
      {
        id: 'insurance_provider',
        label: 'Insurance Provider',
        type: 'text',
        required: false,
        placeholder: 'Enter your insurance provider if applicable',
      },
      {
        id: 'last_eye_exam',
        label: 'Last Eye Exam',
        type: 'text',
        required: true,
        placeholder: 'When was your last eye exam?',
      },
    ],
  },
  {
    id: 'dental',
    name: 'Dental',
    description: 'For dental clinics and practices',
    defaultSettings: {
      industry: 'dental',
      min_booking_notice_hours: 24,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: ['cleaning', 'checkup', 'filling', 'extraction', 'emergency'],
      secure_booking: true,
    },
    availableBookingTypes: ['cleaning', 'checkup', 'filling', 'extraction', 'emergency'],
    customFields: [
      {
        id: 'insurance_provider',
        label: 'Insurance Provider',
        type: 'text',
        required: false,
        placeholder: 'Enter your dental insurance provider if applicable',
      },
      {
        id: 'last_dental_visit',
        label: 'Last Dental Visit',
        type: 'text',
        required: true,
        placeholder: 'When was your last dental visit?',
      },
      {
        id: 'reason_for_visit',
        label: 'Reason for Visit',
        type: 'textarea',
        required: true,
        placeholder: 'Please describe the reason for your visit',
      },
    ],
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    description: 'For landscaping and lawn care services',
    defaultSettings: {
      industry: 'landscaping',
      min_booking_notice_hours: 48,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: ['consultation', 'lawn-care', 'landscaping', 'tree-service', 'irrigation'],
      secure_booking: false,
    },
    availableBookingTypes: ['consultation', 'lawn-care', 'landscaping', 'tree-service', 'irrigation'],
    customFields: [
      {
        id: 'property_size',
        label: 'Property Size',
        type: 'select',
        required: true,
        options: ['small', 'medium', 'large', 'commercial'],
      },
      {
        id: 'service_area',
        label: 'Service Area',
        type: 'text',
        required: true,
        placeholder: 'Which areas need service?',
      },
      {
        id: 'special_requirements',
        label: 'Special Requirements',
        type: 'textarea',
        required: false,
        placeholder: 'Any specific requirements or concerns?',
      },
    ],
  },
  {
    id: 'nail-salon',
    name: 'Nail Salon',
    description: 'For nail salons and manicure/pedicure services',
    defaultSettings: {
      industry: 'nail-salon',
      min_booking_notice_hours: 24,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: ['manicure', 'pedicure', 'gel-nails', 'acrylics', 'nail-art'],
      secure_booking: false,
    },
    availableBookingTypes: ['manicure', 'pedicure', 'gel-nails', 'acrylics', 'nail-art'],
    customFields: [
      {
        id: 'nail_type',
        label: 'Nail Type',
        type: 'select',
        required: true,
        options: ['natural', 'gel', 'acrylic', 'dip-powder'],
      },
      {
        id: 'nail_length',
        label: 'Nail Length',
        type: 'select',
        required: true,
        options: ['short', 'medium', 'long', 'extra-long'],
      },
      {
        id: 'design_preferences',
        label: 'Design Preferences',
        type: 'textarea',
        required: false,
        placeholder: 'Any specific design preferences or inspiration?',
      },
    ],
  },
  {
    id: 'massage',
    name: 'Massage Therapy',
    description: 'For massage therapists and wellness centers',
    defaultSettings: {
      industry: 'massage',
      min_booking_notice_hours: 24,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: ['swedish', 'deep-tissue', 'sports', 'prenatal', 'couples'],
      secure_booking: true,
    },
    availableBookingTypes: ['swedish', 'deep-tissue', 'sports', 'prenatal', 'couples'],
    customFields: [
      {
        id: 'massage_type',
        label: 'Massage Type',
        type: 'select',
        required: true,
        options: ['swedish', 'deep-tissue', 'sports', 'prenatal', 'couples'],
      },
      {
        id: 'pressure_preference',
        label: 'Pressure Preference',
        type: 'select',
        required: true,
        options: ['light', 'medium', 'firm', 'deep'],
      },
      {
        id: 'health_concerns',
        label: 'Health Concerns',
        type: 'textarea',
        required: true,
        placeholder: 'Please list any health concerns or areas of focus',
      },
    ],
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'For photographers and photo studios',
    defaultSettings: {
      industry: 'photography',
      min_booking_notice_hours: 72,
      max_attendees: 10,
      archive_after_days: 30,
      allowed_booking_types: ['portrait', 'wedding', 'event', 'commercial', 'family'],
      secure_booking: true,
    },
    availableBookingTypes: ['portrait', 'wedding', 'event', 'commercial', 'family'],
    customFields: [
      {
        id: 'session_type',
        label: 'Session Type',
        type: 'select',
        required: true,
        options: ['portrait', 'wedding', 'event', 'commercial', 'family'],
      },
      {
        id: 'session_duration',
        label: 'Session Duration',
        type: 'select',
        required: true,
        options: ['30min', '1hr', '2hr', '4hr', 'full-day'],
      },
      {
        id: 'location_preferences',
        label: 'Location Preferences',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your preferred location or venue',
      },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness Training',
    description: 'For personal trainers and fitness studios',
    defaultSettings: {
      industry: 'fitness',
      min_booking_notice_hours: 24,
      max_attendees: 10,
      archive_after_days: 30,
      allowed_booking_types: ['personal-training', 'group-class', 'yoga', 'pilates', 'nutrition'],
      secure_booking: true,
    },
    availableBookingTypes: ['personal-training', 'group-class', 'yoga', 'pilates', 'nutrition'],
    customFields: [
      {
        id: 'fitness_level',
        label: 'Fitness Level',
        type: 'select',
        required: true,
        options: ['beginner', 'intermediate', 'advanced', 'athlete'],
      },
      {
        id: 'training_goals',
        label: 'Training Goals',
        type: 'select',
        required: true,
        options: ['weight-loss', 'muscle-gain', 'endurance', 'flexibility', 'rehabilitation'],
      },
      {
        id: 'health_conditions',
        label: 'Health Conditions',
        type: 'textarea',
        required: true,
        placeholder: 'Please list any health conditions or injuries',
      },
    ],
  },
  {
    id: 'auto-repair',
    name: 'Auto Repair',
    description: 'For auto repair shops and mechanics',
    defaultSettings: {
      industry: 'auto-repair',
      min_booking_notice_hours: 24,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: ['maintenance', 'repair', 'diagnostic', 'tire-service', 'emergency'],
      secure_booking: false,
    },
    availableBookingTypes: ['maintenance', 'repair', 'diagnostic', 'tire-service', 'emergency'],
    customFields: [
      {
        id: 'vehicle_make',
        label: 'Vehicle Make',
        type: 'text',
        required: true,
        placeholder: 'Enter your vehicle make',
      },
      {
        id: 'vehicle_model',
        label: 'Vehicle Model',
        type: 'text',
        required: true,
        placeholder: 'Enter your vehicle model',
      },
      {
        id: 'service_description',
        label: 'Service Description',
        type: 'textarea',
        required: true,
        placeholder: 'Please describe the service needed',
      },
    ],
  },
  {
    id: 'pet-care',
    name: 'Pet Care',
    description: 'For pet grooming and veterinary services',
    defaultSettings: {
      industry: 'pet-care',
      min_booking_notice_hours: 24,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: ['grooming', 'vet-visit', 'boarding', 'training', 'daycare'],
      secure_booking: true,
    },
    availableBookingTypes: ['grooming', 'vet-visit', 'boarding', 'training', 'daycare'],
    customFields: [
      {
        id: 'pet_type',
        label: 'Pet Type',
        type: 'select',
        required: true,
        options: ['dog', 'cat', 'bird', 'small-animal', 'reptile'],
      },
      {
        id: 'pet_size',
        label: 'Pet Size',
        type: 'select',
        required: true,
        options: ['small', 'medium', 'large', 'extra-large'],
      },
      {
        id: 'special_instructions',
        label: 'Special Instructions',
        type: 'textarea',
        required: false,
        placeholder: 'Any special instructions or concerns?',
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Custom configuration for any business type',
    defaultSettings: {
      industry: 'custom',
      min_booking_notice_hours: 24,
      max_attendees: 10,
      archive_after_days: 30,
      allowed_booking_types: ['consultation', 'appointment', 'meeting', 'class', 'event'],
      secure_booking: false,
    },
    availableBookingTypes: ['consultation', 'appointment', 'meeting', 'class', 'event'],
  },
];

export const getIndustryById = (id: string): Industry | undefined => {
  return industries.find((industry) => industry.id === id);
};

export const getDefaultSettingsForIndustry = (id: string): Partial<EmbedSettings> => {
  const industry = getIndustryById(id);
  return industry?.defaultSettings || industries.find((i) => i.id === 'custom')?.defaultSettings || {};
}; 