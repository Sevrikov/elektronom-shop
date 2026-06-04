import { z } from 'zod'

export const CustomLoadInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'nameRequired').max(100, 'nameTooLong'),
  kind: z.enum([
    'lighting',
    'socket_group',
    'kitchen_socket',
    'bathroom_socket',
    'boiler',
    'washing_machine',
    'dishwasher',
    'oven',
    'hob',
    'conditioner',
    'router',
    'warm_floor',
    'ev_charger',
    'pump',
    'gate_motor',
    'server_rack',
    'router_cctv',
    'workshop_tool',
    'welder',
    'compressor',
    'generator_input',
    'inverter_input',
    'battery_system',
    'custom',
  ]),
  room: z.string().min(1, 'roomRequired').max(100, 'roomTooLong'),
  areaZone: z.enum(['dry', 'damp', 'bathroom_zone_0', 'bathroom_zone_1', 'bathroom_zone_2', 'outdoor']).optional(),
  powerW: z.number({ message: 'powerRequired' }).min(1, 'powerMin').max(100000, 'powerMax'),
  phase: z.union([z.literal(1), z.literal(3)]),
  voltage: z.union([z.literal(230), z.literal(400)]),
  duty: z.enum(['continuous', 'intermittent', 'startup-heavy']).optional(),
  startupCurrentMultiplier: z.number().min(1).max(10).optional(),
  critical: z.boolean(),
  reservePowerRequired: z.boolean(),
  dedicatedLineRequired: z.union([z.boolean(), z.literal('auto')]),
  routeLengthM: z.number({ message: 'routeRequired' }).min(1, 'routeMin').max(300, 'routeMax'),
  connectionType: z.enum(['socket', 'fixed', 'junction-box', 'panel-direct']).optional(),
  userNote: z.string().max(500).optional(),
}).refine((data) => {
  if (data.phase === 3) {
    return data.voltage === 400
  } else {
    return data.voltage === 230
  }
}, {
  message: 'voltageMismatch',
  path: ['voltage'],
})

export const EngineeringProjectInputSchema = z.object({
  type: z.enum(['apartment', 'house', 'office', 'garage']),
  areaM2: z.number().min(20).max(300),
  rooms: z.number().min(1).max(12),
  bathrooms: z.number().min(1).max(5),
  phase: z.union([z.literal(1), z.literal(3)]),
  inputBreakerA: z.number().min(16).max(63),
  hasElectricHob: z.boolean(),
  hasOven: z.boolean(),
  hasBoiler: z.boolean(),
  hasWasher: z.boolean(),
  hasDishwasher: z.boolean(),
  hasConditioner: z.boolean(),
  includeWeakCurrent: z.boolean(),
  routeLengthM: z.number().min(5).max(120),
  safetyLevel: z.enum(['standard', 'enhanced']),
  customLoads: z.array(CustomLoadInputSchema).optional(),
})
