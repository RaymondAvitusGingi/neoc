// Seed content, ported from the NEOC company profile (matches the approved prototype).
// This is the shape the admin panel edits and the shape a future Firestore document will hold.

export const FIBERS = [
  ['Blue', '#1F6FD1'],
  ['Orange', '#F08A24'],
  ['Green', '#2E9E4F'],
  ['Brown', '#8A5A2B'],
  ['Slate', '#7D8A93'],
  ['White', '#E9EDEE'],
  ['Red', '#D63A3A'],
  ['Black', '#1C1C1C'],
  ['Yellow', '#E5C12A'],
  ['Violet', '#7E4BC4'],
  ['Rose', '#E98AA8'],
  ['Aqua', '#2EC4C4'],
]

export function fiber(i) {
  return FIBERS[((Number(i) || 0) % 12 + 12) % 12]
}

export const ROLES = {
  superadmin: { label: 'Super Admin', desc: 'Everything, including creating and removing users.' },
  editor: { label: 'Editor', desc: 'Edits all website content, posts and deletes jobs, handles messages.' },
  viewer: { label: 'Viewer', desc: 'Can look at the dashboard, jobs and messages, but cannot change anything.' },
}

export const DEMO_LOGIN = { username: 'admin', password: 'neoc2026' }

export const DEFAULT_CONTENT = {
  company: {
    name: 'NEOC TECHNOLOGY COMPANY LIMITED',
    tagline: 'Connecting Technology. Empowering Business.',
    address: 'Kijitonyama Mabatini Road, Dar es Salaam, Tanzania',
    postal: 'P.O. Box 31317',
    email: 'neocgr9@gmail.com',
    phone1: '+255 629 101 982',
    phone2: '+255 763 989 246',
    reg: '203431848',
    tin: '203431848',
    country: 'Tanzania',
    md: 'JONIPHACE MUYAMA PHILMON',
    established: 'May 2026',
  },
  hero: {
    eyebrow: 'IT · Networks · Data Centres · Power · Security',
    headline: 'Dependable technology infrastructure for Tanzania and East Africa.',
    sub: 'We design, supply, install and maintain the servers, networks, fibre, power and security systems that keep organisations running.',
  },
  about:
    'NEOC TECHNOLOGY COMPANY LIMITED is a technology-focused company established to provide reliable, innovative, and cost-effective services to businesses, government institutions, telecom operators, and individual clients.\n\nWe support digital transformation by delivering technology products, infrastructure solutions, professional technical services, and ongoing IT support. We help organisations improve operational efficiency, strengthen information security, enhance connectivity, and build dependable technology environments.\n\nThrough a customer-focused approach, technical expertise, and commitment to quality, we aim to become a trusted technology partner for organisations across Tanzania and the wider East African region.',
  vision:
    'To become a leading and trusted technology solutions provider in Tanzania and East Africa, recognised for innovation, reliability, service excellence, and sustainable digital transformation.',
  mission:
    'To deliver dependable, secure, and innovative technology solutions that enable our clients to achieve their business objectives, improve productivity, reduce operational risks, and adapt to the changing digital environment.',
  values: [
    { t: 'Integrity', d: 'Conducting business honestly, transparently, and professionally.' },
    { t: 'Innovation', d: 'Embracing modern technologies to solve business challenges.' },
    { t: 'Customer Focus', d: 'Understanding client needs and delivering practical solutions.' },
    { t: 'Quality', d: 'Maintaining high standards in products, installation, and technical services.' },
    { t: 'Reliability', d: 'Providing dependable solutions and responsive technical support.' },
    { t: 'Security', d: 'Promoting information security and responsible technology management.' },
    { t: 'Continuous Improvement', d: 'Developing our skills, services, and operational processes.' },
  ],
  services: [
    {
      title: 'IT Infrastructure',
      fiber: 0,
      isVisible: true,
      summary: 'Servers, computers and the infrastructure work that keeps them running.',
      items: [
        'Enterprise servers and server accessories',
        'Desktop computers, laptops, and workstations',
        'Enterprise hardware installation and configuration',
        'IT infrastructure upgrades and maintenance',
        'Data centre infrastructure solutions',
      ],
    },
    {
      title: 'Networking & Telecommunications',
      fiber: 1,
      isVisible: true,
      summary: 'Reliable communication infrastructure, from design to day-to-day maintenance.',
      items: [
        'Enterprise network design and implementation',
        'Routers, switches, firewalls, and network accessories',
        'Fibre-optic cabling and structured cabling',
        'Fibre-optic transceivers and connectivity components',
        'LAN, WAN, and wireless networking solutions',
        'Network troubleshooting, optimisation, and maintenance',
        'Telecommunications infrastructure support',
      ],
    },
    {
      title: 'Data Centre & Enterprise Solutions',
      fiber: 2,
      isVisible: true,
      summary: 'Secure, efficient and scalable IT operations for enterprise environments.',
      items: [
        'Data centre equipment supply and installation',
        'Server and storage deployment',
        'Enterprise switching and routing',
        'Fibre Channel and storage-area networking (SAN)',
        'Infrastructure troubleshooting',
        'Equipment migration',
        'Preventive maintenance and technical support',
      ],
    },
    {
      title: 'IT Consultancy & Technical Support',
      fiber: 3,
      isVisible: true,
      summary: 'Informed technology decisions and reliable day-to-day IT operations.',
      items: [
        'IT infrastructure assessment and planning',
        'Technology selection and procurement support',
        'System installation and configuration',
        'Network performance troubleshooting',
        'IT maintenance and operational support',
        'Technical documentation and knowledge transfer',
      ],
    },
    {
      title: 'Electrical Equipment & Generators',
      fiber: 4,
      isVisible: true,
      summary: 'Installation, testing and commissioning of electrical equipment and standby generators for uninterrupted power.',
      items: [
        'Site preparation and electrical distribution equipment',
        'Generator positioning, mounting and power cabling',
        'Earthing, grounding and connection to the main system',
        'Automatic transfer switch (ATS) integration',
        'Safety checks, functional and load testing',
      ],
    },
    {
      title: 'CCTV & Electric Fence',
      fiber: 6,
      isVisible: true,
      summary: 'Surveillance and perimeter security to prevent unauthorised access and protect property.',
      items: [
        'CCTV installation, configuration and commissioning',
        'Fence insulators, brackets and wire tensioning',
        'Energiser installation and power connection',
        'Earthing, grounding and warning signs',
        'Integration with the wider security system',
      ],
    },
    {
      title: 'Hardware Supply & Procurement',
      fiber: 8,
      isVisible: true,
      summary: 'Sourcing suitable technology products to agreed specifications and warranty terms.',
      items: [
        'Servers, storage, and computing equipment',
        'Network switches, routers, and firewalls',
        'Fibre-optic and structured cabling materials',
        'Data centre accessories and related components',
        'IT peripherals and office technology equipment',
        'Replacement parts and compatible accessories',
      ],
    },
  ],
  markets: [
    'Telecommunications companies',
    'Government & public sector',
    'Banks & financial services',
    'Corporate & private enterprises',
    'Internet service providers',
    'Educational institutions',
    'Healthcare organisations',
    'Data centres & tech providers',
    'Small & medium enterprises',
  ],
  why: [
    { t: 'Customer-oriented solutions', d: "We start from each client's requirements and recommend technology that fits them." },
    { t: 'Technical capability', d: 'Professional installation, configuration, troubleshooting, and maintenance.' },
    { t: 'Reliable products', d: 'Equipment sourced to meet agreed technical requirements and quality expectations.' },
    { t: 'Cost-effective delivery', d: 'Practical solutions that balance performance, reliability, and budget.' },
    { t: 'Security and reliability', d: 'Protecting information systems and maintaining business continuity.' },
    { t: 'Long-term partnerships', d: 'Relationships built on trust, accountability, communication, and dependable support.' },
  ],
  approach: [
    { t: 'Requirements Assessment', d: "Understand the client's operational needs and technical environment." },
    { t: 'Solution Design', d: 'Develop an appropriate technical solution and implementation plan.' },
    { t: 'Procurement & Preparation', d: 'Identify suitable products and prepare the required resources.' },
    { t: 'Implementation', d: 'Install, configure, and integrate the agreed solution.' },
    { t: 'Testing & Handover', d: 'Verify functionality and provide technical documentation.' },
    { t: 'Maintenance & Support', d: 'Provide agreed follow-up support and maintenance services.' },
  ],
  quality:
    'We follow appropriate technical standards, manufacturer recommendations, safe installation practices, and agreed contractual requirements. We protect client information, maintain confidentiality, and implement technology solutions responsibly.',
  // Empty at launch — shown on the About page only once NEOC holds a certification.
  certifications: [],
  seo: {
    home: { title: 'NEOC Technology — IT, Networks, Data Centres, Power & Security', description: 'IT infrastructure, networking, data centre, power and security solutions in Dar es Salaam, Tanzania.' },
  },
  updatedAt: null,
}

export function cloneDefaults() {
  return structuredClone(DEFAULT_CONTENT)
}

export function mergeWithDefaults(data) {
  const out = cloneDefaults()
  if (!data || typeof data !== 'object') return out
  for (const key of Object.keys(out)) {
    if (data[key] === undefined) continue
    if (out[key] && typeof out[key] === 'object' && !Array.isArray(out[key]) && typeof data[key] === 'object') {
      out[key] = { ...out[key], ...data[key] }
    } else {
      out[key] = data[key]
    }
  }
  return out
}
