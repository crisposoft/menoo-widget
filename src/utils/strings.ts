export const getSlug = (str: string) => {
  const normalizedStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalizedStr.toLowerCase().replace(/[^a-z0-9]+/g, "-");
};
