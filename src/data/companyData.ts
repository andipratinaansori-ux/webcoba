export interface ServiceItem {
  title: string;
  description: string;
  items: string[];
}

export interface SolutionItem {
  id: string;
  title: string;
  description: string;
  items: string[];
  iconName: string;
}

export interface BrandItem {
  name: string;
  category: 'Security' | 'Network' | 'Cloud & Datacenter' | 'Software & IT Ops';
  description?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  description?: string;
  iconName?: string;
}

export interface ClientItem {
  name: string;
  category: 'Telecommunications' | 'Finance & Insurance' | 'Government & Public' | 'Enterprise & Professional';
}

export const OVERVIEW_TEXT = {
  companyName: "PT. Qualita Global Teknologi",
  tagline: "Your Trusted System Integrator & IT Solution Provider",
  description: "We are a SISTEM INTEGRATOR and SOLUTION PROVIDER with a fast-growing group of IT companies focusing on providing IT products, services and solutions. We provide a wide range of IT solutions and services designed to help businesses optimize their digital transformation and build secure, resilient, and scalable IT environments.",
};

export const SERVICES: ServiceItem[] = [
  {
    title: "Professional Services",
    description: "End-to-end expertise guiding your IT transformation from requirement analysis to full-scale deployment.",
    items: [
      "User Requirement Analysis",
      "Assessment & Health Check",
      "Design & Architecture Planning",
      "Configuration and Integration",
      "Implementation & Deployment"
    ]
  },
  {
    title: "Maintenance Services",
    description: "Reliable post-implementation support to ensure business continuity, stability, and fast incident resolution.",
    items: [
      "Remote Support (24/7 Service Desk)",
      "Email or Phone Support",
      "Onsite Engineering Support",
      "Corrective & Preventive Maintenance",
      "Change Request & RMA Hardware Management"
    ]
  },
  {
    title: "Manage Services",
    description: "Comprehensive managed operations with dedicated support to take the complexity out of day-to-day IT management.",
    items: [
      "24x7 Standby Engineers",
      "Proactive Network & Security Monitoring",
      "Service Level Agreement (SLA) Guarantee",
      "Regular Performance & Incident Reporting",
      "On-demand Infrastructure Optimization"
    ]
  },
  {
    title: "Vulnerability Assessment & Pentest",
    description: "Proactive security evaluation to find and remediate weaknesses in your system before malicious actors exploit them.",
    items: [
      "Network Discovery & Asset Mapping",
      "Automated Vulnerability Scanning",
      "Greybox & Blackbox Penetration Testing",
      "Detailed Executive & Technical Reporting",
      "Security Remediation Guidance"
    ]
  }
];

export const SOLUTIONS: SolutionItem[] = [
  {
    id: "network-wireless-security",
    title: "Network, Wireless, & Security",
    description: "Comprehensive, secure networking solutions connecting your business with speed, reliability, and robust cyber protection.",
    items: [
      "Enterprise Routing & Switching",
      "Wireless LAN & Controller (WLC)",
      "Next-Gen Firewalls & Cyber Security",
      "Software-Defined WAN (SD-WAN)"
    ],
    iconName: "Network"
  },
  {
    id: "data-center-infrastructure",
    title: "Data Center Infrastructure",
    description: "Next-generation compute, storage, backup, and environment management systems designed for maximum uptime and scalability.",
    items: [
      "High-Performance Servers & Storage",
      "Structured Cabling Solutions",
      "Uninterruptible Power Supply (UPS)",
      "Smart Cooling & Hot/Cold Aisle Containment",
      "Virtualization & Operating Systems",
      "Enterprise IT Infrastructure Solutions"
    ],
    iconName: "Server"
  },
  {
    id: "security-systems",
    title: "Security Systems & Identity Access",
    description: "Protecting your digital identities, systems, and physical premises with modern cybersecurity and monitoring protocols.",
    items: [
      "Privileged Account/Session Management (PAM/PIM)",
      "Mobile Device Management (MDM)",
      "Multi-Factor Authentication (MFA / 2FA)",
      "CCTV Surveillance & Monitoring",
      "Smart Access Doors & Biometric Security"
    ],
    iconName: "ShieldCheck"
  },
  {
    id: "voice-video",
    title: "Voice & Video Collaboration",
    description: "Seamless, high-definition communication systems that bring teams together and enable frictionless B2B collaboration.",
    items: [
      "IP Telephony & PBX Systems",
      "High-Definition Video Conference Systems",
      "Smart Meeting Room Solutions",
      "Unified Communications as a Service (UCaaS)"
    ],
    iconName: "Video"
  },
  {
    id: "it-supply",
    title: "Enterprise IT Supply",
    description: "Reliable procurement of premium hardware and office technology essentials from leading global manufacturers.",
    items: [
      "Corporate Notebooks, PCs & Workstations",
      "Enterprise Printing & Imaging Solutions",
      "Authorized IT Consumables & Accessories",
      "Software Licensing & SaaS Provisioning"
    ],
    iconName: "Laptop"
  }
];

