'use client';

import { Database } from '@/types/database.types';
import BaseBookingForm from './BaseBookingForm';
import BarbershopBookingForm from './BarbershopBookingForm';
import TattooBookingForm from './TattooBookingForm';
import CustomBookingForm from './CustomBookingForm';

interface BookingFormFactoryProps {
  selectedDate: string;
  selectedTime: string;
  embedId: string;
  industry: Database['public']['Enums']['industry_type'];
}

export default function BookingFormFactory({
  selectedDate,
  selectedTime,
  embedId,
  industry
}: BookingFormFactoryProps) {
  switch (industry) {
    case 'barbershop':
      return (
        <BarbershopBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
        />
      );
    case 'tattoo':
      return (
        <TattooBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
        />
      );
    case 'optometry':
      // TODO: Create OptometryBookingForm
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
    case 'dental':
      // TODO: Create DentalBookingForm
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
    case 'landscaping':
      // TODO: Create LandscapingBookingForm
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
    case 'nail-salon':
      // TODO: Create NailSalonBookingForm
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
    case 'massage':
      // TODO: Create MassageBookingForm
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
    case 'photography':
      // TODO: Create PhotographyBookingForm
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
    case 'fitness':
      // TODO: Create FitnessBookingForm
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
    case 'auto-repair':
      // TODO: Create AutoRepairBookingForm
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
    case 'pet-care':
      // TODO: Create PetCareBookingForm
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
    case 'custom':
      return (
        <CustomBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
        />
      );
    default:
      return (
        <BaseBookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          embedId={embedId}
          industry={industry}
        />
      );
  }
} 