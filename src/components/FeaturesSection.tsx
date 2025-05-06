import { CalendarIcon, ClockIcon, UserGroupIcon, CogIcon, BellIcon, ChartBarIcon } from './FeatureIcons';

const features = [
  {
    name: 'Easy Booking',
    description: 'Let your clients book appointments 24/7 with a simple, intuitive interface.',
    icon: CalendarIcon,
  },
  {
    name: 'Smart Scheduling',
    description: 'Automatically manage your availability and prevent double bookings.',
    icon: ClockIcon,
  },
  {
    name: 'Client Management',
    description: 'Keep track of your clients and their appointment history.',
    icon: UserGroupIcon,
  },
  {
    name: 'Customizable',
    description: 'Tailor the booking experience to match your brand and business needs.',
    icon: CogIcon,
  },
  {
    name: 'Notifications',
    description: 'Automated reminders reduce no-shows and keep everyone informed.',
    icon: BellIcon,
  },
  {
    name: 'Analytics',
    description: 'Gain insights into your booking patterns and business performance.',
    icon: ChartBarIcon,
  },
];

export default function FeaturesSection() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful features for your business
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Booking provides all the tools you need to manage your appointments efficiently and professionally.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 