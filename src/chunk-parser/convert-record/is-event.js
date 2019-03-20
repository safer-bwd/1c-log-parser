const VALID_FLD_COUNT = 19;

export default ({ fields }) => {
  const fieldCount = fields.length;
  if (fieldCount !== VALID_FLD_COUNT) {
    return false;
  }
  // TODO validate fields?
  return true;
};
