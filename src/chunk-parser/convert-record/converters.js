const removeQuotes = s => s.slice(1, s.length - 1);
export const toString = v => removeQuotes(v);

export const toNumber = v => Number(v);

export const toDate = (v) => {
  const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
  const result = v.match(new RegExp(pattern));
  const [, yyyy, MM, dd, HH, mm, ss] = result;
  return new Date(`${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}Z`);
};

export const hexToDec = v => parseInt(v, 16);
