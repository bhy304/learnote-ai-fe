export const formatDate = () => {
  const year = new Date().getFullYear();
  const startDate = new Date(year - 1, 11, 31);
  const endDate = new Date(year, 11, 31);

  return { startDate, endDate };
};
