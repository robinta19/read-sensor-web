export interface SensorResponse {
  node_id: string
  node: string
  latitude: string
  longitude: string
  metrics: Metrics
}

export interface Metrics {
  ec: number[]
  temp: number[]
  ph: number[]
  turb: number[]
  do: number[]
  timestamps: string[]
}

// 
export interface SensorNodeResponse {
  id: string
  node: string
  longitude: string
  latitude: string
  created_at: string
  updated_at: string
  latest_data: LatestData
}

export interface LatestData {
  id: string
  node_id: string
  ec: number
  temp: number
  ph: number
  do: number
  turb: number
  created_at: string
  updated_at: string
}

// latest data
export interface LatestDataResponse {
  id: string
  node: string
  longitude: string
  latitude: string
  created_at: string
  updated_at: string
  latest_data: LatestData
}

export interface LatestData {
  id: string
  node_id: string
  ec: number
  temp: number
  ph: number
  do: number
  turb: number
  created_at: string
  updated_at: string
}

// record data
export interface RecordDataResponse {
  id: string
  node_id: string
  ec: number
  temp: number
  ph: number
  turb: number
  do: number
  created_at: string
  time: string
}