export const BRANDS: BrandItem[] = [
  { name: "Huawei", category: "Network", description: "Broad range of enterprise networking and telecom infrastructure" },
  { name: "Dell Technologies", category: "Cloud & Datacenter", description: "Industry-leading servers, enterprise storage, and workstation PCs" },
  { name: "Fortinet", category: "Security", description: "Fortigate next-generation firewalls and unified security fabrics" },
  { name: "Palo Alto Networks", category: "Security", description: "Premium cybersecurity and zero-trust firewall engineering" },
  { name: "Trend Micro", category: "Security", description: "Global leader in enterprise cloud security and threat defense" },
  { name: "Veeam", category: "Cloud & Datacenter", description: "Automated backup, replication, and cloud data protection software" },
  { name: "ManageEngine", category: "Software & IT Ops", description: "Comprehensive IT management software for operations and services" },
  { name: "Hewlett Packard Enterprise", category: "Cloud & Datacenter", description: "Enterprise servers, storage, and intelligent edge systems" },
  { name: "F5 Networks", category: "Cloud & Datacenter", description: "Application delivery controllers and web application security" },
  { name: "SolarWinds", category: "Software & IT Ops", description: "Powerful network monitoring and system management products" },
  { name: "Crowdstrike", category: "Security", description: "Cloud-native endpoint security, XDR, and incident response" },
  { name: "Forcepoint", category: "Security", description: "Data security, web security, and cloud access security broker" },
  { name: "Fujitsu", category: "Software & IT Ops", description: "Robust business scanners, servers, and computing systems" },
  { name: "Tenable", category: "Security", description: "Nessus vulnerability scanning and exposure management platform" },
  { name: "Nutanix", category: "Cloud & Datacenter", description: "Hyperconverged infrastructure (HCI) and cloud computing software" },
  { name: "Proofpoint", category: "Security", description: "Inbound and outbound email protection and information security" },
  { name: "Cisco Systems", category: "Network", description: "The global benchmark in networking and communications hardware" },
  { name: "Ruijie | Reyee", category: "Network", description: "Innovative, cost-effective enterprise wireless and switching" },
  { name: "Red Hat", category: "Software & IT Ops", description: "Enterprise Linux, open-source middleware, and Kubernetes" },
  { name: "Zimbra", category: "Software & IT Ops", description: "Collaborative email and messaging suite for large enterprises" },
  { name: "Jumpcloud", category: "Security", description: "Directory-as-a-Service, cloud directory, and single sign-on" },
  { name: "CyberArk", category: "Security", description: "The world leader in privileged access management (PAM) solutions" },
  { name: "Juniper Networks", category: "Network", description: "High-performance AI-driven routing, switching, and SD-WAN" },
  { name: "Hitachi Vantara", category: "Cloud & Datacenter", description: "Enterprise-grade storage arrays and data ops platforms" },
  { name: "Sophos", category: "Security", description: "Synchronized cybersecurity, endpoint defense, and firewalls" },
  { name: "Infoblox", category: "Network", description: "Secure DDI (DNS, DHCP, and IP address management) solutions" },
  { name: "Ruckus Commscope", category: "Network", description: "Ultra-high density Wi-Fi, switching, and fiber cabling" },
  { name: "Aruba Networks", category: "Network", description: "Intelligent edge switches, wireless access points, and ClearPass" },
  { name: "Nakivo", category: "Cloud & Datacenter", description: "Fast, reliable, and cost-effective backup and recovery" },
  { name: "Lenovo", category: "Software & IT Ops", description: "Enterprise ThinkPad notebooks, PC clients, and server arrays" }
];

