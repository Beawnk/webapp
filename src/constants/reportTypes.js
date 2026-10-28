import dangerIcon from '@/assets/images/icons/danger.png';
import femenineIcon from '@/assets/images/icons/femenine.png';
import robberIcon from '@/assets/images/icons/robber.png';
import accidentIcon from '@/assets/images/icons/accident.png';
import disasterIcon from '@/assets/images/icons/disaster.png';
import pawprintIcon from '@/assets/images/icons/pawprint.png';
import defaultIcon from '@/assets/images/icons/alarm.png';

// The label is what gets saved in Reports.Type and used in /new-report/:type
export const reportTypes = [
  { icon: dangerIcon, label: 'Incêndio' },
  { icon: femenineIcon, label: 'Violência doméstica' },
  { icon: robberIcon, label: 'Assalto' },
  { icon: accidentIcon, label: 'Acidente de trânsito' },
  { icon: disasterIcon, label: 'Árvore caída' },
  { icon: pawprintIcon, label: 'Animal perdido' },
];

export const isReportType = (type) => reportTypes.some((item) => item.label === type);

export const getReportIcon = (type) =>
  reportTypes.find((item) => item.label === type)?.icon || defaultIcon;
