// First-launch seed data: 8 realistic found items around UET Lahore.
// These only exist until the user posts real items. Swap this file out
// when the Firebase backend lands.
const HOUR = 3600 * 1000;

export function seedItems() {
  const now = Date.now();
  return [
    {
      id: 'seed-1',
      title: 'Student ID card',
      category: 'ID Cards',
      location: 'Main library, ground floor',
      description:
        'UET student ID card found near the entrance turnstiles. Name and photo kept private, describe them to claim.',
      contactHint: 'Ask for the card found Tuesday morning',
      imageUri: null,
      status: 'open',
      mine: false,
      createdAt: now - 2 * HOUR,
    },
    {
      id: 'seed-2',
      title: 'Casio fx-991ES calculator',
      category: 'Electronics',
      location: 'Civil department, Room 12',
      description:
        'Scientific calculator left on a desk after the morning lecture. Has a small sticker on the back.',
      contactHint: 'Room 214, Edhi Hall after 6pm',
      imageUri: null,
      status: 'open',
      mine: false,
      createdAt: now - 5 * HOUR,
    },
    {
      id: 'seed-3',
      title: 'White AirPods case',
      category: 'Electronics',
      location: 'Edhi Hall mess',
      description:
        'AirPods charging case found on a mess table at dinner time. No earbuds inside.',
      contactHint: 'Message through the app to arrange pickup',
      imageUri: null,
      status: 'open',
      mine: false,
      createdAt: now - 8 * HOUR,
    },
    {
      id: 'seed-4',
      title: 'Brown leather wallet',
      category: 'Wallets',
      location: 'Cricket ground, near pavilion',
      description:
        'Brown leather bifold wallet found on the boundary line. Contents kept private, tell me what is inside to claim.',
      contactHint: 'Call after 5pm, number shared on claim',
      imageUri: null,
      status: 'open',
      mine: false,
      createdAt: now - 26 * HOUR,
    },
    {
      id: 'seed-5',
      title: 'Bike keys with blue keychain',
      category: 'Keys',
      location: 'Academic block parking',
      description:
        'Set of two keys with a blue rubber keychain, found near the bike stands.',
      contactHint: 'Security office, academic block',
      imageUri: null,
      status: 'open',
      mine: false,
      createdAt: now - 30 * HOUR,
    },
    {
      id: 'seed-6',
      title: 'Blue water bottle (750ml)',
      category: 'Other',
      location: 'CS lab 3',
      description:
        'Blue steel water bottle left on the back bench. Has a dent on one side.',
      contactHint: 'CS department office',
      imageUri: null,
      status: 'open',
      mine: false,
      createdAt: now - 2 * 24 * HOUR,
    },
    {
      id: 'seed-7',
      title: 'Thermodynamics lab notebook',
      category: 'Stationery',
      location: 'Mechanical workshop',
      description:
        'Spiral notebook full of thermo lab readings, name on the first page kept private.',
      contactHint: 'Mechanical department notice board contact',
      imageUri: null,
      status: 'open',
      mine: false,
      createdAt: now - 3 * 24 * HOUR,
    },
    {
      id: 'seed-8',
      title: 'Black 32GB USB drive',
      category: 'Electronics',
      location: 'Seminar hall, row C',
      description:
        'Small black USB drive found under a seat after the seminar. Tell me the brand to claim.',
      contactHint: 'Ask at the seminar hall reception',
      imageUri: null,
      status: 'open',
      mine: false,
      createdAt: now - 4 * 24 * HOUR,
    },
  ];
}