export const CERTIFICATIONS: CertificationItem[] = [
  { name: "CCNA", issuer: "Cisco", description: "Cisco Certified Network Associate", iconName: "Award" },
  { name: "Cisco Specialist", issuer: "Cisco", description: "Advanced Enterprise Routing or Collaboration Specialist", iconName: "ShieldAlert" },
  { name: "CCNP", issuer: "Cisco", description: "Cisco Certified Network Professional (Enterprise/Security/Collaboration)", iconName: "Award" },
  { name: "CCIE", issuer: "Cisco", description: "Cisco Certified Internetwork Expert - Highest echelon networking validation", iconName: "ShieldCheck" },
  { name: "CEH", issuer: "EC-Council", description: "Certified Ethical Hacker - Penetration testing & audit specialist", iconName: "Lock" },
  { name: "Huawei HCIP/HCIE", issuer: "Huawei", description: "Huawei Certified ICT Professional / Expert", iconName: "Cpu" },
  { name: "Fortinet NSE", issuer: "Fortinet", description: "Network Security Expert certifications (NSE 4 to NSE 8)", iconName: "Fingerprint" },
  { name: "PCNSE", issuer: "Palo Alto", description: "Palo Alto Networks Certified Network Security Engineer", iconName: "Shield" },
  { name: "Security+", issuer: "CompTIA", description: "CompTIA Security+ industry cybersecurity benchmark", iconName: "Lock" },
  { name: "ITIL Foundation", issuer: "AXELOS", description: "IT Service Management best practices framework", iconName: "GitMerge" },
  { name: "Oracle Associate", issuer: "Oracle", description: "Oracle Certified Associate Database / Java Administrator", iconName: "Database" },
  { name: "HPE ASE", issuer: "HPE", description: "Hewlett Packard Enterprise Accredited Solutions Expert", iconName: "HardDrive" },
  { name: "Sophos Certified Engineer", issuer: "Sophos", description: "Certified Architect and Engineer for Sophos solutions", iconName: "Server" },
  { name: "Blue Coat Certified", issuer: "Symantec", description: "Blue Coat Web Security Administrator", iconName: "Activity" },
  { name: "Cisco Meraki Fit", issuer: "Cisco", description: "Meraki Cloud Managed Network Operator", iconName: "Radio" },
  { name: "Crowdstrike Certified", issuer: "Crowdstrike", description: "Falcon Administrator & Responder Certification", iconName: "Zap" }
];

export const CLIENTS: ClientItem[] = [
  { name: "Prodia", category: "Enterprise & Professional" },
  { name: "Savasa Smart Lifestyle", category: "Enterprise & Professional" },
  { name: "Telkomsel", category: "Telecommunications" },
  { name: "Telkomsigma", category: "Telecommunications" },
  { name: "Biro Klasifikasi Indonesia", category: "Government & Public" },
  { name: "Kominfo", category: "Government & Public" },
  { name: "Nera", category: "Telecommunications" },
  { name: "Bank Bengkulu", category: "Finance & Insurance" },
  { name: "AKHH Lawyers", category: "Enterprise & Professional" },
  { name: "Adnan Kelana Haryanto & Hermanto", category: "Enterprise & Professional" },
  { name: "Halal Indonesia", category: "Government & Public" },
  { name: "Unifiber by Asianet", category: "Telecommunications" },
  { name: "Assegaf Hamzah & Partners", category: "Enterprise & Professional" },
  { name: "Asaba Innotech", category: "Enterprise & Professional" },
  { name: "PT. Data Prima Solusi", category: "Enterprise & Professional" },
  { name: "Askrindo Syariah", category: "Finance & Insurance" },
  { name: "Etiqa Insurance", category: "Finance & Insurance" },
  { name: "Smartfren", category: "Telecommunications" },
  { name: "Aviro", category: "Enterprise & Professional" },
  { name: "Caraka Bhuwana", category: "Enterprise & Professional" },
  { name: "Akar Inti Teknologi", category: "Enterprise & Professional" },
  { name: "Sisindokom", category: "Enterprise & Professional" },
  { name: "Clipan Finance", category: "Finance & Insurance" },
  { name: "PT. Jaya Boga Wisesa (JBW)", category: "Enterprise & Professional" },
  { name: "AdaPundi", category: "Finance & Insurance" },
  { name: "Tugure", category: "Finance & Insurance" }
];

export const OFFICE_CONTACT = {
  name: "PT. Qualita Global Teknologi",
  building: "CIBIS NINE Building Lt. 11/SUITE E",
  street: "Jl. TB Simatupang No.2, RT.1/RW.5, Cilandak Timur, Kec. Pasar Minggu",
  city: "Kota Jakarta Selatan",
  province: "Daerah Khusus Ibukota Jakarta",
  postalCode: "12560",
  phone: "(021)50101562",
  email: "sales@qualitatech.id",
  mapIframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7337965825227!2d106.80907577555627!3d-6.298748393690408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f21df928a6f3%3A0xc4f9b8c0da5b23d9!2sCIBIS%20NINE!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
};
