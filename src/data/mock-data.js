// Generate mock data for the dashboard
export const generateMockData = () => {
  // Generate miners
  const miners = Array.from({ length: 20 }, (_, i) => {
    const id = `M${1000 + i}`
    const name = getRandomName()
    const status = getRandomStatus()
    const oxygenLevel = getRandomOxygenLevel(status)
    const temperature = getRandomTemperature(status)

    return {
      id,
      name,
      position: getRandomPosition(),
      shift: getRandomShift(),
      status,
      location: getRandomLocation(),
      oxygenLevel,
      temperature,
      batteryLevel: Math.floor(Math.random() * 100),
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    }
  })

  // Generate oxygen history
  const oxygenHistory = Array.from({ length: 24 }, (_, i) => {
    const timestamp = new Date(Date.now() - (23 - i) * 3600000).toISOString()
    return {
      timestamp,
      oxygenLevel: 19 + Math.random() * 3,
    }
  })

  // Generate temperature history
  const temperatureHistory = Array.from({ length: 24 }, (_, i) => {
    const timestamp = new Date(Date.now() - (23 - i) * 3600000).toISOString()
    return {
      timestamp,
      temperature: 22 + Math.random() * 10,
    }
  })

  // Generate alerts
  const alerts = Array.from({ length: 15 }, (_, i) => {
    const miner = miners[Math.floor(Math.random() * miners.length)]
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString()
    const type = getRandomAlertType()
    const severity = getRandomSeverity()

    return {
      id: `A${1000 + i}`,
      minerId: miner.id,
      minerName: miner.name,
      type,
      message: getAlertMessage(type, miner.name, miner.location),
      timestamp,
      severity,
      status: getRandomAlertStatus(),
    }
  })

  return {
    miners,
    oxygenHistory,
    temperatureHistory,
    alerts,
  }
}

// Generate mock miners
export const generateMockMiners = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const id = `M${1000 + i}`
    const name = getRandomName()
    const status = getRandomStatus()
    const oxygenLevel = getRandomOxygenLevel(status)
    const temperature = getRandomTemperature(status)

    return {
      id,
      name,
      position: getRandomPosition(),
      shift: getRandomShift(),
      status,
      location: getRandomLocation(),
      oxygenLevel,
      temperature,
      batteryLevel: Math.floor(Math.random() * 100),
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    }
  })
}

// Generate mock alerts
export const generateMockAlerts = (count) => {
  const miners = generateMockMiners(10)

  return Array.from({ length: count }, (_, i) => {
    const miner = miners[Math.floor(Math.random() * miners.length)]
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString()
    const type = getRandomAlertType()
    const severity = getRandomSeverity()

    return {
      id: `A${1000 + i}`,
      minerId: miner.id,
      minerName: miner.name,
      type,
      message: getAlertMessage(type, miner.name, miner.location),
      timestamp,
      severity,
      status: getRandomAlertStatus(),
    }
  })
}

// Generate historical data
export const generateHistoricalData = (dateRange, minerId, dataType) => {
  // Generate oxygen data
  const oxygenData = Array.from({ length: 50 }, (_, i) => {
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString()
    return {
      timestamp,
      oxygenLevel: 19 + Math.random() * 3,
      minerId: minerId || `M${1000 + Math.floor(Math.random() * 20)}`,
    }
  })

  // Generate temperature data
  const temperatureData = Array.from({ length: 50 }, (_, i) => {
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString()
    return {
      timestamp,
      temperature: 22 + Math.random() * 10,
      minerId: minerId || `M${1000 + Math.floor(Math.random() * 20)}`,
    }
  })

  // Generate alerts data
  const alertsData = Array.from({ length: 30 }, (_, i) => {
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString()
    const type = getRandomAlertType()
    const severity = getRandomSeverity()

    return {
      timestamp,
      alertType: type,
      severity,
      minerId: minerId || `M${1000 + Math.floor(Math.random() * 20)}`,
    }
  })

  return {
    oxygenData,
    temperatureData,
    alertsData,
  }
}

