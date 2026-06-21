export const EDUCATION_SECTIONS = [
  {
    id: 'carbon-basics',
    title: 'Understanding Carbon Footprint',
    icon: 'Globe',
    content: `Your carbon footprint is the total greenhouse gas emissions caused by your activities, expressed in CO₂ equivalents (CO₂e).

**Why it matters for Mumbai:**
- Mumbai's per capita emissions are ~1.5 tonnes/year (urban)
- The city faces severe air quality issues — transport contributes 30% of emissions
- Rising sea levels threaten coastal areas by 2050

**Key sources in India:**
1. **Electricity** — Maharashtra grid: 0.82 kg CO₂/kWh
2. **Transport** — Cars, autos, and flights are major contributors
3. **Food** — Meat production emits 5-10x more than plants
4. **Waste** — Landfill methane is 25x more potent than CO₂`,
    tips: [
      'Track daily habits to find your biggest emission sources',
      'Small changes compound over time — 1 kg/day saved = 365 kg/year',
    ],
  },
  {
    id: 'electricity-india',
    title: 'Electricity in Maharashtra',
    icon: 'Zap',
    content: `Maharashtra's electricity mix is evolving but still coal-heavy.

**Grid emission factor:** ~0.82 kg CO₂ per kWh (2023 CEA data)

**Typical Mumbai household usage:**
| Appliance | Daily kWh | Monthly CO₂ |
|-----------|-----------|-------------|
| 1.5T AC (6hrs) | 7.2 | 177 kg |
| Refrigerator | 1.5 | 37 kg |
| Fans (3×8hrs) | 0.9 | 22 kg |
| LED lights | 0.3 | 7 kg |

**Tips for Mumbai:**
- Use ceiling fans before AC — saves 90% energy
- Run AC at 26°C with fan for comfort
- Switch to LED — payback in 3 months
- Use timer plugs for geysers`,
    tips: [
      'Peak hours (6-10 PM) have higher grid stress — shift heavy loads',
      'BEE 5-star appliances save 20-30% electricity',
    ],
  },
  {
    id: 'transport-mumbai',
    title: 'Getting Around Mumbai',
    icon: 'Train',
    content: `Mumbai's transport network offers low-carbon alternatives.

**Emissions per km (kg CO₂):**
- Walk/Cycle: 0
- Local Train: 0.036
- Metro: 0.033
- Bus (BEST): 0.089
- Auto Rickshaw: 0.082
- Car (Petrol): 0.192
- Flight (Domestic): 0.255

**The Mumbai advantage:**
- Local trains carry 7.5 million daily — world's busiest
- Metro expansion reducing car dependency
- BEST electric buses rolling out

**Smart choices:**
- Local train for long commutes (Western/Central/Harbour lines)
- Metro for cross-city travel
- Walk for distances under 1 km
- Carpool via office/colony groups`,
    tips: [
      'One local train trip vs car saves ~1.5 kg CO₂ per 10 km',
      'Combine errands into one trip to reduce total km',
    ],
  },
  {
    id: 'food-emissions',
    title: 'Food & Diet Impact',
    icon: 'Salad',
    content: `What you eat significantly affects your footprint.

**Emissions per meal (kg CO₂):**
- Vegan meal: 0.8
- Vegetarian (Indian): 1.2
- Chicken meal: 3.5
- Mutton meal: 7.0
- Beef meal: 12.0

**Indian context:**
- Traditional vegetarian diet is naturally low-carbon
- Dairy (ghee, paneer, milk) adds ~1.9 kg CO₂ per serving
- Food waste in India: 68 million tonnes/year

**Reduce your food footprint:**
- Embrace traditional plant-based meals (dal, sabzi, roti)
- Buy from local markets (Crawford, Dadar, Borivali)
- Cook in batches to reduce LPG usage
- Compost kitchen waste`,
    tips: [
      'Meatless Monday alone saves ~170 kg CO₂/year',
      'Local seasonal produce has 5x lower transport emissions',
    ],
  },
  {
    id: 'waste-recycling',
    title: 'Waste & Recycling',
    icon: 'Recycle',
    content: `Mumbai generates 7,500+ tonnes of waste daily.

**BMC waste segregation (2024 rules):**
1. **Wet waste** — Kitchen scraps, compostable
2. **Dry waste** — Paper, plastic, metal, glass
3. **Hazardous** — Batteries, e-waste, medical

**Impact of recycling (kg CO₂ saved per kg):**
- Paper: 0.9
- Plastic: 1.5
- Aluminium: 9.0
- Glass: 0.3

**Mumbai initiatives:**
- Dry waste collection centers in every ward
- E-waste collection drives by BMC
- Composting mandates for bulk generators`,
    tips: [
      'Segregating waste can reduce your footprint by 15%',
      'One recycled aluminium can saves energy equal to 3 hours of TV',
    ],
  },
  {
    id: 'climate-action',
    title: 'Climate Action Goals',
    icon: 'Target',
    content: `India's climate commitments and your role.

**National targets:**
- Net zero by 2070
- 50% renewable energy by 2030
- Reduce emission intensity by 45%

**Personal sustainable target:**
- Global sustainable: ~4 tonnes CO₂/year (~11 kg/day)
- Current Mumbai urban average: ~12 kg/day
- Gap to close: ~1 kg/day through conscious choices

**High-impact actions ranked:**
1. Switch to renewable electricity / solar
2. Reduce car and flight travel
3. Plant-based diet shift
4. Energy-efficient home
5. Reduce, reuse, recycle

**Every action counts** — if 1 million Mumbaikars saved 1 kg/day, that's 365,000 tonnes CO₂/year prevented.`,
    tips: [
      'Set a personal goal of 10% reduction per quarter',
      'Share your progress — social accountability works',
    ],
  },
];