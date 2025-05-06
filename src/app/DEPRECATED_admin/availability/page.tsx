'use client';
import useAdminAvailability from '@/hooks/useAdminAvailability';
import Spinner from '@/components/ui/Spinner';

export default function AdminAvailabilityPage() {
  const {
    groupedSlots,
    selectedDays,
    showControls,
    handleToggleAllDays,
    handleDayToggle,
    handlePopulateTimeSlots,
    handleResetAll,
    handleSignOut,
    loading,
    setShowControls,
    timeRange,
    setTimeRange,
    daysOfWeek,
    handleUpdateTimeRange,
    handleDeleteGroup,
  } = useAdminAvailability();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }


  return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowControls(!showControls)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {showControls ? 'Hide Controls' : 'Add Time Slots'}
                      </button>
                      <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? 'Signing out...' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
  
                  {showControls && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Populate</h3>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Select Days
                          </label>
                          <button
                            onClick={handleToggleAllDays}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            {selectedDays.length === daysOfWeek.length ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {daysOfWeek.map((day) => (
                            <button
                              key={day.id}
                              onClick={() => handleDayToggle(groupedSlots[0], day.id)}
                              className={`
                                p-2 rounded-md text-center
                                ${selectedDays.includes(day.id)
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                              `}
                            >
                              {day.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
                            Start Time
                          </label>
                          <input
                            type="time"
                            id="start-time"
                            value={timeRange.start}
                            onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">
                            End Time
                          </label>
                          <input
                            type="time"
                            id="end-time"
                            value={timeRange.end}
                            onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
                            Interval (minutes)
                          </label>
                          <select
                            id="interval"
                            value={timeRange.interval}
                            onChange={(e) => setTimeRange({ ...timeRange, interval: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-4">
                        <button
                          onClick={handlePopulateTimeSlots}
                          disabled={selectedDays.length === 0}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          Populate Time Slots
                        </button>
                        <button
                          onClick={handleResetAll}
                          className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reset All
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {groupedSlots.map((group, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <input
                              type="time"
                              value={group.start_time}
                              onChange={(e) => handleUpdateTimeRange(group, 'start_time', e.target.value)}
                              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={group.end_time}
                              onChange={(e) => handleUpdateTimeRange(group, 'end_time', e.target.value)}
                              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <input
                              type="number"
                              value={group.buffer_minutes}
                              onChange={(e) => handleUpdateTimeRange(group, 'buffer_minutes', Number(e.target.value))}
                              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder="Buffer (min)"
                            />
                          </div>
                          <button
                            onClick={() => handleDeleteGroup(group)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          {daysOfWeek.map((day) => (
                            <button
                              key={day.id}
                              onClick={() => handleDayToggle(group, day.id)}
                              className={`
                                w-8 h-8 rounded-full border text-xs font-thin
                                ${group.days.includes(day.id)
                                  ? 'bg-green-500 text-white border-green-600'
                                  : 'bg-gray-100 text-gray-400 border-gray-300'
                                }
                              `}
                            >
                              {day.name.charAt(0)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
} 