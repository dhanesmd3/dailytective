// Palet bersama untuk ilustrasi ruangan sementara (dokumen 05 bagian 2).
export const W = {
	tinta: '#1F1812',
	krem: '#F4E7C9',
	mustard: '#E2A72E',
	merah: '#B23A2A',
	hijau: '#2E6B5E',
	biru: '#3E5C8A',
	kayu: '#8B5A2B',
	kayuTua: '#5E3A20',
	kayuSedang: '#6B4426',
	kayuMuda: '#7A4E2D',
	lantai: '#9A6A42',
	garisLantai: '#845733'
} as const;

export function warnaLangit(waktu: string | undefined): string {
	return waktu === 'siang' ? '#A9CFE3' : waktu === 'sore' ? '#E9A35A' : '#22304F';
}
