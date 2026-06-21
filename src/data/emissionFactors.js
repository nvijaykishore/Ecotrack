// Emission factors — India/Mumbai defaults (kg CO2e unless noted)
// Sources approximated from CEA grid data, IPCC, and Indian transport studies

export const GRID_EMISSION_FACTOR = 0.82; // kg CO2/kWh — Maharashtra grid average

export const ELECTRICITY = {
  unit: 'kWh',
  factor: GRID_EMISSION_FACTOR,
  label: 'Electricity',
  icon: 'Zap',
  description: 'Maharashtra state grid average (CEA 2023)',
};

export const TRANSPORT = {
  car_petrol: { factor: 0.192, unit: 'km', label: 'Car (Petrol)', icon: 'Car' },
  car_diesel: { factor: 0.171, unit: 'km', label: 'Car (Diesel)', icon: 'Car' },
  car_cng: { factor: 0.125, unit: 'km', label: 'Car (CNG)', icon: 'Car' },
  car_pooling: { factor: 0.096, unit: 'km', label: 'Car Pooling', icon: 'Users' },
  auto_rickshaw: { factor: 0.082, unit: 'km', label: 'Auto Rickshaw', icon: 'Car' },
  bus: { factor: 0.089, unit: 'km', label: 'Bus (Mumbai BEST)', icon: 'Bus' },
  local_train: { factor: 0.036, unit: 'km', label: 'Local Train', icon: 'Train' },
  metro: { factor: 0.033, unit: 'km', label: 'Metro', icon: 'Train' },
  bike: { factor: 0.113, unit: 'km', label: 'Motorcycle', icon: 'Bike' },
  flight_domestic: { factor: 0.255, unit: 'km', label: 'Flight (Domestic)', icon: 'Plane' },
  flight_international: { factor: 0.195, unit: 'km', label: 'Flight (International)', icon: 'Plane' },
  walk_cycle: { factor: 0, unit: 'km', label: 'Walk / Cycle', icon: 'Footprints' },
};

export const FOOD = {
  vegetarian_meal: { factor: 1.2, unit: 'meal', label: 'Vegetarian Meal', icon: 'Leaf' },
  nonveg_meal: { factor: 3.5, unit: 'meal', label: 'Non-Veg Meal', icon: 'Beef' },
  vegan_meal: { factor: 0.8, unit: 'meal', label: 'Vegan Meal', icon: 'Salad' },
  dairy: { factor: 1.9, unit: 'serving', label: 'Dairy Serving', icon: 'Milk' },
  packaged_snack: { factor: 0.5, unit: 'item', label: 'Packaged Snack', icon: 'Cookie' },
  restaurant: { factor: 2.8, unit: 'meal', label: 'Restaurant Meal', icon: 'UtensilsCrossed' },
};

export const HOME = {
  lpg_cylinder: { factor: 42.5, unit: 'cylinder', label: 'LPG Cylinder (14.2kg)', icon: 'Flame' },
  piped_gas: { factor: 2.0, unit: 'm³', label: 'Piped Natural Gas', icon: 'Flame' },
  water_heating: { factor: 0.45, unit: 'kWh', label: 'Water Heating', icon: 'Droplets' },
  ac_usage: { factor: 0.82, unit: 'kWh', label: 'AC Usage', icon: 'Wind' },
  waste_kg: { factor: 0.57, unit: 'kg', label: 'Mixed Waste', icon: 'Trash2' },
  recycling_kg: { factor: -0.3, unit: 'kg', label: 'Recycled Material', icon: 'Recycle' },
};

export const SHOPPING = {
  clothing_item: { factor: 8.5, unit: 'item', label: 'Clothing Item', icon: 'Shirt' },
  electronics: { factor: 45, unit: 'item', label: 'Electronics', icon: 'Smartphone' },
  online_delivery: { factor: 1.8, unit: 'order', label: 'Online Delivery', icon: 'Package' },
  plastic_bags: { factor: 0.033, unit: 'bag', label: 'Plastic Bag', icon: 'ShoppingBag' },
};

export const CATEGORIES = {
  electricity: { label: 'Electricity', color: '#f59e0b', items: ELECTRICITY },
  transport: { label: 'Transport', color: '#3b82f6', items: TRANSPORT },
  food: { label: 'Food', color: '#22c55e', items: FOOD },
  home: { label: 'Home & Energy', color: '#ef4444', items: HOME },
  shopping: { label: 'Shopping', color: '#a855f7', items: SHOPPING },
};

export const LOG_CATEGORIES = [
  { id: 'electricity', label: 'Electricity', items: [{ id: 'electricity', ...ELECTRICITY }] },
  { id: 'transport', label: 'Transport', items: Object.entries(TRANSPORT).map(([id, v]) => ({ id, ...v })) },
  { id: 'food', label: 'Food', items: Object.entries(FOOD).map(([id, v]) => ({ id, ...v })) },
  { id: 'home', label: 'Home & Energy', items: Object.entries(HOME).map(([id, v]) => ({ id, ...v })) },
  { id: 'shopping', label: 'Shopping', items: Object.entries(SHOPPING).map(([id, v]) => ({ id, ...v })) },
];

export const MUMBAI_AVERAGES = {
  dailyFootprint: 12.4, // kg CO2e/day — urban Indian average
  monthlyFootprint: 372,
  annualFootprint: 4464,
  globalAverage: 16.5,
  sustainableTarget: 4.0, // tonnes/year = ~11 kg/day
  indiaAverage: 1.9, // tonnes/year per capita (low, but urban higher)
  urbanIndiaDaily: 10.8,
};

export function getEmissionFactor(category, itemId) {
  const cat = CATEGORIES[category];
  if (!cat) return 0;
  if (category === 'electricity') return ELECTRICITY.factor;
  return cat.items[itemId]?.factor ?? 0;
}

export function calculateEmissions(category, itemId, quantity) {
  const factor = getEmissionFactor(category, itemId);
  return Math.round(factor * quantity * 100) / 100;
}