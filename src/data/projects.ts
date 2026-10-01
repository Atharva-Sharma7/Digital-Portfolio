export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  // TODO: Replace these placeholder descriptions with your actual project copy
  headline: string;
  description: string;
  tech: string[];
  accent: string;
  size: 'large' | 'medium';
  thumbnail?: string;   // path inside /public
  liveUrl?: string;     // external link for click-through
}

export const projects: Project[] = [
  {
    id: 'vaahan-bridge',
    index: '01',
    title: 'VaahanBridge',
    category: 'Hardware · ML · IoT',
    // TODO: Refine this headline and description
    headline: 'Intelligent vehicular data bridge',
    description: 'A system that bridges real-time vehicular telemetry with cloud intelligence, enabling predictive analytics and connected vehicle interactions. Built on embedded hardware with ML inference at the edge.',
    tech: ['Python', 'Embedded C', 'Machine Learning', 'IoT', 'MQTT'],
    accent: '#00f0ff',
    size: 'large',
    thumbnail: '/thumbnails/vaahan.png',
    liveUrl: 'https://vaahanbridge.netlify.app/',
  },
  {
    id: 'nexus-mesh',
    index: '02',
    title: 'NexusMesh',
    category: 'Embedded · Networking',
    // TODO: Refine this headline and description
    headline: 'Decentralized IoT mesh network',
    description: 'A self-healing mesh network architecture for low-power IoT devices. Nodes discover each other autonomously, route around failures, and maintain a shared state without a central coordinator.',
    tech: ['C++', 'Embedded Systems', 'MQTT', 'RF Comms'],
    accent: '#7b2fff',
    size: 'medium',
    thumbnail: '/thumbnails/nexus.png',
    liveUrl: 'https://nexusmesh.vercel.app/',
  },
  {
    id: 'medical-rescue-drone',
    index: '03',
    title: 'Medical Rescue Drone',
    category: 'Robotics · Autonomous Systems',
    // TODO: Refine this headline and description
    headline: 'Autonomous medical payload delivery',
    description: 'A drone system designed for rapid deployment to inaccessible terrain, carrying emergency medical supplies. Features GPS-guided autonomous flight, obstacle awareness, and controlled landing sequences.',
    tech: ['C', 'Flight Controller', 'GPS Nav', 'PID Control', 'Hardware'],
    accent: '#00f0ff',
    size: 'medium',
  },
  {
    id: 'agri-uav-swarm',
    index: '04',
    title: 'Agricultural UAV Swarm',
    category: 'Robotics · AI · CV',
    // TODO: Refine this headline and description
    headline: 'Coordinated multi-UAV precision farming',
    description: 'A swarm of UAVs performing coordinated area coverage for crop health monitoring. Computer vision identifies anomalies in real-time; swarm logic distributes tasks dynamically across agents.',
    tech: ['Python', 'Computer Vision', 'Swarm Algorithms', 'ROS', 'OpenCV'],
    accent: '#7b2fff',
    size: 'large',
  },
];
