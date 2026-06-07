export const mockRiders = [
  { id: '1', name: 'James Kollie', phone: '+231770001001', status: 'approved', rating: 4.8, totalTrips: 312, motorcycle: 'Honda CB150', plate: 'LB-2301', joined: '2024-01-15', earnings: 1240.50, avatar: null },
  { id: '2', name: 'Emmanuel Wleh', phone: '+231770001002', status: 'approved', rating: 4.6, totalTrips: 198, motorcycle: 'Yamaha FZ', plate: 'LB-1892', joined: '2024-02-20', earnings: 980.00, avatar: null },
  { id: '3', name: 'Moses Tarweh', phone: '+231770001003', status: 'pending', rating: 0, totalTrips: 0, motorcycle: 'Suzuki GS150', plate: 'LB-3310', joined: '2024-06-01', earnings: 0, avatar: null },
  { id: '4', name: 'David Nimely', phone: '+231770001004', status: 'suspended', rating: 3.2, totalTrips: 45, motorcycle: 'Honda Shine', plate: 'LB-0987', joined: '2024-03-10', earnings: 320.00, avatar: null },
  { id: '5', name: 'Patrick Gbaye', phone: '+231770001005', status: 'approved', rating: 4.9, totalTrips: 521, motorcycle: 'TVS Apache', plate: 'LB-4455', joined: '2023-11-05', earnings: 2100.75, avatar: null },
  { id: '6', name: 'Samuel Flomo', phone: '+231770001006', status: 'pending', rating: 0, totalTrips: 0, motorcycle: 'Bajaj Pulsar', plate: 'LB-5512', joined: '2024-06-05', earnings: 0, avatar: null },
];

export const mockPassengers = [
  { id: '1', name: 'Mariama Kamara', phone: '+231770002001', totalTrips: 45, joined: '2024-01-20', status: 'active' },
  { id: '2', name: 'Fatou Koroma', phone: '+231770002002', totalTrips: 22, joined: '2024-02-14', status: 'active' },
  { id: '3', name: 'Aminata Bah', phone: '+231770002003', totalTrips: 8, joined: '2024-05-30', status: 'active' },
  { id: '4', name: 'Joseph Tamba', phone: '+231770002004', totalTrips: 67, joined: '2023-12-01', status: 'active' },
  { id: '5', name: 'Grace Nyandebo', phone: '+231770002005', totalTrips: 3, joined: '2024-06-02', status: 'inactive' },
];

export const mockTrips = [
  { id: 'T001', passengerId: '1', passengerName: 'Mariama Kamara', riderId: '1', riderName: 'James Kollie', pickup: 'Sinkor, Monrovia', destination: 'Waterside Market', fare: 2.50, status: 'completed', date: '2024-06-06 14:22', distance: 3.2, duration: 12 },
  { id: 'T002', passengerId: '2', passengerName: 'Fatou Koroma', riderId: '5', riderName: 'Patrick Gbaye', pickup: 'Paynesville', destination: 'Capitol Building', fare: 4.00, status: 'completed', date: '2024-06-06 13:10', distance: 6.1, duration: 22 },
  { id: 'T003', passengerId: '3', passengerName: 'Aminata Bah', riderId: '2', riderName: 'Emmanuel Wleh', pickup: 'Congo Town', destination: 'Elwa Junction', fare: 1.80, status: 'cancelled', date: '2024-06-06 11:45', distance: 2.4, duration: 0 },
  { id: 'T004', passengerId: '4', passengerName: 'Joseph Tamba', riderId: '1', riderName: 'James Kollie', pickup: 'Monrovia City Hall', destination: 'Red Light Market', fare: 3.20, status: 'active', date: '2024-06-07 09:15', distance: 4.8, duration: 0 },
  { id: 'T005', passengerId: '1', passengerName: 'Mariama Kamara', riderId: '5', riderName: 'Patrick Gbaye', pickup: 'Broad Street', destination: 'Sinkor', fare: 2.00, status: 'completed', date: '2024-06-05 17:30', distance: 2.9, duration: 10 },
  { id: 'T006', passengerId: '2', passengerName: 'Fatou Koroma', riderId: '2', riderName: 'Emmanuel Wleh', pickup: 'Old Road', destination: 'Free Port', fare: 5.50, status: 'completed', date: '2024-06-05 08:00', distance: 8.3, duration: 31 },
];

export const revenueData = [
  { day: 'Mon', revenue: 48.50, trips: 22 },
  { day: 'Tue', revenue: 62.00, trips: 28 },
  { day: 'Wed', revenue: 55.20, trips: 25 },
  { day: 'Thu', revenue: 71.80, trips: 33 },
  { day: 'Fri', revenue: 89.40, trips: 41 },
  { day: 'Sat', revenue: 104.60, trips: 48 },
  { day: 'Sun', revenue: 78.30, trips: 36 },
];

export const monthlyData = [
  { month: 'Jan', revenue: 820, trips: 380 },
  { month: 'Feb', revenue: 940, trips: 430 },
  { month: 'Mar', revenue: 1100, trips: 510 },
  { month: 'Apr', revenue: 1050, trips: 490 },
  { month: 'May', revenue: 1280, trips: 590 },
  { month: 'Jun', revenue: 680, trips: 310 },
];

export const rideHistory = [
  { id: 'T001', date: 'Jun 6, 2024 · 2:22 PM', pickup: 'Sinkor', destination: 'Waterside Market', fare: 2.50, status: 'completed', rider: 'James Kollie', rating: 5 },
  { id: 'T005', date: 'Jun 5, 2024 · 5:30 PM', pickup: 'Broad Street', destination: 'Sinkor', fare: 2.00, status: 'completed', rider: 'Patrick Gbaye', rating: 4 },
  { id: 'T003', date: 'Jun 5, 2024 · 11:45 AM', pickup: 'Congo Town', destination: 'Elwa Junction', fare: 1.80, status: 'cancelled', rider: 'Emmanuel Wleh', rating: null },
  { id: 'T009', date: 'Jun 3, 2024 · 8:00 AM', pickup: 'Paynesville', destination: 'Monrovia City Hall', fare: 3.80, status: 'completed', rider: 'James Kollie', rating: 5 },
];
