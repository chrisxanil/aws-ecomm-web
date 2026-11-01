-- =======================================================
-- NexaCart AI Database Seed Data (INR / Rupee Pricing)
-- =======================================================

USE nexacart_db;

-- 1. Insert Categories
INSERT INTO categories (id, name, slug, description, icon) VALUES
(1, 'Neural Processors & TPUs', 'neural-processors', 'High-density tensor computing accelerators and quantum neural cores.', 'Cpu'),
(2, 'Autonomous Robotics & Drones', 'autonomous-robotics', 'Edge-intelligence drones, robotic arms, and autonomous rover units.', 'Bot'),
(3, 'Smart Bio & Neuro Wearables', 'neuro-wearables', 'Brain-computer interface headbands, haptic gloves, and biometric trackers.', 'Activity'),
(4, 'Holographic & Vision Systems', 'vision-systems', 'Light-field volumetric displays and multi-sensor spatial lidar rigs.', 'Eye'),
(5, 'Edge AI & Smart Hubs', 'edge-hubs', 'Zero-latency local neural inference servers and smart automation towers.', 'Server')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Users (Password: Password123!)
INSERT INTO users (id, name, email, password, role, avatar, phone, address) VALUES
(1, 'Admin Commander', 'admin@nexacart.ai', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.qHqX5yQy6k5x5YV8KqE/h1fPzT06J2C', 'admin', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', '+91 98765 43210', 'Nexa Research Labs, Cyber City, Gurugram, HR 122002'),
(2, 'Alex Vance', 'alex@nexacart.ai', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.qHqX5yQy6k5x5YV8KqE/h1fPzT06J2C', 'user', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', '+91 98110 12345', 'Flat 402, Neo Tech Heights, Whitefield, Bengaluru, KA 560066')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 3. Insert Sample Products (Prices in INR)
INSERT INTO products (id, name, slug, category_id, category_name, price, original_price, stock, rating, reviews_count, badge, is_featured, image_url, description, features) VALUES
(1, 'Nexa Quantum NPU-900', 'nexa-quantum-npu-900', 1, 'Neural Processors & TPUs', 124999.00, 149999.00, 18, 4.95, 42, 'Bestseller', 1, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80', 'The pinnacle of edge AI acceleration. Engineered with 980 Neural TOPS, dedicated FP8 matrix engines, and PCIe 5.0 architecture.', '{"TOPS": "980 TOPS", "Memory Bandwidth": "1.2 TB/s HBM3e", "Power": "220W TDP", "Architecture": "TensorVortx Gen 4"}'),
(2, 'Synapse Core X1 Module', 'synapse-core-x1-module', 1, 'Neural Processors & TPUs', 53999.00, 62499.00, 35, 4.82, 28, 'Popular', 1, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', 'Compact 45W embedded coprocessor designed for drones and autonomous computer vision.', '{"TOPS": "145 TOPS", "Memory": "32GB LPDDR5X", "Form Factor": "SODIMM 260-Pin"}'),
(3, 'CyberDrone Vision 4K', 'cyberdrone-vision-4k', 2, 'Autonomous Robotics & Drones', 107999.00, 124999.00, 14, 4.88, 31, 'New Era', 1, 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', 'Fully autonomous hexacopter equipped with onboard LiDAR and neural computer vision.', '{"Flight Duration": "48 Minutes", "Vision": "360° Omnidirectional LiDAR", "Range": "15 KM"}'),
(4, 'NeuroSync Focus Band V2', 'neurosync-focus-band-v2', 3, 'Smart Bio & Neuro Wearables', 32999.00, 37499.00, 40, 4.79, 53, 'Hot Seller', 1, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', 'Next-generation non-invasive EEG headband that measures cognitive load and optimizes flow state.', '{"Sensors": "8 Medical-grade Electrodes", "Sample Rate": "1000 Hz", "Battery": "14 Hours"}'),
(5, 'HoloVision AR Neural Glasses', 'holovision-ar-neural-glasses', 3, 'Smart Bio & Neuro Wearables', 74999.00, 91499.00, 25, 4.86, 37, 'Flagship', 1, 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80', 'Ultra-lightweight titanium smart glasses with Micro-OLED waveguide optics and real-time AI HUD.', '{"Display": "Dual 4K Micro-OLED", "FOV": "52 Degrees", "Weight": "68 grams"}'),
(6, 'PrismSpatial 3D Hologram Display', 'prismspatial-3d-hologram-display', 4, 'Holographic & Vision Systems', 145999.00, 166499.00, 11, 4.94, 26, 'Futuristic', 1, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80', 'Glasses-free 3D light field display projecting interactive volumetric AI avatars and CAD models.', '{"Screen": "16-inch 8K Volumetric", "View Angle": "100 Parallax", "Eye Tracking": "Dual Gaze"}'),
(7, 'Nexa Cortex Home Master Tower', 'nexa-cortex-home-master-tower', 5, 'Edge AI & Smart Hubs', 66499.00, 74999.00, 30, 4.89, 48, 'Popular', 1, 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80', 'Private localized smart intelligence running offline LLMs with Matter, Thread and Zigbee support.', '{"Local AI": "Llama-3-8B & Whisper Local", "Storage": "2TB NVMe Gen4", "Security": "TPM 2.0"}')
ON DUPLICATE KEY UPDATE name=VALUES(name);
