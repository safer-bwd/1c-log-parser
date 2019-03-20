const VALID_FLD_COUNT = [3, 4];

export default ({ fields }) => {
  const fieldCount = fields.length;
  if (!VALID_FLD_COUNT.includes(fieldCount)) {
    return false;
  }
  // TODO validate fields?
  return true;
};
