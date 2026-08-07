export function getAcademicYearOptions() {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let offset = -2; offset <= 1; offset++) {
    const start = currentYear + offset;
    years.push(`${start}/${start + 1}`);
  }
  return years;
}