// Helper functions
const getRandomName = () => {
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Lisa",
    "Robert",
    "Emily",
    "William",
    "Olivia",
    "James",
    "Sophia",
    "Charles",
    "Emma",
    "Thomas",
    "Ava",
    "Daniel",
    "Mia",
    "Matthew",
    "Isabella",
  ]

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
  ]

  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}

const getRandomPosition = () => {
  const positions = [
    "Driller",
    "Blaster",
    "Equipment Operator",
    "Safety Officer",
    "Supervisor",
    "Technician",
    "Engineer",
    "Geologist",
    "Electrician",
    "Mechanic",
  ]

  return positions[Math.floor(Math.random() * positions.length)]
}

const getRandomShift = () => {
  const shifts = ["Morning", "Afternoon", "Night"]
  return shifts[Math.floor(Math.random() * shifts.length)]
}

const getRandomStatus = () => {
  const statuses = ["active", "inactive", "warning", "danger"]
  const weights = [0.7, 0.1, 0.15, 0.05] // 70% active, 10% inactive, 15% warning, 5% danger

  const random = Math.random()
  let sum = 0

  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i]
    if (random < sum) {
      return statuses[i]
    }
  }

  return statuses[0]
}

const getRandomLocation = () => {
  const shafts = ["Shaft 1", "Shaft 2", "Shaft 3", "Shaft 4", "Shaft 5"]
  const levels = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"]

  return `${shafts[Math.floor(Math.random() * shafts.length)]}, ${levels[Math.floor(Math.random() * levels.length)]}`
}

const getRandomOxygenLevel = (status) => {
  switch (status) {
    case "active":
      return 20 + Math.random()
    case "warning":
      return 19 + Math.random()
    case "danger":
      return 18 + Math.random()
    default:
      return 20 + Math.random()
  }
}

const getRandomTemperature = (status) => {
  switch (status) {
    case "active":
      return 22 + Math.random() * 5
    case "warning":
      return 28 + Math.random() * 2
    case "danger":
      return 30 + Math.random() * 3
    default:
      return 22 + Math.random() * 5
  }
}

const getRandomAlertType = () => {
  const types = [
    "Low Oxygen",
    "High Temperature",
    "Panic Button",
    "Battery Low",
    "Connection Lost",
    "Movement Detected",
    "Gas Detected",
    "Helmet Removed",
    "Fall Detected",
  ]

  return types[Math.floor(Math.random() * types.length)]
}

const getRandomSeverity = () => {
  const severities = ["low", "medium", "high", "critical"]
  const weights = [0.4, 0.3, 0.2, 0.1] // 40% low, 30% medium, 20% high, 10% critical

  const random = Math.random()
  let sum = 0

  for (let i = 0; i < severities.length; i++) {
    sum += weights[i]
    if (random < sum) {
      return severities[i]
    }
  }

  return severities[0]
}

const getRandomAlertStatus = () => {
  const statuses = ["new", "acknowledged", "resolved"]
  const weights = [0.5, 0.3, 0.2] // 50% new, 30% acknowledged, 20% resolved

  const random = Math.random()
  let sum = 0

  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i]
    if (random < sum) {
      return statuses[i]
    }
  }

  return statuses[0]
}

const getAlertMessage = (type, minerName, location) => {
  switch (type) {
    case "Low Oxygen":
      return `Oxygen level below threshold for ${minerName} at ${location}`
    case "High Temperature":
      return `Temperature exceeding safe levels for ${minerName} at ${location}`
    case "Panic Button":
      return `Panic button activated by ${minerName} at ${location}`
    case "Battery Low":
      return `Helmet battery low for ${minerName} at ${location}`
    case "Connection Lost":
      return `Connection lost with ${minerName}'s helmet at ${location}`
    case "Movement Detected":
      return `Unusual movement detected for ${minerName} at ${location}`
    case "Gas Detected":
      return `Hazardous gas detected near ${minerName} at ${location}`
    case "Helmet Removed":
      return `Helmet removed by ${minerName} at ${location}`
    case "Fall Detected":
      return `Possible fall detected for ${minerName} at ${location}`
    default:
      return `Alert for ${minerName} at ${location}`
  }
}

