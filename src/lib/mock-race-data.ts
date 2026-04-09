export interface Athlete {
  bib: string;
  name: string;
  category: string;
  gender: 'M' | 'F';
  country: string;
  startTime: number; // timestamp
  lastCheckpoint: number; // 0 to 42 (km)
  lastCheckpointTime: number; // timestamp
  status: 'In Course' | 'Finished' | 'Started';
  totalTime?: string;
  pace?: string;
  rank?: number;
}

export const CATEGORIES = ['General', 'Junior', 'Senior', 'Master', 'Veteran'];
export const COUNTRIES = ['MX', 'US', 'ES', 'CO', 'AR', 'BR', 'CA', 'GB', 'FR', 'DE'];

export const INITIAL_ATHLETES: Athlete[] = [
  { bib: '101', name: 'Alejandro Rivera', category: 'Senior', gender: 'M', country: 'MX', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '102', name: 'Elena Martínez', category: 'Senior', gender: 'F', country: 'ES', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '103', name: 'James Wilson', category: 'Master', gender: 'M', country: 'US', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '104', name: 'Sofía Castro', category: 'General', gender: 'F', country: 'CO', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '105', name: 'Carlos Mendoza', category: 'Veteran', gender: 'M', country: 'AR', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '106', name: 'Isabella Silva', category: 'Senior', gender: 'F', country: 'BR', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '107', name: 'Thomas Wright', category: 'Senior', gender: 'M', country: 'CA', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '108', name: 'Sarah Jones', category: 'Senior', gender: 'F', country: 'GB', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '109', name: 'Lucas Dubois', category: 'Master', gender: 'M', country: 'FR', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '110', name: 'Emma Schneider', category: 'General', gender: 'F', country: 'DE', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '111', name: 'Roberto Gómez', category: 'Senior', gender: 'M', country: 'MX', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '112', name: 'Lucía Fernández', category: 'Senior', gender: 'F', country: 'ES', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '113', name: 'Michael Brown', category: 'Master', gender: 'M', country: 'US', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '114', name: 'Gabriela Ortiz', category: 'General', gender: 'F', country: 'CO', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
  { bib: '115', name: 'Mateo Rossi', category: 'Veteran', gender: 'M', country: 'IT', startTime: 0, lastCheckpoint: 0, lastCheckpointTime: 0, status: 'Started' },
].map(a => ({
  ...a,
  startTime: typeof window !== 'undefined' ? Date.now() - Math.random() * 3600000 : 0,
})) as Athlete[];

export const getCountryFlag = (code: string) => {
  const flags: Record<string, string> = {
    MX: '🇲🇽', US: '🇺🇸', ES: '🇪🇸', CO: '🇨🇴', AR: '🇦🇷', BR: '🇧🇷', CA: '🇨🇦', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', IT: '🇮🇹'
  };
  return flags[code] || '🏁';
};
